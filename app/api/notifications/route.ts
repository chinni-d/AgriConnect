import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// POST /api/notifications - Notify a seller of a booking request
export async function POST(request: Request) {
  try {
    const { sellerId, message } = await request.json();

    if (!sellerId || !message) {
      return NextResponse.json({ error: "Missing required fields: sellerId and message" }, { status: 400 });
    }

    // Insert notification into the database
    const { error } = await supabase.from("notifications").insert({
      sellerId,
      message,
      createdAt: new Date().toISOString(),
    });

    if (error) {
      console.error("Error inserting notification:", error);
      return NextResponse.json({ error: "Failed to create notification" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
