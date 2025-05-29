// This file would contain the database model implementations
// In a real application, this would use a database ORM like Prisma
// For demonstration purposes, we'll create mock implementations

import { v4 as uuidv4 } from "uuid"
import type { User, WasteListing, Interest, Message, Review, Transaction, Notification, Analytics } from "./schema"

// Mock database storage
const db = {
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
    db.users.set(id, user)
    return user
  },

  findById: async (id: string): Promise<User | null> => {
    return db.users.get(id) || null
  },

  findByEmail: async (email: string): Promise<User | null> => {
    for (const user of db.users.values()) {
      if (user.email === email) {
        return user
      }
    }
    return null
  },

  update: async (id: string, userData: Partial<User>): Promise<User | null> => {
    const user = db.users.get(id)
    if (!user) return null

    const updatedUser: User = {
      ...user,
      ...userData,
      updatedAt: new Date(),
    }
    db.users.set(id, updatedUser)
    return updatedUser
  },

  delete: async (id: string): Promise<boolean> => {
    return db.users.delete(id)
  },

  findAll: async (filters?: Partial<User>): Promise<User[]> => {
    const users = Array.from(db.users.values())
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
    listingData: Omit<WasteListing, "id" | "interestCount" | "createdAt" | "updatedAt">,
  ): Promise<WasteListing> => {
    const id = uuidv4()
    const now = new Date()
    const listing: WasteListing = {
      id,
      ...listingData,
      interestCount: 0,
      createdAt: now,
      updatedAt: now,
    }
    db.listings.set(id, listing)
    return listing
  },

  findById: async (id: string): Promise<WasteListing | null> => {
    return db.listings.get(id) || null
  },

  update: async (id: string, listingData: Partial<WasteListing>): Promise<WasteListing | null> => {
    const listing = db.listings.get(id)
    if (!listing) return null

    const updatedListing: WasteListing = {
      ...listing,
      ...listingData,
      updatedAt: new Date(),
    }
    db.listings.set(id, updatedListing)
    return updatedListing
  },

  delete: async (id: string): Promise<boolean> => {
    return db.listings.delete(id)
  },

  findAll: async (filters?: Partial<WasteListing>): Promise<WasteListing[]> => {
    const listings = Array.from(db.listings.values())
    if (!filters) return listings

    return listings.filter((listing) => {
      for (const [key, value] of Object.entries(filters)) {
        // Handle nested objects like location
        if (key === "location" && typeof value === "object") {
          for (const [locKey, locValue] of Object.entries(value)) {
            if (listing.location[locKey as keyof typeof listing.location] !== locValue) {
              return false
            }
          }
        } else if (listing[key as keyof WasteListing] !== value) {
          return false
        }
      }
      return true
    })
  },

  findBySeller: async (sellerId: string): Promise<WasteListing[]> => {
    return Array.from(db.listings.values()).filter((listing) => listing.sellerId === sellerId)
  },

  search: async (query: string): Promise<WasteListing[]> => {
    const lowercaseQuery = query.toLowerCase()
    return Array.from(db.listings.values()).filter(
      (listing) =>
        listing.title.toLowerCase().includes(lowercaseQuery) ||
        listing.description.toLowerCase().includes(lowercaseQuery) ||
        listing.subtype.toLowerCase().includes(lowercaseQuery),
    )
  },

  incrementInterestCount: async (id: string): Promise<WasteListing | null> => {
    const listing = db.listings.get(id)
    if (!listing) return null

    const updatedListing: WasteListing = {
      ...listing,
      interestCount: listing.interestCount + 1,
      updatedAt: new Date(),
    }
    db.listings.set(id, updatedListing)
    return updatedListing
  },

  markAsSold: async (id: string): Promise<WasteListing | null> => {
    const listing = db.listings.get(id)
    if (!listing) return null

    const updatedListing: WasteListing = {
      ...listing,
      status: "sold",
      updatedAt: new Date(),
    }
    db.listings.set(id, updatedListing)
    return updatedListing
  },
}

// Interest Model Implementation
export const InterestModel = {
  create: async (interestData: Omit<Interest, "id" | "createdAt">): Promise<Interest> => {
    const id = uuidv4()
    const now = new Date()
    const interest: Interest = {
      id,
      ...interestData,
      createdAt: now,
    }
    db.interests.set(id, interest)

    // Increment the interest count on the listing
    await WasteListingModel.incrementInterestCount(interestData.listingId)

    return interest
  },

  findById: async (id: string): Promise<Interest | null> => {
    return db.interests.get(id) || null
  },

  update: async (id: string, interestData: Partial<Interest>): Promise<Interest | null> => {
    const interest = db.interests.get(id)
    if (!interest) return null

    const updatedInterest: Interest = {
      ...interest,
      ...interestData,
    }
    db.interests.set(id, updatedInterest)
    return updatedInterest
  },

  delete: async (id: string): Promise<boolean> => {
    return db.interests.delete(id)
  },

  findByListing: async (listingId: string): Promise<Interest[]> => {
    return Array.from(db.interests.values()).filter((interest) => interest.listingId === listingId)
  },

  findByBuyer: async (buyerId: string): Promise<Interest[]> => {
    return Array.from(db.interests.values()).filter((interest) => interest.buyerId === buyerId)
  },

  findByListingAndBuyer: async (listingId: string, buyerId: string): Promise<Interest | null> => {
    for (const interest of db.interests.values()) {
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
    db.messages.set(id, message)
    return message
  },

  findById: async (id: string): Promise<Message | null> => {
    return db.messages.get(id) || null
  },

  markAsRead: async (id: string): Promise<Message | null> => {
    const message = db.messages.get(id)
    if (!message) return null

    const updatedMessage: Message = {
      ...message,
      isRead: true,
    }
    db.messages.set(id, updatedMessage)
    return updatedMessage
  },

  findConversation: async (user1Id: string, user2Id: string): Promise<Message[]> => {
    return Array.from(db.messages.values())
      .filter(
        (message) =>
          (message.senderId === user1Id && message.receiverId === user2Id) ||
          (message.senderId === user2Id && message.receiverId === user1Id),
      )
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
  },

  findByUser: async (userId: string): Promise<Message[]> => {
    return Array.from(db.messages.values()).filter(
      (message) => message.senderId === userId || message.receiverId === userId,
    )
  },

  findUnreadByUser: async (userId: string): Promise<Message[]> => {
    return Array.from(db.messages.values()).filter((message) => message.receiverId === userId && !message.isRead)
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
    db.transactions.set(id, transaction)
    return transaction
  },

  findById: async (id: string): Promise<Transaction | null> => {
    return db.transactions.get(id) || null
  },

  update: async (id: string, transactionData: Partial<Transaction>): Promise<Transaction | null> => {
    const transaction = db.transactions.get(id)
    if (!transaction) return null

    const updatedTransaction: Transaction = {
      ...transaction,
      ...transactionData,
      updatedAt: new Date(),
    }
    db.transactions.set(id, updatedTransaction)
    return updatedTransaction
  },

  findBySeller: async (sellerId: string): Promise<Transaction[]> => {
    return Array.from(db.transactions.values()).filter((transaction) => transaction.sellerId === sellerId)
  },

  findByBuyer: async (buyerId: string): Promise<Transaction[]> => {
    return Array.from(db.transactions.values()).filter((transaction) => transaction.buyerId === buyerId)
  },

  findByListing: async (listingId: string): Promise<Transaction | null> => {
    for (const transaction of db.transactions.values()) {
      if (transaction.listingId === listingId) {
        return transaction
      }
    }
    return null
  },

  completeTransaction: async (id: string): Promise<Transaction | null> => {
    const transaction = db.transactions.get(id)
    if (!transaction) return null

    const updatedTransaction: Transaction = {
      ...transaction,
      status: "completed",
      completedAt: new Date(),
      updatedAt: new Date(),
    }
    db.transactions.set(id, updatedTransaction)

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
    db.notifications.set(id, notification)
    return notification
  },

  findById: async (id: string): Promise<Notification | null> => {
    return db.notifications.get(id) || null
  },

  markAsRead: async (id: string): Promise<Notification | null> => {
    const notification = db.notifications.get(id)
    if (!notification) return null

    const updatedNotification: Notification = {
      ...notification,
      isRead: true,
    }
    db.notifications.set(id, updatedNotification)
    return updatedNotification
  },

  findByUser: async (userId: string): Promise<Notification[]> => {
    return Array.from(db.notifications.values())
      .filter((notification) => notification.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  },

  findUnreadByUser: async (userId: string): Promise<Notification[]> => {
    return Array.from(db.notifications.values()).filter(
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
    db.analytics.set(id, analytics)
    return analytics
  },

  findById: async (id: string): Promise<Analytics | null> => {
    return db.analytics.get(id) || null
  },

  findByMetric: async (metric: string, period: Analytics["period"]): Promise<Analytics[]> => {
    return Array.from(db.analytics.values()).filter(
      (analytics) => analytics.metric === metric && analytics.period === period,
    )
  },

  getLatestMetric: async (metric: string): Promise<Analytics | null> => {
    const metrics = Array.from(db.analytics.values())
      .filter((analytics) => analytics.metric === metric)
      .sort((a, b) => b.date.getTime() - a.date.getTime())

    return metrics.length > 0 ? metrics[0] : null
  },

  incrementMetric: async (metric: string, value = 1): Promise<Analytics> => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Find today's metric if it exists
    let todayMetric: Analytics | null = null
    for (const analytics of db.analytics.values()) {
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
      db.analytics.set(todayMetric.id, updatedMetric)
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
    db.reviews.set(id, review)
    return review
  },

  findById: async (id: string): Promise<Review | null> => {
    return db.reviews.get(id) || null
  },

  findByReviewee: async (revieweeId: string): Promise<Review[]> => {
    return Array.from(db.reviews.values()).filter((review) => review.revieweeId === revieweeId)
  },

  findByReviewer: async (reviewerId: string): Promise<Review[]> => {
    return Array.from(db.reviews.values()).filter((review) => review.reviewerId === reviewerId)
  },

  findByListing: async (listingId: string): Promise<Review[]> => {
    return Array.from(db.reviews.values()).filter((review) => review.listingId === listingId)
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
