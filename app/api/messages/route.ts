import { NextResponse } from "next/server"
import { Models } from "@/lib/db"

// GET /api/messages - Get messages for a conversation
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // Get conversation between two users
    const user1Id = searchParams.get("user1")
    const user2Id = searchParams.get("user2")

    if (user1Id && user2Id) {
      const messages = await Models.Message.findConversation(user1Id, user2Id)
      return NextResponse.json({ messages })
    }

    // Get messages for a user
    const userId = searchParams.get("user")
    if (userId) {
      const messages = await Models.Message.findByUser(userId)
      return NextResponse.json({ messages })
    }

    // Return error if no filter provided
    return NextResponse.json({ error: "Please provide user IDs for conversation" }, { status: 400 })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

// POST /api/messages - Send a new message
export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.senderId || !data.receiverId || !data.content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create the message
    const message = await Models.Message.create({
      senderId: data.senderId,
      receiverId: data.receiverId,
      listingId: data.listingId, // Optional
      content: data.content,
    })

    // Create notification for the receiver
    await Models.Notification.create({
      userId: data.receiverId,
      type: "message",
      title: "New Message",
      message: "You have received a new message",
      relatedId: message.id,
    })

    return NextResponse.json({ message }, { status: 201 })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
