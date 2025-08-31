import { 
  users, gasTypes, orders, supplierProfiles, orderTracking, messages, guestSessions,
  ratings, supportTickets, promoCodes, loyaltyPoints, otpVerifications, suspiciousActivities,
  locationUpdates, deliveryRoutes, realtimeEvents,
  type User, type InsertUser, type GasType, type InsertGasType, 
  type Order, type InsertOrder, type SupplierProfile, type InsertSupplierProfile,
  type OrderTracking, type InsertOrderTracking, type Message, type InsertMessage,
  type Rating, type InsertRating, type SupportTicket, type InsertSupportTicket,
  type PromoCode, type InsertPromoCode, type LoyaltyPoints, type InsertLoyaltyPoints,
  type OtpVerification, type InsertOtpVerification, type SuspiciousActivity, type InsertSuspiciousActivity,
  type LocationUpdate, type InsertLocationUpdate, type DeliveryRoute, type InsertDeliveryRoute,
  type RealtimeEvent, type InsertRealtimeEvent
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Gas type operations
  getGasTypes(): Promise<GasType[]>;
  getGasType(id: number): Promise<GasType | undefined>;
  createGasType(gasType: InsertGasType): Promise<GasType>;
  
  // Order operations
  getOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrdersByCustomer(customerId: number): Promise<Order[]>;
  getOrdersBySupplier(supplierId: number): Promise<Order[]>;
  getOrdersByStatus(status: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, order: Partial<InsertOrder>): Promise<Order | undefined>;
  
  // Supplier profile operations
  getSupplierProfile(userId: number): Promise<SupplierProfile | undefined>;
  getSupplierProfiles(): Promise<SupplierProfile[]>;
  getAvailableSuppliers(): Promise<SupplierProfile[]>;
  createSupplierProfile(profile: InsertSupplierProfile): Promise<SupplierProfile>;
  updateSupplierProfile(userId: number, profile: Partial<InsertSupplierProfile>): Promise<SupplierProfile | undefined>;
  
  // Order tracking operations
  getOrderTracking(orderId: number): Promise<OrderTracking[]>;
  createOrderTracking(tracking: InsertOrderTracking): Promise<OrderTracking>;
  
  // Message operations
  getOrderMessages(orderId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // Rating operations
  getRatingsByOrder(orderId: number): Promise<Rating[]>;
  getRatingsBySupplier(supplierId: number): Promise<Rating[]>;
  createRating(rating: InsertRating): Promise<Rating>;
  
  // Support ticket operations
  getSupportTickets(): Promise<SupportTicket[]>;
  getSupportTicketsByUser(userId: number): Promise<SupportTicket[]>;
  createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket>;
  updateSupportTicket(id: number, ticket: Partial<InsertSupportTicket>): Promise<SupportTicket | undefined>;
  
  // Promo code operations
  getPromoCodes(): Promise<PromoCode[]>;
  getPromoCodeByCode(code: string): Promise<PromoCode | undefined>;
  createPromoCode(promoCode: InsertPromoCode): Promise<PromoCode>;
  updatePromoCode(id: number, promoCode: Partial<InsertPromoCode>): Promise<PromoCode | undefined>;
  
  // Loyalty points operations
  getLoyaltyPoints(userId: number): Promise<LoyaltyPoints | undefined>;
  updateLoyaltyPoints(userId: number, points: Partial<InsertLoyaltyPoints>): Promise<LoyaltyPoints>;
  
  // OTP verification operations
  getOtpVerification(orderId: number): Promise<OtpVerification | undefined>;
  createOtpVerification(otp: InsertOtpVerification): Promise<OtpVerification>;
  validateOtp(orderId: number, otpCode: string): Promise<boolean>;
  
  // Suspicious activity operations
  getSuspiciousActivities(): Promise<SuspiciousActivity[]>;
  createSuspiciousActivity(activity: InsertSuspiciousActivity): Promise<SuspiciousActivity>;
  updateSuspiciousActivity(id: number, activity: Partial<InsertSuspiciousActivity>): Promise<SuspiciousActivity | undefined>;

  // Guest session operations
  incrementGuestUsage(guestSessionId: string): Promise<void>;
  
  // GPS Location tracking operations
  getLocationUpdates(orderId: number): Promise<LocationUpdate[]>;
  getLatestLocation(orderId: number): Promise<LocationUpdate | undefined>;
  saveLocationUpdate(location: InsertLocationUpdate): Promise<LocationUpdate>;
  
  // Delivery route operations
  getDeliveryRoute(orderId: number): Promise<DeliveryRoute | undefined>;
  createDeliveryRoute(route: InsertDeliveryRoute): Promise<DeliveryRoute>;
  updateDeliveryRoute(orderId: number, route: Partial<InsertDeliveryRoute>): Promise<DeliveryRoute | undefined>;
  
  // Realtime event operations
  createRealtimeEvent(event: InsertRealtimeEvent): Promise<RealtimeEvent>;
  getUnprocessedEvents(): Promise<RealtimeEvent[]>;
  markEventProcessed(eventId: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private gasTypes: Map<number, GasType> = new Map();
  private orders: Map<number, Order> = new Map();
  private supplierProfiles: Map<number, SupplierProfile> = new Map();
  private orderTracking: Map<number, OrderTracking[]> = new Map();
  private messages: Map<number, Message[]> = new Map();
  private ratings: Map<number, Rating[]> = new Map();
  private supportTickets: Map<number, SupportTicket> = new Map();
  private promoCodes: Map<number, PromoCode> = new Map();
  private loyaltyPoints: Map<number, LoyaltyPoints> = new Map();
  private otpVerifications: Map<number, OtpVerification> = new Map();
  private suspiciousActivities: Map<number, SuspiciousActivity> = new Map();
  
  private userIdCounter = 1;
  private gasTypeIdCounter = 1;
  private orderIdCounter = 1;
  private supplierProfileIdCounter = 1;
  private orderTrackingIdCounter = 1;
  private messageIdCounter = 1;
  private ratingIdCounter = 1;
  private supportTicketIdCounter = 1;
  private promoCodeIdCounter = 1;
  private loyaltyPointsIdCounter = 1;
  private otpVerificationIdCounter = 1;
  private suspiciousActivityIdCounter = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize default gas types
    const defaultGasTypes: InsertGasType[] = [
      { name: "3kg", price: "2500", isActive: true },
      { name: "6kg", price: "4500", isActive: true },
      { name: "12.5kg", price: "8500", isActive: true },
      { name: "15kg", price: "9500", isActive: true },
      { name: "20kg", price: "12000", isActive: true },
      { name: "48kg", price: "25000", isActive: true },
    ];

    defaultGasTypes.forEach(gasType => {
      this.createGasType(gasType);
    });

    // Initialize admin user
    this.createUser({
      username: "admin",
      password: "admin123",
      role: "admin",
      fullName: "System Admin",
      phone: "+2341234567890",
      address: "Lagos, Nigeria",
      isActive: true,
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: this.userIdCounter++,
      createdAt: new Date(),
      address: insertUser.address || null,
      role: insertUser.role || "customer",
      isActive: insertUser.isActive !== undefined ? insertUser.isActive : true,
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: number, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updateData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Gas type operations
  async getGasTypes(): Promise<GasType[]> {
    return Array.from(this.gasTypes.values()).filter(gasType => gasType.isActive);
  }

  async getGasType(id: number): Promise<GasType | undefined> {
    return this.gasTypes.get(id);
  }

  async createGasType(insertGasType: InsertGasType): Promise<GasType> {
    const gasType: GasType = {
      ...insertGasType,
      id: this.gasTypeIdCounter++,
      isActive: insertGasType.isActive !== undefined ? insertGasType.isActive : true,
    };
    this.gasTypes.set(gasType.id, gasType);
    return gasType;
  }

  // Order operations
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrdersByCustomer(customerId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.customerId === customerId);
  }

  async getOrdersBySupplier(supplierId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.supplierId === supplierId);
  }

  async getOrdersByStatus(status: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.status === status);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const order: Order = {
      ...insertOrder,
      id: this.orderIdCounter++,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: insertOrder.status || "pending",
      supplierId: insertOrder.supplierId || null,
      specialNotes: insertOrder.specialNotes || null,
      paymentMethod: insertOrder.paymentMethod || "cash",
      deliveryFee: insertOrder.deliveryFee || "300",
      estimatedDeliveryTime: insertOrder.estimatedDeliveryTime || null,
    };
    this.orders.set(order.id, order);
    
    // Create initial tracking entry
    await this.createOrderTracking({
      orderId: order.id,
      status: "pending",
      message: "Order placed successfully",
    });
    
    return order;
  }

  async updateOrder(id: number, updateData: Partial<InsertOrder>): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, ...updateData, updatedAt: new Date() };
    this.orders.set(id, updatedOrder);
    
    // Create tracking entry for status changes
    if (updateData.status) {
      await this.createOrderTracking({
        orderId: id,
        status: updateData.status,
        message: `Order status updated to ${updateData.status}`,
      });
    }
    
    return updatedOrder;
  }

  // Supplier profile operations
  async getSupplierProfile(userId: number): Promise<SupplierProfile | undefined> {
    return Array.from(this.supplierProfiles.values()).find(profile => profile.userId === userId);
  }

  async getSupplierProfiles(): Promise<SupplierProfile[]> {
    return Array.from(this.supplierProfiles.values());
  }

  async getAvailableSuppliers(): Promise<SupplierProfile[]> {
    return Array.from(this.supplierProfiles.values()).filter(profile => 
      profile.isAvailable && profile.isVerified
    );
  }

  async createSupplierProfile(insertProfile: InsertSupplierProfile): Promise<SupplierProfile> {
    const profile: SupplierProfile = {
      ...insertProfile,
      id: this.supplierProfileIdCounter++,
      businessLicense: insertProfile.businessLicense || null,
      isVerified: insertProfile.isVerified !== undefined ? insertProfile.isVerified : false,
      isAvailable: insertProfile.isAvailable !== undefined ? insertProfile.isAvailable : false,
      rating: insertProfile.rating || "0.00",
      totalDeliveries: insertProfile.totalDeliveries || 0,
      totalEarnings: insertProfile.totalEarnings || "0.00",
    };
    this.supplierProfiles.set(profile.id, profile);
    return profile;
  }

  async updateSupplierProfile(userId: number, updateData: Partial<InsertSupplierProfile>): Promise<SupplierProfile | undefined> {
    const profile = Array.from(this.supplierProfiles.values()).find(p => p.userId === userId);
    if (!profile) return undefined;
    
    const updatedProfile = { ...profile, ...updateData };
    this.supplierProfiles.set(profile.id, updatedProfile);
    return updatedProfile;
  }

  // Order tracking operations
  async getOrderTracking(orderId: number): Promise<OrderTracking[]> {
    return this.orderTracking.get(orderId) || [];
  }

  async createOrderTracking(insertTracking: InsertOrderTracking): Promise<OrderTracking> {
    const tracking: OrderTracking = {
      ...insertTracking,
      id: this.orderTrackingIdCounter++,
      timestamp: new Date(),
      message: insertTracking.message || null,
    };
    
    const orderTrackingList = this.orderTracking.get(insertTracking.orderId) || [];
    orderTrackingList.push(tracking);
    this.orderTracking.set(insertTracking.orderId, orderTrackingList);
    
    return tracking;
  }

  // Message operations
  async getOrderMessages(orderId: number): Promise<Message[]> {
    return this.messages.get(orderId) || [];
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const message: Message = {
      ...insertMessage,
      id: this.messageIdCounter++,
      timestamp: new Date(),
    };
    
    const messageList = this.messages.get(insertMessage.orderId) || [];
    messageList.push(message);
    this.messages.set(insertMessage.orderId, messageList);
    
    return message;
  }

  // Placeholder implementations for missing methods
  async getRatingsByOrder(orderId: number): Promise<Rating[]> { return []; }
  async getRatingsBySupplier(supplierId: number): Promise<Rating[]> { return []; }
  async createRating(rating: InsertRating): Promise<Rating> { throw new Error("Not implemented"); }
  async getSupportTickets(): Promise<SupportTicket[]> { return []; }
  async getSupportTicketsByUser(userId: number): Promise<SupportTicket[]> { return []; }
  async createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket> { throw new Error("Not implemented"); }
  async updateSupportTicket(id: number, ticket: Partial<InsertSupportTicket>): Promise<SupportTicket | undefined> { return undefined; }
  async getPromoCodes(): Promise<PromoCode[]> { return []; }
  async getPromoCodeByCode(code: string): Promise<PromoCode | undefined> { return undefined; }
  async createPromoCode(promoCode: InsertPromoCode): Promise<PromoCode> { throw new Error("Not implemented"); }
  async updatePromoCode(id: number, promoCode: Partial<InsertPromoCode>): Promise<PromoCode | undefined> { return undefined; }
  async getLoyaltyPoints(userId: number): Promise<LoyaltyPoints | undefined> { return undefined; }
  async updateLoyaltyPoints(userId: number, points: Partial<InsertLoyaltyPoints>): Promise<LoyaltyPoints> { throw new Error("Not implemented"); }
  async getOtpVerification(orderId: number): Promise<OtpVerification | undefined> { return undefined; }
  async createOtpVerification(otp: InsertOtpVerification): Promise<OtpVerification> { throw new Error("Not implemented"); }
  async validateOtp(orderId: number, otpCode: string): Promise<boolean> { return false; }
  async getSuspiciousActivities(): Promise<SuspiciousActivity[]> { return []; }
  async createSuspiciousActivity(activity: InsertSuspiciousActivity): Promise<SuspiciousActivity> { throw new Error("Not implemented"); }
  async updateSuspiciousActivity(id: number, activity: Partial<InsertSuspiciousActivity>): Promise<SuspiciousActivity | undefined> { return undefined; }

  // Guest session operations - simple in-memory tracking (for demo purposes)
  private guestUsage = new Map<string, number>();
  
  async incrementGuestUsage(guestSessionId: string): Promise<void> {
    const currentUsage = this.guestUsage.get(guestSessionId) || 0;
    this.guestUsage.set(guestSessionId, currentUsage + 1);
    console.log(`Guest ${guestSessionId} usage incremented to ${currentUsage + 1}`);
  }
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db.update(users).set(updateData).where(eq(users.id, id)).returning();
    return user || undefined;
  }

  // Gas type operations
  async getGasTypes(): Promise<GasType[]> {
    return await db.select().from(gasTypes).where(eq(gasTypes.isActive, true));
  }

  async getGasType(id: number): Promise<GasType | undefined> {
    const [gasType] = await db.select().from(gasTypes).where(eq(gasTypes.id, id));
    return gasType || undefined;
  }

  async createGasType(insertGasType: InsertGasType): Promise<GasType> {
    const [gasType] = await db.insert(gasTypes).values(insertGasType).returning();
    return gasType;
  }

  // Order operations
  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async getOrdersByCustomer(customerId: number): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.customerId, customerId));
  }

  async getOrdersBySupplier(supplierId: number): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.supplierId, supplierId));
  }

  async getOrdersByStatus(status: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.status, status));
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values(insertOrder).returning();
    return order;
  }

  async updateOrder(id: number, updateData: Partial<InsertOrder>): Promise<Order | undefined> {
    const [order] = await db.update(orders).set(updateData).where(eq(orders.id, id)).returning();
    return order || undefined;
  }

  // Supplier profile operations
  async getSupplierProfile(userId: number): Promise<SupplierProfile | undefined> {
    const [profile] = await db.select().from(supplierProfiles).where(eq(supplierProfiles.userId, userId));
    return profile || undefined;
  }

  async getSupplierProfiles(): Promise<SupplierProfile[]> {
    return await db.select().from(supplierProfiles);
  }

  async getAvailableSuppliers(): Promise<SupplierProfile[]> {
    return await db.select().from(supplierProfiles).where(and(eq(supplierProfiles.isAvailable, true), eq(supplierProfiles.isVerified, true)));
  }

  async createSupplierProfile(insertProfile: InsertSupplierProfile): Promise<SupplierProfile> {
    const [profile] = await db.insert(supplierProfiles).values(insertProfile).returning();
    return profile;
  }

  async updateSupplierProfile(userId: number, updateData: Partial<InsertSupplierProfile>): Promise<SupplierProfile | undefined> {
    const [profile] = await db.update(supplierProfiles).set(updateData).where(eq(supplierProfiles.userId, userId)).returning();
    return profile || undefined;
  }

  // Order tracking operations
  async getOrderTracking(orderId: number): Promise<OrderTracking[]> {
    return await db.select().from(orderTracking).where(eq(orderTracking.orderId, orderId));
  }

  async createOrderTracking(insertTracking: InsertOrderTracking): Promise<OrderTracking> {
    const [tracking] = await db.insert(orderTracking).values(insertTracking).returning();
    return tracking;
  }

  // Message operations
  async getOrderMessages(orderId: number): Promise<Message[]> {
    return await db.select().from(messages).where(eq(messages.orderId, orderId));
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values(insertMessage).returning();
    return message;
  }

  // Placeholder implementations for missing methods
  async getRatingsByOrder(orderId: number): Promise<Rating[]> { return []; }
  async getRatingsBySupplier(supplierId: number): Promise<Rating[]> { return []; }
  async createRating(rating: InsertRating): Promise<Rating> { throw new Error("Not implemented"); }
  async getSupportTickets(): Promise<SupportTicket[]> { return []; }
  async getSupportTicketsByUser(userId: number): Promise<SupportTicket[]> { return []; }
  async createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket> { throw new Error("Not implemented"); }
  async updateSupportTicket(id: number, ticket: Partial<InsertSupportTicket>): Promise<SupportTicket | undefined> { return undefined; }
  async getPromoCodes(): Promise<PromoCode[]> { return []; }
  async getPromoCodeByCode(code: string): Promise<PromoCode | undefined> { return undefined; }
  async createPromoCode(promoCode: InsertPromoCode): Promise<PromoCode> { throw new Error("Not implemented"); }
  async updatePromoCode(id: number, promoCode: Partial<InsertPromoCode>): Promise<PromoCode | undefined> { return undefined; }
  async getLoyaltyPoints(userId: number): Promise<LoyaltyPoints | undefined> { return undefined; }
  async updateLoyaltyPoints(userId: number, points: Partial<InsertLoyaltyPoints>): Promise<LoyaltyPoints> { throw new Error("Not implemented"); }
  async getOtpVerification(orderId: number): Promise<OtpVerification | undefined> { return undefined; }
  async createOtpVerification(otp: InsertOtpVerification): Promise<OtpVerification> { throw new Error("Not implemented"); }
  async validateOtp(orderId: number, otpCode: string): Promise<boolean> { return false; }
  async getSuspiciousActivities(): Promise<SuspiciousActivity[]> { return []; }
  async createSuspiciousActivity(activity: InsertSuspiciousActivity): Promise<SuspiciousActivity> { throw new Error("Not implemented"); }
  async updateSuspiciousActivity(id: number, activity: Partial<InsertSuspiciousActivity>): Promise<SuspiciousActivity | undefined> { return undefined; }

  // Guest session operations - use database for persistent tracking
  async incrementGuestUsage(guestSessionId: string): Promise<void> {
    try {
      // Update or create guest session usage
      const [existingSession] = await db.select().from(guestSessions).where(eq(guestSessions.sessionId, guestSessionId));
      
      if (existingSession) {
        await db.update(guestSessions)
          .set({ usageCount: existingSession.usageCount + 1 })
          .where(eq(guestSessions.sessionId, guestSessionId));
      } else {
        await db.insert(guestSessions).values({
          sessionId: guestSessionId,
          usageCount: 1,
        });
      }
      
      console.log(`Guest ${guestSessionId} usage incremented`);
    } catch (error) {
      console.error("Failed to increment guest usage:", error);
    }
  }

  // GPS Location tracking operations
  async getLocationUpdates(orderId: number): Promise<LocationUpdate[]> {
    return await db.select().from(locationUpdates)
      .where(eq(locationUpdates.orderId, orderId))
      .orderBy(locationUpdates.timestamp);
  }

  async getLatestLocation(orderId: number): Promise<LocationUpdate | undefined> {
    const [location] = await db.select().from(locationUpdates)
      .where(eq(locationUpdates.orderId, orderId))
      .orderBy(locationUpdates.timestamp)
      .limit(1);
    return location;
  }

  async saveLocationUpdate(location: InsertLocationUpdate): Promise<LocationUpdate> {
    const [saved] = await db.insert(locationUpdates).values(location).returning();
    return saved;
  }

  // Delivery route operations
  async getDeliveryRoute(orderId: number): Promise<DeliveryRoute | undefined> {
    const [route] = await db.select().from(deliveryRoutes)
      .where(eq(deliveryRoutes.orderId, orderId));
    return route;
  }

  async createDeliveryRoute(route: InsertDeliveryRoute): Promise<DeliveryRoute> {
    const [created] = await db.insert(deliveryRoutes).values(route).returning();
    return created;
  }

  async updateDeliveryRoute(orderId: number, route: Partial<InsertDeliveryRoute>): Promise<DeliveryRoute | undefined> {
    const [updated] = await db.update(deliveryRoutes)
      .set(route)
      .where(eq(deliveryRoutes.orderId, orderId))
      .returning();
    return updated;
  }

  // Realtime event operations
  async createRealtimeEvent(event: InsertRealtimeEvent): Promise<RealtimeEvent> {
    const [created] = await db.insert(realtimeEvents).values(event).returning();
    return created;
  }

  async getUnprocessedEvents(): Promise<RealtimeEvent[]> {
    return await db.select().from(realtimeEvents)
      .where(eq(realtimeEvents.isProcessed, false))
      .orderBy(realtimeEvents.createdAt);
  }

  async markEventProcessed(eventId: number): Promise<void> {
    await db.update(realtimeEvents)
      .set({ isProcessed: true })
      .where(eq(realtimeEvents.id, eventId));
  }
}

export const storage = new DatabaseStorage();
