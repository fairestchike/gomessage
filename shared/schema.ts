import { pgTable, text, serial, integer, boolean, timestamp, decimal, index, varchar, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Guest usage tracking table
export const guestSessions = pgTable("guest_sessions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(), // Browser-generated UUID
  usageCount: integer("usage_count").notNull().default(0),
  lastActivity: timestamp("last_activity").defaultNow(),
  deviceFingerprint: text("device_fingerprint"), // Basic device identification
  createdAt: timestamp("created_at").defaultNow(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("customer"), // customer, supplier, admin
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  address: text("address"),
  isActive: boolean("is_active").notNull().default(true),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const gasTypes = pgTable("gas_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // 3kg, 6kg, 12.5kg, etc.
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => users.id),
  guestSessionId: text("guest_session_id"), // For guest orders
  supplierId: integer("supplier_id").references(() => users.id),
  gasTypeId: integer("gas_type_id").references(() => gasTypes.id).notNull(),
  deliveryType: text("delivery_type").notNull(), // new, refill
  deliveryAddress: text("delivery_address").notNull(),
  specialNotes: text("special_notes"),
  status: text("status").notNull().default("pending"), // pending, accepted, in_transit, delivered, cancelled
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  deliveryFee: decimal("delivery_fee", { precision: 10, scale: 2 }).notNull().default("300"),
  paymentMethod: text("payment_method").notNull().default("cash"), // cash, card, wallet
  estimatedDeliveryTime: integer("estimated_delivery_time"), // in minutes
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const supplierProfiles = pgTable("supplier_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  licenseNumber: text("license_number"),
  vehicleInfo: text("vehicle_info"),
  businessName: text("business_name"),
  businessAddress: text("business_address"),
  kycStatus: text("kyc_status").notNull().default("pending"), // pending, verified, rejected
  kycDocuments: text("kyc_documents").array(),
  isVerified: boolean("is_verified").notNull().default(false),
  isAvailable: boolean("is_available").notNull().default(false),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  totalDeliveries: integer("total_deliveries").notNull().default(0),
  totalEarnings: decimal("total_earnings", { precision: 10, scale: 2 }).notNull().default("0.00"),
});

export const orderTracking = pgTable("order_tracking", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  status: text("status").notNull(),
  message: text("message"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  senderId: integer("sender_id").references(() => users.id).notNull(),
  receiverId: integer("receiver_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Cylinder tracking for refill process
export const cylinderTracking = pgTable("cylinder_tracking", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  cylinderId: text("cylinder_id").notNull(), // unique identifier for the cylinder
  currentStage: text("current_stage").notNull().default("awaiting_pickup"), 
  // stages: awaiting_pickup, pickup_confirmed, enroute_filling, at_filling_station, refilled, enroute_return, delivered
  customerConfirmed: boolean("customer_confirmed").notNull().default(false),
  supplierConfirmed: boolean("supplier_confirmed").notNull().default(false),
  pickupTime: timestamp("pickup_time"),
  fillingStationArrival: timestamp("filling_station_arrival"),
  refillCompletedTime: timestamp("refill_completed_time"),
  returnDeliveryTime: timestamp("return_delivery_time"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Stage confirmations for tracking
export const stageConfirmations = pgTable("stage_confirmations", {
  id: serial("id").primaryKey(),
  cylinderTrackingId: integer("cylinder_tracking_id").references(() => cylinderTracking.id).notNull(),
  stage: text("stage").notNull(),
  confirmedBy: integer("confirmed_by").references(() => users.id).notNull(),
  confirmedByRole: text("confirmed_by_role").notNull(), // customer, supplier
  confirmationTime: timestamp("confirmation_time").defaultNow(),
  notes: text("notes"),
});

// New tables for additional features
export const ratings = pgTable("ratings", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  customerId: integer("customer_id").references(() => users.id).notNull(),
  supplierId: integer("supplier_id").references(() => users.id).notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const supportTickets = pgTable("support_tickets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  orderId: integer("order_id").references(() => orders.id),
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("open"), // open, in_progress, resolved, closed
  priority: text("priority").notNull().default("medium"), // low, medium, high, urgent
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const promoCodes = pgTable("promo_codes", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  description: text("description"),
  discountType: text("discount_type").notNull(), // percentage, fixed_amount
  discountValue: decimal("discount_value", { precision: 10, scale: 2 }).notNull(),
  minOrderAmount: decimal("min_order_amount", { precision: 10, scale: 2 }),
  maxDiscount: decimal("max_discount", { precision: 10, scale: 2 }),
  usageLimit: integer("usage_limit"),
  usedCount: integer("used_count").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  validFrom: timestamp("valid_from").notNull(),
  validUntil: timestamp("valid_until").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const loyaltyPoints = pgTable("loyalty_points", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  points: integer("points").notNull().default(0),
  totalEarned: integer("total_earned").notNull().default(0),
  totalSpent: integer("total_spent").notNull().default(0),
  lastActivityAt: timestamp("last_activity_at").defaultNow(),
});

export const otpVerifications = pgTable("otp_verifications", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  otpCode: text("otp_code").notNull(),
  isUsed: boolean("is_used").notNull().default(false),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const suspiciousActivities = pgTable("suspicious_activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  activityType: text("activity_type").notNull(), // multiple_orders, location_mismatch, unusual_payment
  description: text("description").notNull(),
  severity: text("severity").notNull().default("medium"), // low, medium, high, critical
  isResolved: boolean("is_resolved").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// GPS Location tracking for real-time updates
export const locationUpdates = pgTable("location_updates", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  supplierId: integer("supplier_id").references(() => users.id).notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  accuracy: decimal("accuracy", { precision: 10, scale: 2 }), // GPS accuracy in meters
  speed: decimal("speed", { precision: 5, scale: 2 }), // Speed in km/h
  bearing: decimal("bearing", { precision: 5, scale: 2 }), // Direction in degrees
  altitude: decimal("altitude", { precision: 8, scale: 2 }), // Altitude in meters
  timestamp: timestamp("timestamp").defaultNow(),
});

// Delivery routes and ETAs
export const deliveryRoutes = pgTable("delivery_routes", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  supplierId: integer("supplier_id").references(() => users.id).notNull(),
  startLatitude: decimal("start_latitude", { precision: 10, scale: 8 }).notNull(),
  startLongitude: decimal("start_longitude", { precision: 11, scale: 8 }).notNull(),
  endLatitude: decimal("end_latitude", { precision: 10, scale: 8 }).notNull(),
  endLongitude: decimal("end_longitude", { precision: 11, scale: 8 }).notNull(),
  estimatedDistance: decimal("estimated_distance", { precision: 8, scale: 2 }), // in km
  estimatedDuration: integer("estimated_duration"), // in minutes
  currentETA: timestamp("current_eta"),
  actualStartTime: timestamp("actual_start_time"),
  actualEndTime: timestamp("actual_end_time"),
  routeStatus: text("route_status").notNull().default("planned"), // planned, started, completed, cancelled
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Real-time events for notifications
export const realtimeEvents = pgTable("realtime_events", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  eventType: text("event_type").notNull(), // location_update, eta_update, status_change, arrival_notification
  eventData: jsonb("event_data"), // JSON data for the event
  targetUserIds: integer("target_user_ids").array(), // Users who should receive this event
  isProcessed: boolean("is_processed").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  supplierProfile: many(supplierProfiles),
  sentMessages: many(messages, { relationName: "sender" }),
  receivedMessages: many(messages, { relationName: "receiver" }),
  ratings: many(ratings),
  supportTickets: many(supportTickets),
  loyaltyPoints: many(loyaltyPoints),
  suspiciousActivities: many(suspiciousActivities),
}));

export const gasTypesRelations = relations(gasTypes, ({ many }) => ({
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(users, { fields: [orders.customerId], references: [users.id] }),
  supplier: one(users, { fields: [orders.supplierId], references: [users.id] }),
  gasType: one(gasTypes, { fields: [orders.gasTypeId], references: [gasTypes.id] }),
  tracking: many(orderTracking),
  messages: many(messages),
  ratings: many(ratings),
  otpVerifications: many(otpVerifications),
  cylinderTracking: many(cylinderTracking),
}));

export const supplierProfilesRelations = relations(supplierProfiles, ({ one }) => ({
  user: one(users, { fields: [supplierProfiles.userId], references: [users.id] }),
}));

export const orderTrackingRelations = relations(orderTracking, ({ one }) => ({
  order: one(orders, { fields: [orderTracking.orderId], references: [orders.id] }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  order: one(orders, { fields: [messages.orderId], references: [orders.id] }),
  sender: one(users, { fields: [messages.senderId], references: [users.id], relationName: "sender" }),
  receiver: one(users, { fields: [messages.receiverId], references: [users.id], relationName: "receiver" }),
}));

export const ratingsRelations = relations(ratings, ({ one }) => ({
  order: one(orders, { fields: [ratings.orderId], references: [orders.id] }),
  customer: one(users, { fields: [ratings.customerId], references: [users.id] }),
  supplier: one(users, { fields: [ratings.supplierId], references: [users.id] }),
}));

export const supportTicketsRelations = relations(supportTickets, ({ one }) => ({
  user: one(users, { fields: [supportTickets.userId], references: [users.id] }),
  order: one(orders, { fields: [supportTickets.orderId], references: [orders.id] }),
}));

export const loyaltyPointsRelations = relations(loyaltyPoints, ({ one }) => ({
  user: one(users, { fields: [loyaltyPoints.userId], references: [users.id] }),
}));

export const otpVerificationsRelations = relations(otpVerifications, ({ one }) => ({
  order: one(orders, { fields: [otpVerifications.orderId], references: [orders.id] }),
}));

export const suspiciousActivitiesRelations = relations(suspiciousActivities, ({ one }) => ({
  user: one(users, { fields: [suspiciousActivities.userId], references: [users.id] }),
}));

export const cylinderTrackingRelations = relations(cylinderTracking, ({ one, many }) => ({
  order: one(orders, { fields: [cylinderTracking.orderId], references: [orders.id] }),
  confirmations: many(stageConfirmations),
}));

export const stageConfirmationsRelations = relations(stageConfirmations, ({ one }) => ({
  cylinderTracking: one(cylinderTracking, { fields: [stageConfirmations.cylinderTrackingId], references: [cylinderTracking.id] }),
  confirmedBy: one(users, { fields: [stageConfirmations.confirmedBy], references: [users.id] }),
}));

export const locationUpdatesRelations = relations(locationUpdates, ({ one }) => ({
  order: one(orders, { fields: [locationUpdates.orderId], references: [orders.id] }),
  supplier: one(users, { fields: [locationUpdates.supplierId], references: [users.id] }),
}));

export const deliveryRoutesRelations = relations(deliveryRoutes, ({ one }) => ({
  order: one(orders, { fields: [deliveryRoutes.orderId], references: [orders.id] }),
  supplier: one(users, { fields: [deliveryRoutes.supplierId], references: [users.id] }),
}));

export const realtimeEventsRelations = relations(realtimeEvents, ({ one }) => ({
  order: one(orders, { fields: [realtimeEvents.orderId], references: [orders.id] }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertGasTypeSchema = createInsertSchema(gasTypes).omit({
  id: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSupplierProfileSchema = createInsertSchema(supplierProfiles).omit({
  id: true,
});

export const insertOrderTrackingSchema = createInsertSchema(orderTracking).omit({
  id: true,
  timestamp: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  timestamp: true,
});

export const insertRatingSchema = createInsertSchema(ratings).omit({
  id: true,
  createdAt: true,
});

export const insertSupportTicketSchema = createInsertSchema(supportTickets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPromoCodeSchema = createInsertSchema(promoCodes).omit({
  id: true,
  createdAt: true,
});

export const insertLoyaltyPointsSchema = createInsertSchema(loyaltyPoints).omit({
  id: true,
  lastActivityAt: true,
});

export const insertOtpVerificationSchema = createInsertSchema(otpVerifications).omit({
  id: true,
  createdAt: true,
});

export const insertSuspiciousActivitySchema = createInsertSchema(suspiciousActivities).omit({
  id: true,
  createdAt: true,
});

export const insertCylinderTrackingSchema = createInsertSchema(cylinderTracking).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStageConfirmationSchema = createInsertSchema(stageConfirmations).omit({
  id: true,
  confirmationTime: true,
});

export const insertGuestSessionSchema = createInsertSchema(guestSessions).omit({
  id: true,
  createdAt: true,
});

export const insertLocationUpdateSchema = createInsertSchema(locationUpdates).omit({
  id: true,
  timestamp: true,
});

export const insertDeliveryRouteSchema = createInsertSchema(deliveryRoutes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRealtimeEventSchema = createInsertSchema(realtimeEvents).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type GasType = typeof gasTypes.$inferSelect;
export type InsertGasType = z.infer<typeof insertGasTypeSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type SupplierProfile = typeof supplierProfiles.$inferSelect;
export type InsertSupplierProfile = z.infer<typeof insertSupplierProfileSchema>;
export type OrderTracking = typeof orderTracking.$inferSelect;
export type InsertOrderTracking = z.infer<typeof insertOrderTrackingSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Rating = typeof ratings.$inferSelect;
export type InsertRating = z.infer<typeof insertRatingSchema>;
export type SupportTicket = typeof supportTickets.$inferSelect;
export type InsertSupportTicket = z.infer<typeof insertSupportTicketSchema>;
export type PromoCode = typeof promoCodes.$inferSelect;
export type InsertPromoCode = z.infer<typeof insertPromoCodeSchema>;
export type LoyaltyPoints = typeof loyaltyPoints.$inferSelect;
export type InsertLoyaltyPoints = z.infer<typeof insertLoyaltyPointsSchema>;
export type OtpVerification = typeof otpVerifications.$inferSelect;
export type InsertOtpVerification = z.infer<typeof insertOtpVerificationSchema>;
export type SuspiciousActivity = typeof suspiciousActivities.$inferSelect;
export type InsertSuspiciousActivity = z.infer<typeof insertSuspiciousActivitySchema>;
export type CylinderTracking = typeof cylinderTracking.$inferSelect;
export type InsertCylinderTracking = z.infer<typeof insertCylinderTrackingSchema>;
export type StageConfirmation = typeof stageConfirmations.$inferSelect;
export type InsertStageConfirmation = z.infer<typeof insertStageConfirmationSchema>;
export type GuestSession = typeof guestSessions.$inferSelect;
export type InsertGuestSession = z.infer<typeof insertGuestSessionSchema>;
export type LocationUpdate = typeof locationUpdates.$inferSelect;
export type InsertLocationUpdate = z.infer<typeof insertLocationUpdateSchema>;
export type DeliveryRoute = typeof deliveryRoutes.$inferSelect;
export type InsertDeliveryRoute = z.infer<typeof insertDeliveryRouteSchema>;
export type RealtimeEvent = typeof realtimeEvents.$inferSelect;
export type InsertRealtimeEvent = z.infer<typeof insertRealtimeEventSchema>;

// Login schema
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginData = z.infer<typeof loginSchema>;
