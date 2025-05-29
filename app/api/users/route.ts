import { NextResponse } from "next/server"
import { Models } from "@/lib/db"
import { supabase } from "@/lib/supabaseClient"

// GET /api/users - Get users with optional filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse filters from query parameters
    const filters: Record<string, any> = {}

    // Role filter
    const role = searchParams.get("role")
    if (role) {
      filters.role = role
    }

    // Get users with filters
    const users = await Models.User.findAll(Object.keys(filters).length > 0 ? filters : undefined)

    // Remove passwords from response
    const sanitizedUsers = users.map((user) => {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    })

    return NextResponse.json({ users: sanitizedUsers })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

// POST /api/users - Create a new user (register)
export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate required fields
    const requiredFields = ["name", "email", "password", "role"]
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Check if email already exists in Supabase
    const { data: existingUsers, error: findError } = await supabase
      .from('users')
      .select('id')
      .eq('email', data.email)
      .maybeSingle()

    if (findError) {
      console.error('Supabase find error:', findError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
    if (existingUsers) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
    }

    // Validate role
    if (!["seller", "buyer"].includes(data.role)) {
      return NextResponse.json({ error: "Invalid role. Must be 'seller' or 'buyer'" }, { status: 400 })
    }

    // Insert user into Supabase
    // In a real app, you would hash the password before storing
    const { data: insertedUsers, error: insertError } = await supabase
      .from('users')
      .insert([
        {
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ])
      .select()
      .maybeSingle()

    if (insertError) {
      console.error('Supabase insert error:', insertError)
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = insertedUsers

    return NextResponse.json({ user: userWithoutPassword }, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
