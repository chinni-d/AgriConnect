import { NextResponse } from "next/server"
import { Models } from "@/lib/db"

// GET /api/listings - Get all listings with optional filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse filters from query parameters
    const filters: Record<string, any> = {}

    // Type filter
    const wasteType = searchParams.get("type")
    if (wasteType) {
      filters.wasteType = wasteType
    }

    // Status filter (active, sold, archived)
    const status = searchParams.get("status")
    if (status) {
      filters.status = status
    }

    // Seller filter
    const sellerId = searchParams.get("seller")
    if (sellerId) {
      filters.sellerId = sellerId
    }

    // Search query
    const query = searchParams.get("q")
    let listings = []

    if (query) {
      listings = await Models.WasteListing.search(query)
    } else {
      listings = await Models.WasteListing.findAll(Object.keys(filters).length > 0 ? filters : undefined)
    }

    return NextResponse.json({ listings })
  } catch (error) {
    console.error("Error fetching listings:", error)
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 })
  }
}

// POST /api/listings - Create a new listing
export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate required fields
    const requiredFields = [
      "sellerId",
      "title",
      "description",
      "wasteType",
      "subtype",
      "quantity",
      "unit",
      "price",
      "location",
    ]
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Create the new listing
    const listing = await Models.WasteListing.create({
      ...data,
      status: "active", // Default status for new listings
    })

    return NextResponse.json({ listing }, { status: 201 })
  } catch (error) {
    console.error("Error creating listing:", error)
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 })
  }
}
