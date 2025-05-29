import { NextResponse } from "next/server"
import { Models } from "@/lib/db"

// GET /api/interests - Get interests with optional filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // Get interests by listing
    const listingId = searchParams.get("listing")
    if (listingId) {
      const interests = await Models.Interest.findByListing(listingId)
      return NextResponse.json({ interests })
    }

    // Get interests by buyer
    const buyerId = searchParams.get("buyer")
    if (buyerId) {
      const interests = await Models.Interest.findByBuyer(buyerId)
      return NextResponse.json({ interests })
    }

    // Return error if no filter provided
    return NextResponse.json({ error: "Please provide a listing or buyer filter" }, { status: 400 })
  } catch (error) {
    console.error("Error fetching interests:", error)
    return NextResponse.json({ error: "Failed to fetch interests" }, { status: 500 })
  }
}

// POST /api/interests - Create a new interest
export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.listingId || !data.buyerId) {
      return NextResponse.json({ error: "Missing required fields: listingId and buyerId" }, { status: 400 })
    }

    // Check if listing exists
    const listing = await Models.WasteListing.findById(data.listingId)
    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    // Check if buyer exists
    const buyer = await Models.User.findById(data.buyerId)
    if (!buyer) {
      return NextResponse.json({ error: "Buyer not found" }, { status: 404 })
    }

    // Check if interest already exists
    const existingInterest = await Models.Interest.findByListingAndBuyer(data.listingId, data.buyerId)
    if (existingInterest) {
      return NextResponse.json({ error: "Interest already exists", interest: existingInterest }, { status: 409 })
    }

    // Create the interest
    const interest = await Models.Interest.create({
      listingId: data.listingId,
      buyerId: data.buyerId,
      status: "pending",
      message: data.message || "",
    })

    // Create notification for the seller
    await Models.Notification.create({
      userId: listing.sellerId,
      type: "new_interest",
      title: "New Interest in Your Listing",
      message: `Someone is interested in your listing: ${listing.title}`,
      relatedId: listing.id,
    })

    return NextResponse.json({ interest }, { status: 201 })
  } catch (error) {
    console.error("Error creating interest:", error)
    return NextResponse.json({ error: "Failed to create interest" }, { status: 500 })
  }
}
