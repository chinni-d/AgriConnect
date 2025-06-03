// This file would contain the database model implementations
// In a real application, this would use a database ORM like Prisma
// For demonstration purposes, we'll create mock implementations

import { v4 as uuidv4 } from "uuid"
import type { User, WasteListing, Interest, Message, Review, Transaction, Notification, Analytics } from "./schema"
import { db } from "./index"; // Use the PostgreSQL client instance
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client using environment variables from .env.local
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Rename the in-memory database object to avoid conflicts
const inMemoryDb = {
  users: new Map<string, User>(),
  listings: new Map<string, WasteListing>(),
  interests: new Map<string, Interest>(),
  messages: new Map<string, Message>(),
  reviews: new Map<string, Review>(),
  transactions: new Map<string, Transaction>(),
  notifications: new Map<string, Notification>(),
  analytics: new Map<string, Analytics>(),
}

// User Model Implementation
export const UserModel = {
  create: async (userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> => {
    const id = uuidv4()
    const now = new Date()
    const user: User = {
      id,
      ...userData,
      createdAt: now,
      updatedAt: now,
    }
    inMemoryDb.users.set(id, user)
    return user
  },

  findById: async (id: string): Promise<User | null> => {
    return inMemoryDb.users.get(id) || null
  },

  findByEmail: async (email: string): Promise<User | null> => {
    for (const user of inMemoryDb.users.values()) {
      if (user.email === email) {
        return user
      }
    }
    return null
  },

  update: async (id: string, userData: Partial<User>): Promise<User | null> => {
    const user = inMemoryDb.users.get(id)
    if (!user) return null

    const updatedUser: User = {
      ...user,
      ...userData,
      updatedAt: new Date(),
    }
    inMemoryDb.users.set(id, updatedUser)
    return updatedUser
  },

  delete: async (id: string): Promise<boolean> => {
    return inMemoryDb.users.delete(id)
  },

  findAll: async (filters?: Partial<User>): Promise<User[]> => {
    const users = Array.from(inMemoryDb.users.values())
    if (!filters) return users

    return users.filter((user) => {
      for (const [key, value] of Object.entries(filters)) {
        if (user[key as keyof User] !== value) {
          return false
        }
      }
      return true
    })
  },
}

// Waste Listing Model Implementation
export const WasteListingModel = {
  create: async (
    listingData: Omit<WasteListing, "id" | "createdAt" | "updatedAt">
  ): Promise<WasteListing> => {
    const now = new Date();
    
    console.log("Creating listing with data:", listingData);

    const { data, error } = await supabase
      .from("listings")
      .insert({
        ...listingData,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      })
      .select();

    if (error) {
      console.error("Database error:", error);
      throw new Error(`Failed to insert listing: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error("No data returned from database after insert");
    }

    console.log("Successfully created listing:", data[0]);
    return data[0] as WasteListing;
  },findById: async (id: string): Promise<WasteListing | null> => {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Error fetching listing by id ${id}:`, error);
      return null;
    }
    return data as WasteListing | null;
  },

  update: async (id: string, listingData: Partial<WasteListing>): Promise<WasteListing | null> => {
    const { data, error } = await supabase
      .from("listings")
      .update({ ...listingData, updatedAt: new Date().toISOString() })
      .eq("id", id)
      .select();

    if (error) {
      console.error(`Error updating listing ${id}:`, error);
      throw new Error(`Failed to update listing: ${error.message}`);
    }
    if (!data || data.length === 0) {
      console.warn(`Listing with id ${id} not found for update.`);
      return null;
    }
    return data[0] as WasteListing;
  },

  delete: async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from("listings")
      .delete()
      .eq("id", id);
    if (error) {
      console.error(`Error deleting listing ${id}:`, error);
      return false;
    }
    return true; // Assuming success if no error
  },  findAll: async (filters?: Partial<WasteListing>): Promise<WasteListing[]> => {
    const query = supabase.from("listings").select("*");

    if (filters) {
      for (const [key, value] of Object.entries(filters)) {
        query.eq(key, value);
      }
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch listings: ${error.message}`);
    }

    return data || [];
  },

  findBySeller: async (sellerId: string): Promise<WasteListing[]> => {
    return Array.from(inMemoryDb.listings.values()).filter((listing) => listing.sellerId === sellerId)
  },

  search: async (query: string): Promise<WasteListing[]> => {
    const lowercaseQuery = query.toLowerCase()
    return Array.from(inMemoryDb.listings.values()).filter(
      (listing) =>
        listing.title.toLowerCase().includes(lowercaseQuery) ||
        listing.description.toLowerCase().includes(lowercaseQuery) ||
        listing.subtype.toLowerCase().includes(lowercaseQuery),
    )
  },
  markAsSold: async (id: string): Promise<WasteListing | null> => {
    const listing = inMemoryDb.listings.get(id)
    if (!listing) return null

    const updatedListing: WasteListing = {
      ...listing,
      status: "sold",
      updatedAt: new Date(),
    }
    inMemoryDb.listings.set(id, updatedListing)
    return updatedListing
  },
}

// Interest Model Implementation
export const InterestModel = {
  create: async (interestData: Omit<Interest, "id" | "createdAt" | "updatedAt">): Promise<Interest> => {
    const id = uuidv4()
    const now = new Date()
    const interest: Interest = {
      id,
      ...interestData,
      createdAt: now,
      updatedAt: now,
    }
    inMemoryDb.interests.set(id, interest)
    
    return interest
  },

  findById: async (id: string): Promise<Interest | null> => {
    return inMemoryDb.interests.get(id) || null
  },

  update: async (id: string, interestData: Partial<Interest>): Promise<Interest | null> => {
    const interest = inMemoryDb.interests.get(id)
    if (!interest) return null

    const updatedInterest: Interest = {
      ...interest,
      ...interestData,
    }
    inMemoryDb.interests.set(id, updatedInterest)
    return updatedInterest
  },

  delete: async (id: string): Promise<boolean> => {
    return inMemoryDb.interests.delete(id)
  },

  findByListing: async (listingId: string): Promise<Interest[]> => {
    return Array.from(inMemoryDb.interests.values()).filter((interest) => interest.listingId === listingId)
  },

  findByBuyer: async (buyerId: string): Promise<Interest[]> => {
    return Array.from(inMemoryDb.interests.values()).filter((interest) => interest.buyerId === buyerId)
  },

  findByListingAndBuyer: async (listingId: string, buyerId: string): Promise<Interest | null> => {
    for (const interest of inMemoryDb.interests.values()) {
      if (interest.listingId === listingId && interest.buyerId === buyerId) {
        return interest
      }
    }
    return null
  },
}

// Message Model Implementation
export const MessageModel = {
  create: async (messageData: Omit<Message, "id" | "isRead" | "createdAt">): Promise<Message> => {
    const id = uuidv4()
    const now = new Date()
    const message: Message = {
      id,
      ...messageData,
      isRead: false,
      createdAt: now,
    }
    inMemoryDb.messages.set(id, message)
    return message
  },

  findById: async (id: string): Promise<Message | null> => {
    return inMemoryDb.messages.get(id) || null
  },

  markAsRead: async (id: string): Promise<Message | null> => {
    const message = inMemoryDb.messages.get(id)
    if (!message) return null

    const updatedMessage: Message = {
      ...message,
      isRead: true,
    }
    inMemoryDb.messages.set(id, updatedMessage)
    return updatedMessage
  },

  findConversation: async (user1Id: string, user2Id: string): Promise<Message[]> => {
    return Array.from(inMemoryDb.messages.values())
      .filter(
        (message) =>
          (message.senderId === user1Id && message.receiverId === user2Id) ||
          (message.senderId === user2Id && message.receiverId === user1Id),
      )
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
  },

  findByUser: async (userId: string): Promise<Message[]> => {
    return Array.from(inMemoryDb.messages.values()).filter(
      (message) => message.senderId === userId || message.receiverId === userId,
    )
  },

  findUnreadByUser: async (userId: string): Promise<Message[]> => {
    return Array.from(inMemoryDb.messages.values()).filter((message) => message.receiverId === userId && !message.isRead)
  },
}

// Transaction Model Implementation
export const TransactionModel = {
  create: async (transactionData: Omit<Transaction, "id" | "createdAt" | "updatedAt">): Promise<Transaction> => {
    const id = uuidv4()
    const now = new Date()
    const transaction: Transaction = {
      id,
      ...transactionData,
      createdAt: now,
      updatedAt: now,
    }
    inMemoryDb.transactions.set(id, transaction)
    return transaction
  },

  findById: async (id: string): Promise<Transaction | null> => {
    return inMemoryDb.transactions.get(id) || null
  },

  update: async (id: string, transactionData: Partial<Transaction>): Promise<Transaction | null> => {
    const transaction = inMemoryDb.transactions.get(id)
    if (!transaction) return null

    const updatedTransaction: Transaction = {
      ...transaction,
      ...transactionData,
      updatedAt: new Date(),
    }
    inMemoryDb.transactions.set(id, updatedTransaction)
    return updatedTransaction
  },

  findBySeller: async (sellerId: string): Promise<Transaction[]> => {
    return Array.from(inMemoryDb.transactions.values()).filter((transaction) => transaction.sellerId === sellerId)
  },

  findByBuyer: async (buyerId: string): Promise<Transaction[]> => {
    return Array.from(inMemoryDb.transactions.values()).filter((transaction) => transaction.buyerId === buyerId)
  },

  findByListing: async (listingId: string): Promise<Transaction | null> => {
    for (const transaction of inMemoryDb.transactions.values()) {
      if (transaction.listingId === listingId) {
        return transaction
      }
    }
    return null
  },

  completeTransaction: async (id: string): Promise<Transaction | null> => {
    const transaction = inMemoryDb.transactions.get(id)
    if (!transaction) return null

    const updatedTransaction: Transaction = {
      ...transaction,
      status: "completed",
      completedAt: new Date(),
      updatedAt: new Date(),
    }
    inMemoryDb.transactions.set(id, updatedTransaction)

    // Mark the listing as sold
    await WasteListingModel.markAsSold(transaction.listingId)

    return updatedTransaction
  },
}

// Notification Model Implementation
export const NotificationModel = {
  create: async (notificationData: Omit<Notification, "id" | "isRead" | "createdAt">): Promise<Notification> => {
    const id = uuidv4()
    const now = new Date()
    const notification: Notification = {
      id,
      ...notificationData,
      isRead: false,
      createdAt: now,
    }
    inMemoryDb.notifications.set(id, notification)
    return notification
  },

  findById: async (id: string): Promise<Notification | null> => {
    return inMemoryDb.notifications.get(id) || null
  },

  markAsRead: async (id: string): Promise<Notification | null> => {
    const notification = inMemoryDb.notifications.get(id)
    if (!notification) return null

    const updatedNotification: Notification = {
      ...notification,
      isRead: true,
    }
    inMemoryDb.notifications.set(id, updatedNotification)
    return updatedNotification
  },

  findByUser: async (userId: string): Promise<Notification[]> => {
    return Array.from(inMemoryDb.notifications.values())
      .filter((notification) => notification.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  },

  findUnreadByUser: async (userId: string): Promise<Notification[]> => {
    return Array.from(inMemoryDb.notifications.values()).filter(
      (notification) => notification.userId === userId && !notification.isRead,
    )
  },
}

// Analytics Model Implementation
export const AnalyticsModel = {
  create: async (analyticsData: Omit<Analytics, "id" | "createdAt">): Promise<Analytics> => {
    const id = uuidv4()
    const now = new Date()
    const analytics: Analytics = {
      id,
      ...analyticsData,
      createdAt: now,
    }
    inMemoryDb.analytics.set(id, analytics)
    return analytics
  },

  findById: async (id: string): Promise<Analytics | null> => {
    return inMemoryDb.analytics.get(id) || null
  },

  findByMetric: async (metric: string, period: Analytics["period"]): Promise<Analytics[]> => {
    return Array.from(inMemoryDb.analytics.values()).filter(
      (analytics) => analytics.metric === metric && analytics.period === period,
    )
  },

  getLatestMetric: async (metric: string): Promise<Analytics | null> => {
    const metrics = Array.from(inMemoryDb.analytics.values())
      .filter((analytics) => analytics.metric === metric)
      .sort((a, b) => b.date.getTime() - a.date.getTime())

    return metrics.length > 0 ? metrics[0] : null
  },

  incrementMetric: async (metric: string, value = 1): Promise<Analytics> => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Find today's metric if it exists
    let todayMetric: Analytics | null = null
    for (const analytics of inMemoryDb.analytics.values()) {
      if (analytics.metric === metric && analytics.date.getTime() === today.getTime()) {
        todayMetric = analytics
        break
      }
    }

    if (todayMetric) {
      // Update existing metric
      const updatedMetric: Analytics = {
        ...todayMetric,
        value: todayMetric.value + value,
      }
      inMemoryDb.analytics.set(todayMetric.id, updatedMetric)
      return updatedMetric
    } else {
      // Create new metric
      return await AnalyticsModel.create({
        metric,
        value,
        period: "daily",
        date: today,
      })
    }
  },
}

// Review Model Implementation
export const ReviewModel = {
  create: async (reviewData: Omit<Review, "id" | "createdAt">): Promise<Review> => {
    const id = uuidv4()
    const now = new Date()
    const review: Review = {
      id,
      ...reviewData,
      createdAt: now,
    }
    inMemoryDb.reviews.set(id, review)
    return review
  },

  findById: async (id: string): Promise<Review | null> => {
    return inMemoryDb.reviews.get(id) || null
  },

  findByReviewee: async (revieweeId: string): Promise<Review[]> => {
    return Array.from(inMemoryDb.reviews.values()).filter((review) => review.revieweeId === revieweeId)
  },

  findByReviewer: async (reviewerId: string): Promise<Review[]> => {
    return Array.from(inMemoryDb.reviews.values()).filter((review) => review.reviewerId === reviewerId)
  },

  findByListing: async (listingId: string): Promise<Review[]> => {
    return Array.from(inMemoryDb.reviews.values()).filter((review) => review.listingId === listingId)
  },

  getAverageRating: async (revieweeId: string): Promise<number> => {
    const reviews = await ReviewModel.findByReviewee(revieweeId)
    if (reviews.length === 0) return 0

    const sum = reviews.reduce((total, review) => total + review.rating, 0)
    return sum / reviews.length
  },
}

// Export all models
export const Models = {
  User: UserModel,
  WasteListing: WasteListingModel,
  Interest: InterestModel,
  Message: MessageModel,
  Transaction: TransactionModel,
  Notification: NotificationModel,
  Analytics: AnalyticsModel,
  Review: ReviewModel,
}
