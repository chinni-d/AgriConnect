import { NextRequest, NextResponse } from "next/server"
import { seedDatabase } from "@/lib/db/seed"

export async function POST(request: NextRequest) {
  try {
    console.log("Starting database seeding...")
    const result = await seedDatabase()
    console.log("Database seeding completed successfully")
    
    return NextResponse.json({ 
      success: true, 
      message: "Database seeded successfully",
      data: {
        adminCreated: !!result.admin,
        sellersCount: result.sellers.length,
        buyersCount: result.buyers.length,
        listingsCount: result.listings.length
      }
    })
  } catch (error: any) {
    console.error("Seeding failed:", error)
    return NextResponse.json(
      { 
        success: false, 
        message: "Database seeding failed", 
        error: error.message,
        stack: error.stack 
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: "Use POST method to seed the database",
    endpoint: "/api/seed"
  })
}
