// This file exports all database-related functionality
// In a real application, this would be the main entry point for database operations

import { Models } from "./models"
import { seedDatabase } from "./seed"

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
