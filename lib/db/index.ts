// This file exports all database-related functionality
// In a real application, this would be the main entry point for database operations

import { Models } from "./models"
import { seedDatabase } from "./seed"
import { Pool } from "pg";

// Create a new PostgreSQL client pool
export const db = new Pool({
  connectionString: process.env.SUPABASE_DB_URL || "postgresql://postgres:password@localhost:5432/agri_connect",
  ssl: { rejectUnauthorized: false }, // Required for secure connections
});

// Test the database connection
(async () => {
  try {
    await db.connect();
    console.log("Connected to the database successfully.");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  }
})();

export { Models, seedDatabase }

// Export types
export * from "./schema"

// Initialize the database
export async function initDatabase() {
  // In a real application, this would connect to the database
  console.log("Initializing database...")

  // For development purposes, seed the database
  if (process.env.NODE_ENV === "development") {
    await seedDatabase()
  }

  return Models
}
