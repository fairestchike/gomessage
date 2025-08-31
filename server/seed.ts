import bcrypt from "bcryptjs";
import { db } from "./db";
import { users, gasTypes } from "@shared/schema";

async function seed() {
  try {
    console.log("Starting database seeding...");

    // Create default gas types
    const gasTypesData = [
      { name: "3kg", price: "5500.00", isActive: true },
      { name: "6kg", price: "8500.00", isActive: true },
      { name: "12.5kg", price: "15000.00", isActive: true },
      { name: "15kg", price: "18000.00", isActive: true },
      { name: "20kg", price: "22000.00", isActive: true },
      { name: "48kg", price: "45000.00", isActive: true },
    ];

    for (const gasType of gasTypesData) {
      await db.insert(gasTypes).values(gasType).onConflictDoNothing();
    }
    console.log("✓ Gas types seeded");

    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", 10);
    await db.insert(users).values({
      username: "admin",
      password: adminPassword,
      role: "admin",
      fullName: "System Administrator",
      phone: "+2341234567890",
      address: "Head Office, Lagos",
      isActive: true,
    }).onConflictDoNothing();
    console.log("✓ Admin user created (username: admin, password: admin123)");

    // Create sample customer
    const customerPassword = await bcrypt.hash("customer123", 10);
    await db.insert(users).values({
      username: "customer1",
      password: customerPassword,
      role: "customer",
      fullName: "John Doe",
      phone: "+2341234567891",
      address: "123 Victoria Island, Lagos",
      isActive: true,
    }).onConflictDoNothing();
    console.log("✓ Sample customer created (username: customer1, password: customer123)");

    // Create sample supplier
    const supplierPassword = await bcrypt.hash("supplier123", 10);
    await db.insert(users).values({
      username: "supplier1",
      password: supplierPassword,
      role: "supplier",
      fullName: "Emeka Gas Supplies",
      phone: "+2341234567892",
      address: "45 Ikeja, Lagos",
      isActive: true,
    }).onConflictDoNothing();
    console.log("✓ Sample supplier created (username: supplier1, password: supplier123)");

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

// Run if called directly
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.argv[1] === __filename) {
  seed().then(() => process.exit(0));
}

export { seed };