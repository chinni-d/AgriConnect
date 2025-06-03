// This file defines the database schema for the AgriConnect application
// In a real application, this would be used with a database ORM like Prisma

// User Model
export type User = {
  id: string
  name: string
  email: string
  password: string // In a real app, this would be hashed
  role: "seller" | "buyer" | "admin"
  phone?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  profileImage?: string
  bio?: string
  createdAt: Date
  updatedAt: Date
}

// Waste Listing Model
export type WasteListing = {
  id: string
  sellerId: string // References User.id
  title: string
  description: string
  wasteType: string // e.g., "Agricultural", "Industrial"
  subtype: string // e.g., "Rice Husk", "Bagasse"
  quantity: number
  unit: string // e.g., "kg", "ton"
  price: number
  status: "active" | "sold" | "archived"
  image?: string // Single image URL
  location: string // Simplified to single string for now
  specifications?: {
    [key: string]: string // Dynamic specifications like moisture content, age, etc.
  }
  contactNumber?: string
  createdAt: Date
  updatedAt: Date
}

// Interest Model (for tracking buyer interest in listings)
export type Interest = {
  id: string
  listingId: string // References WasteListing.id
  buyerId: string // References User.id
  status: "pending" | "accepted" | "rejected" | "completed"
  message?: string
  createdAt: Date
  updatedAt: Date
}

// Message Model (for communication between users)
export type Message = {
  id: string
  senderId: string // References User.id
  receiverId: string // References User.id
  listingId?: string // Optional reference to WasteListing.id
  content: string
  isRead: boolean
  createdAt: Date
}

// Review Model (for user ratings and reviews)
export type Review = {
  id: string
  reviewerId: string // References User.id (person giving the review)
  revieweeId: string // References User.id (person being reviewed)
  listingId?: string // Optional reference to WasteListing.id
  rating: number // 1-5 stars
  comment?: string
  createdAt: Date
}

// Transaction Model (for completed waste exchanges)
export type Transaction = {
  id: string
  listingId: string // References WasteListing.id
  sellerId: string // References User.id
  buyerId: string // References User.id
  interestId: string // References Interest.id
  amount: number
  status: "pending" | "completed" | "cancelled"
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

// Notification Model (for user notifications)
export type Notification = {
  id: string
  userId: string // References User.id
  type: "new_interest" | "interest_accepted" | "message" | "listing_update" | "system"
  title: string
  message: string
  relatedId?: string // Could reference a listing, message, etc.
  isRead: boolean
  createdAt: Date
}

// Analytics Model (for tracking platform metrics)
export type Analytics = {
  id: string
  metric: string // e.g., "waste_diverted", "users_registered", "transactions_completed"
  value: number
  period: "daily" | "weekly" | "monthly" | "yearly" | "all_time"
  date: Date
  createdAt: Date
}
