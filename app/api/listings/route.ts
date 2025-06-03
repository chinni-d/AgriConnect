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
    }    // Transform listings to include proper formatting for UI
    const transformedListings = listings.map(listing => ({
      ...listing,
      interests: 0, // Remove interestCount since it's not in the database
      date: listing.createdAt ? new Date(listing.createdAt).toLocaleDateString() : ''
    }))

    return NextResponse.json({ listings: transformedListings })
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
        console.error(`Missing required field: ${field}`);
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }// Create the new listing with image URL if provided
    const listingData = {
      sellerId: data.sellerId,
      title: data.title,
      description: data.description,
      wasteType: data.wasteType,
      subtype: data.subtype,
      quantity: Number(data.quantity),
      unit: data.unit,
      price: Number(data.price),
      location: data.location,
      contactNumber: data.contactNumber,
      status: "active" as const, // Default status for new listings
      image: data.imageUrl || null, // Store single image URL
    }

    console.log("Processed listing data:", listingData);

    try {
      const listing = await Models.WasteListing.create(listingData)
      console.log("Created listing:", listing);

      return NextResponse.json({ listing }, { status: 201 })
    } catch (error) {
      console.error("Error creating listing:", error);
      
      // Log the specific error details for debugging
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      
      return NextResponse.json({ 
        error: "Failed to create listing", 
        details: error instanceof Error ? error.message : "Unknown error"
      }, { status: 500 })
    }
  } catch (error) {
    console.error("General error in POST handler:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
