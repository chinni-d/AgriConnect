import { NextResponse } from "next/server"
import { Models } from "@/lib/db"

// GET /api/listings/[id] - Get a specific listing
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const listing = await Models.WasteListing.findById(params.id)

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    return NextResponse.json({ listing })
  } catch (error) {
    console.error("Error fetching listing:", error)
    return NextResponse.json({ error: "Failed to fetch listing" }, { status: 500 })
  }
}

// PATCH /api/listings/[id] - Update a listing
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()

    // Find the listing
    const listing = await Models.WasteListing.findById(params.id)
    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    // Update the listing
    const updatedListing = await Models.WasteListing.update(params.id, data)

    return NextResponse.json({ listing: updatedListing })
  } catch (error) {
    console.error("Error updating listing:", error)
    return NextResponse.json({ error: "Failed to update listing" }, { status: 500 })
  }
}

// DELETE /api/listings/[id] - Delete a listing
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Find the listing
    const listing = await Models.WasteListing.findById(params.id)
    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    // Delete the listing
    const success = await Models.WasteListing.delete(params.id)

    if (success) {
      return NextResponse.json({ message: "Listing deleted successfully" })
    } else {
      return NextResponse.json({ error: "Failed to delete listing" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error deleting listing:", error)
    return NextResponse.json({ error: "Failed to delete listing" }, { status: 500 })
  }
}
