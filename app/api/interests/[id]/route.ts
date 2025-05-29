import { NextResponse } from "next/server"
import { Models } from "@/lib/db"

// GET /api/interests/[id] - Get a specific interest
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const interest = await Models.Interest.findById(params.id)

    if (!interest) {
      return NextResponse.json({ error: "Interest not found" }, { status: 404 })
    }

    return NextResponse.json({ interest })
  } catch (error) {
    console.error("Error fetching interest:", error)
    return NextResponse.json({ error: "Failed to fetch interest" }, { status: 500 })
  }
}

// PATCH /api/interests/[id] - Update an interest (e.g., accept/reject)
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()

    // Find the interest
    const interest = await Models.Interest.findById(params.id)
    if (!interest) {
      return NextResponse.json({ error: "Interest not found" }, { status: 404 })
    }

    // Update the interest
    const updatedInterest = await Models.Interest.update(params.id, data)

    // If interest was accepted, create notification for the buyer
    if (data.status === "accepted" && interest.status !== "accepted") {
      const listing = await Models.WasteListing.findById(interest.listingId)
      if (listing) {
        await Models.Notification.create({
          userId: interest.buyerId,
          type: "interest_accepted",
          title: "Interest Accepted",
          message: `Your interest in "${listing.title}" has been accepted by the seller.`,
          relatedId: listing.id,
        })
      }
    }

    return NextResponse.json({ interest: updatedInterest })
  } catch (error) {
    console.error("Error updating interest:", error)
    return NextResponse.json({ error: "Failed to update interest" }, { status: 500 })
  }
}

// DELETE /api/interests/[id] - Delete an interest
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Find the interest
    const interest = await Models.Interest.findById(params.id)
    if (!interest) {
      return NextResponse.json({ error: "Interest not found" }, { status: 404 })
    }

    // Delete the interest
    const success = await Models.Interest.delete(params.id)

    if (success) {
      return NextResponse.json({ message: "Interest deleted successfully" })
    } else {
      return NextResponse.json({ error: "Failed to delete interest" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error deleting interest:", error)
    return NextResponse.json({ error: "Failed to delete interest" }, { status: 500 })
  }
}
