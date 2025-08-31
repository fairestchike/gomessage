import WebSocket from 'ws';
import { WebSocketServer } from 'ws';
import type { Server } from 'http';
import { storage } from './storage';
import type { InsertLocationUpdate, InsertRealtimeEvent } from '@shared/schema';

interface ExtendedWebSocket extends WebSocket {
  userId?: number;
  orderId?: number;
  role?: string;
}

class RealtimeService {
  private wss: WebSocketServer | null = null;
  private clients: Map<number, ExtendedWebSocket[]> = new Map(); // userId -> websockets[]

  init(server: Server) {
    this.wss = new WebSocketServer({ 
      server, 
      path: '/ws' 
    });

    this.wss.on('connection', (ws: ExtendedWebSocket, request) => {
      console.log('New WebSocket connection from', request.socket.remoteAddress);

      ws.on('message', async (data) => {
        try {
          const message = JSON.parse(data.toString());
          await this.handleMessage(ws, message);
        } catch (error) {
          console.error('WebSocket message error:', error);
          ws.send(JSON.stringify({ error: 'Invalid message format' }));
        }
      });

      ws.on('close', () => {
        this.removeClient(ws);
        console.log('WebSocket connection closed');
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.removeClient(ws);
      });
    });

    console.log('WebSocket server initialized on /ws');
  }

  private async handleMessage(ws: ExtendedWebSocket, message: any) {
    const { type, data } = message;

    switch (type) {
      case 'authenticate':
        await this.authenticateClient(ws, data);
        break;
        
      case 'location_update':
        await this.handleLocationUpdate(ws, data);
        break;
        
      case 'subscribe_order':
        this.subscribeToOrder(ws, data.orderId);
        break;
        
      case 'unsubscribe_order':
        this.unsubscribeFromOrder(ws, data.orderId);
        break;
        
      default:
        ws.send(JSON.stringify({ error: 'Unknown message type' }));
    }
  }

  private async authenticateClient(ws: ExtendedWebSocket, data: any) {
    const { userId, role, orderId } = data;
    
    // Verify user exists (you might want to add JWT verification here)
    const user = await storage.getUser(userId);
    if (!user) {
      ws.send(JSON.stringify({ error: 'Invalid user' }));
      return;
    }

    ws.userId = userId;
    ws.role = role;
    ws.orderId = orderId;

    // Add to clients map
    if (!this.clients.has(userId)) {
      this.clients.set(userId, []);
    }
    this.clients.get(userId)!.push(ws);

    ws.send(JSON.stringify({ 
      type: 'authenticated', 
      data: { userId, role } 
    }));
  }

  private async handleLocationUpdate(ws: ExtendedWebSocket, data: any) {
    if (!ws.userId || ws.role !== 'supplier') {
      ws.send(JSON.stringify({ error: 'Unauthorized location update' }));
      return;
    }

    const locationUpdate: InsertLocationUpdate = {
      orderId: data.orderId,
      supplierId: ws.userId,
      latitude: data.latitude.toString(),
      longitude: data.longitude.toString(),
      accuracy: data.accuracy?.toString(),
      speed: data.speed?.toString(),
      bearing: data.bearing?.toString(),
      altitude: data.altitude?.toString(),
    };

    try {
      // Save location update to database
      const saved = await storage.saveLocationUpdate(locationUpdate);

      // Calculate ETA if needed
      const eta = await this.calculateETA(data);

      // Broadcast location update to all clients subscribed to this order
      await this.broadcastToOrder(data.orderId, {
        type: 'location_update',
        data: {
          ...saved,
          eta,
          timestamp: new Date().toISOString()
        }
      });

      // Create realtime event
      await storage.createRealtimeEvent({
        orderId: data.orderId,
        eventType: 'location_update',
        eventData: { ...saved, eta },
        targetUserIds: [], // Will be populated based on order
        isProcessed: false
      });

    } catch (error) {
      console.error('Error saving location update:', error);
      ws.send(JSON.stringify({ error: 'Failed to save location update' }));
    }
  }

  private subscribeToOrder(ws: ExtendedWebSocket, orderId: number) {
    ws.orderId = orderId;
    ws.send(JSON.stringify({ 
      type: 'subscribed', 
      data: { orderId } 
    }));
  }

  private unsubscribeFromOrder(ws: ExtendedWebSocket, orderId: number) {
    ws.orderId = undefined;
    ws.send(JSON.stringify({ 
      type: 'unsubscribed', 
      data: { orderId } 
    }));
  }

  private async broadcastToOrder(orderId: number, message: any) {
    // Get all users associated with this order
    const order = await storage.getOrder(orderId);
    if (!order) return;

    const targetUsers = [order.customerId, order.supplierId].filter(Boolean);

    for (const userId of targetUsers) {
      const userClients = this.clients.get(userId) || [];
      for (const client of userClients) {
        if (client.readyState === WebSocket.OPEN && 
            (client.orderId === orderId || client.role === 'admin')) {
          client.send(JSON.stringify(message));
        }
      }
    }
  }

  private async calculateETA(locationData: any): Promise<number | null> {
    // Simple ETA calculation based on distance and speed
    // In production, you'd use Google Maps API or similar
    try {
      const order = await storage.getOrder(locationData.orderId);
      if (!order?.deliveryAddress || !locationData.speed) return null;

      // For now, return a mock ETA (in minutes)
      // Replace with actual distance calculation
      const estimatedMinutes = Math.round(5 + Math.random() * 15);
      return estimatedMinutes;
    } catch (error) {
      console.error('ETA calculation error:', error);
      return null;
    }
  }

  private removeClient(ws: ExtendedWebSocket) {
    if (ws.userId) {
      const userClients = this.clients.get(ws.userId) || [];
      const index = userClients.indexOf(ws);
      if (index !== -1) {
        userClients.splice(index, 1);
        if (userClients.length === 0) {
          this.clients.delete(ws.userId);
        }
      }
    }
  }

  // Public method to broadcast status updates
  async broadcastStatusUpdate(orderId: number, status: string, data?: any) {
    await this.broadcastToOrder(orderId, {
      type: 'status_update',
      data: { orderId, status, ...data }
    });
  }

  // Public method to send arrival notifications
  async sendArrivalNotification(orderId: number, estimatedArrival: number) {
    await this.broadcastToOrder(orderId, {
      type: 'arrival_notification',
      data: { orderId, estimatedArrival, message: `Your supplier will arrive in ${estimatedArrival} minutes` }
    });
  }
}

export const realtimeService = new RealtimeService();