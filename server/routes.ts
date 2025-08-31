import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import connectPg from "connect-pg-simple";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { realtimeService } from "./websocket";
import { insertUserSchema, insertOrderSchema, insertSupplierProfileSchema, insertMessageSchema, loginSchema, insertLocationUpdateSchema } from "@shared/schema";
import { z } from "zod";

// Authentication middleware
function requireAuth(req: any, res: any, next: any) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}

// Role-based access middleware
function requireRole(...roles: string[]) {
  return (req: any, res: any, next: any) => {
    if (!req.session.userId || !req.session.userRole) {
      return res.status(401).json({ message: "Authentication required" });
    }
    if (!roles.includes(req.session.userRole)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session configuration
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });

  app.use(session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || "your-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl,
    },
  }));
  
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Hash password before storing
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const userWithHashedPassword = { ...userData, password: hashedPassword };
      
      const user = await storage.createUser(userWithHashedPassword);
      
      // Create session
      (req as any).session.userId = user.id;
      (req as any).session.userRole = user.role;
      
      res.status(201).json({ 
        user: { ...user, password: undefined },
        authenticated: true 
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid user data", error });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Update last login
      await storage.updateUser(user.id, { lastLoginAt: new Date() });
      
      // Create session
      (req as any).session.userId = user.id;
      (req as any).session.userRole = user.role;
      
      res.json({ 
        user: { ...user, password: undefined },
        authenticated: true 
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({ message: "Login failed", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.post("/api/auth/logout", requireAuth, async (req, res) => {
    try {
      (req as any).session.destroy((err: any) => {
        if (err) {
          return res.status(500).json({ message: "Failed to logout" });
        }
        res.json({ message: "Logged out successfully" });
      });
    } catch (error) {
      res.status(500).json({ message: "Logout failed", error });
    }
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser((req as any).session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ 
        user: { ...user, password: undefined },
        authenticated: true 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get user", error });
    }
  });

  // Gas types routes with aggressive caching
  app.get("/api/gas-types", async (req, res) => {
    try {
      // Add cache headers for better performance
      res.set({
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400', // Cache for 1 hour, serve stale for 24 hours
        'ETag': '"gas-types-v1"',
        'Last-Modified': new Date().toUTCString()
      });
      
      // Check if client has cached version
      if (req.headers['if-none-match'] === '"gas-types-v1"') {
        return res.status(304).end();
      }
      
      const gasTypes = await storage.getGasTypes();
      res.json(gasTypes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch gas types", error });
    }
  });

  // Order routes
  app.get("/api/orders", async (req, res) => {
    try {
      const { customerId, supplierId, status } = req.query;
      
      let orders;
      if (customerId) {
        orders = await storage.getOrdersByCustomer(Number(customerId));
      } else if (supplierId) {
        orders = await storage.getOrdersBySupplier(Number(supplierId));
      } else if (status) {
        orders = await storage.getOrdersByStatus(String(status));
      } else {
        orders = await storage.getOrders();
      }
      
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders", error });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(Number(req.params.id));
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order", error });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ message: "Invalid order data", error });
    }
  });

  app.patch("/api/orders/:id", async (req, res) => {
    try {
      const updates = req.body;
      const order = await storage.updateOrder(Number(req.params.id), updates);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Check if order is completed and has a guest session ID
      if (updates.status === "delivered" && order.guestSessionId) {
        // Increment guest usage count
        await storage.incrementGuestUsage(order.guestSessionId);
      }
      
      res.json(order);
    } catch (error) {
      res.status(400).json({ message: "Failed to update order", error });
    }
  });

  // Supplier routes
  app.get("/api/suppliers", async (req, res) => {
    try {
      const suppliers = await storage.getSupplierProfiles();
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch suppliers", error });
    }
  });

  app.get("/api/suppliers/available", async (req, res) => {
    try {
      const suppliers = await storage.getAvailableSuppliers();
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch available suppliers", error });
    }
  });

  app.get("/api/suppliers/:userId", async (req, res) => {
    try {
      const profile = await storage.getSupplierProfile(Number(req.params.userId));
      if (!profile) {
        return res.status(404).json({ message: "Supplier profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch supplier profile", error });
    }
  });

  app.post("/api/suppliers", async (req, res) => {
    try {
      const profileData = insertSupplierProfileSchema.parse(req.body);
      const profile = await storage.createSupplierProfile(profileData);
      res.status(201).json(profile);
    } catch (error) {
      res.status(400).json({ message: "Invalid supplier profile data", error });
    }
  });

  app.patch("/api/suppliers/:userId", async (req, res) => {
    try {
      const updates = req.body;
      const profile = await storage.updateSupplierProfile(Number(req.params.userId), updates);
      
      if (!profile) {
        return res.status(404).json({ message: "Supplier profile not found" });
      }
      
      res.json(profile);
    } catch (error) {
      res.status(400).json({ message: "Failed to update supplier profile", error });
    }
  });

  // Order tracking routes
  app.get("/api/orders/:id/tracking", async (req, res) => {
    try {
      const tracking = await storage.getOrderTracking(Number(req.params.id));
      res.json(tracking);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order tracking", error });
    }
  });

  // Message routes
  app.get("/api/orders/:id/messages", async (req, res) => {
    try {
      const messages = await storage.getOrderMessages(Number(req.params.id));
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages", error });
    }
  });

  app.post("/api/orders/:id/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse({
        ...req.body,
        orderId: Number(req.params.id),
      });
      const message = await storage.createMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ message: "Invalid message data", error });
    }
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(Number(req.params.id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ ...user, password: undefined });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user", error });
    }
  });

  // GPS Tracking API routes
  app.get("/api/orders/:orderId/location", async (req, res) => {
    try {
      const latestLocation = await storage.getLatestLocation(Number(req.params.orderId));
      if (!latestLocation) {
        return res.status(404).json({ message: "No location data found" });
      }
      res.json(latestLocation);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch location", error });
    }
  });

  app.get("/api/orders/:orderId/location-history", async (req, res) => {
    try {
      const locationHistory = await storage.getLocationUpdates(Number(req.params.orderId));
      res.json(locationHistory);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch location history", error });
    }
  });

  app.post("/api/orders/:orderId/location", requireAuth, async (req, res) => {
    try {
      const locationData = insertLocationUpdateSchema.parse({
        ...req.body,
        orderId: Number(req.params.orderId),
        supplierId: (req.session as any).userId
      });

      const location = await storage.saveLocationUpdate(locationData);

      // Broadcast location update via WebSocket
      await realtimeService.broadcastStatusUpdate(Number(req.params.orderId), 'location_update', {
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          speed: location.speed,
          timestamp: location.timestamp
        }
      });

      res.status(201).json(location);
    } catch (error) {
      res.status(400).json({ message: "Invalid location data", error });
    }
  });

  app.get("/api/orders/:orderId/route", async (req, res) => {
    try {
      const route = await storage.getDeliveryRoute(Number(req.params.orderId));
      if (!route) {
        return res.status(404).json({ message: "No route found" });
      }
      res.json(route);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch route", error });
    }
  });

  const httpServer = createServer(app);
  
  // Initialize WebSocket server for real-time tracking
  realtimeService.init(httpServer);
  
  return httpServer;
}
