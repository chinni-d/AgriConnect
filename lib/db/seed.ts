// This file would be used to seed the database with initial data
// In a real application, this would be run during development or initial deployment

import { Models } from "./models"
import type { User, WasteListing } from "./schema"

export async function seedDatabase() {
  console.log("Seeding database...")

  // Create admin user
  const admin = await Models.User.create({
    name: "Admin User",
    email: "admin@agriconnect.com",
    password: "admin123", // In a real app, this would be hashed
    role: "admin",
    phone: "+91 9876543210",
  })

  // Create seller users
  const sellers: User[] = []
  for (let i = 1; i <= 3; i++) {
    const seller = await Models.User.create({
      name: `Seller ${i}`,
      email: `seller${i}@example.com`,
      password: "password123", // In a real app, this would be hashed
      role: "seller",
      phone: `+91 98765432${i}0`,
      address: `${i} Farmer Street`,
      city: ["Guntur", "Pune", "Kochi"][i - 1],
      state: ["Andhra Pradesh", "Maharashtra", "Kerala"][i - 1],
      pincode: `5000${i}1`,
      bio: `Experienced farmer with ${i * 5} years in agriculture.`,
    })
    sellers.push(seller)
  }

  // Create buyer users
  const buyers: User[] = []
  for (let i = 1; i <= 3; i++) {
    const buyer = await Models.User.create({
      name: `Buyer ${i}`,
      email: `buyer${i}@example.com`,
      password: "password123", // In a real app, this would be hashed
      role: "buyer",
      phone: `+91 87654321${i}0`,
      address: `${i} Industry Road`,
      city: ["Bangalore", "Mumbai", "Chennai"][i - 1],
      state: ["Karnataka", "Maharashtra", "Tamil Nadu"][i - 1],
      pincode: `6000${i}1`,
      bio: `Industry professional looking for sustainable materials.`,
    })
    buyers.push(buyer)
  }

  // Create waste listings
  const wasteTypes = [
    {
      title: "Rice Husk - 2 Tons",
      description: "Clean rice husk available for collection.",
      type: "Agricultural",
      subtype: "Rice Husk",
      quantity: 2,
      unit: "ton",
      price: 2000,
    },
    {
      title: "Sugarcane Bagasse - 5 Tons",
      description: "Fresh sugarcane bagasse available.",
      type: "Agricultural",
      subtype: "Bagasse",
      quantity: 5,
      unit: "ton",
      price: 4500,
    },
    {
      title: "Coconut Shells - 500kg",
      description: "Dried coconut shells available.",
      type: "Agricultural",
      subtype: "Coconut Shells",
      quantity: 500,
      unit: "kg",
      price: 1500,
    },
  ]

  const listings: WasteListing[] = []
  for (let i = 0; i < wasteTypes.length; i++) {
    const seller = sellers[i % sellers.length]
    const listing = await Models.WasteListing.create({
      sellerId: seller.id,
      title: wasteTypes[i].title,
      description: wasteTypes[i].description,
      wasteType: wasteTypes[i].type,
      subtype: wasteTypes[i].subtype,
      quantity: wasteTypes[i].quantity,
      unit: wasteTypes[i].unit,
      price: wasteTypes[i].price,
      status: i === 2 ? "sold" : "active", // Make one listing sold
      image: `/placeholder.svg?height=200&width=300&text=${wasteTypes[i].subtype}`, // Changed from images array to single image string
      location: `${seller.city || ""}, ${seller.state || ""}`.trim(), // Simplified location string
    })
    listings.push(listing)
  }

  // Create interests
  for (let i = 0; i < 5; i++) {
    const listingIndex = i % listings.length
    const buyerIndex = i % buyers.length

    if (listings[listingIndex].status === "active") {
      await Models.Interest.create({
        listingId: listings[listingIndex].id,
        buyerId: buyers[buyerIndex].id,
        status: i % 3 === 0 ? "accepted" : "pending",
        message: `I'm interested in your ${listings[listingIndex].subtype} listing.`,
      })
    }
  }

  // Create messages
  for (let i = 0; i < 5; i++) {
    const sellerIndex = i % sellers.length
    const buyerIndex = i % buyers.length
    const listingIndex = i % listings.length

    await Models.Message.create({
      senderId: i % 2 === 0 ? sellers[sellerIndex].id : buyers[buyerIndex].id,
      receiverId: i % 2 === 0 ? buyers[buyerIndex].id : sellers[sellerIndex].id,
      listingId: listings[listingIndex].id,
      content: `Message ${i + 1}: Regarding the ${listings[listingIndex].subtype} listing.`,
    })
  }

  // Create reviews
  for (let i = 0; i < 4; i++) {
    const sellerIndex = i % sellers.length
    const buyerIndex = i % buyers.length

    await Models.Review.create({
      reviewerId: i % 2 === 0 ? buyers[buyerIndex].id : sellers[sellerIndex].id,
      revieweeId: i % 2 === 0 ? sellers[sellerIndex].id : buyers[buyerIndex].id,
      rating: 3 + (i % 3), // Ratings from 3-5
      comment: `${i % 2 === 0 ? "Great seller!" : "Reliable buyer!"} Professional transaction.`,
    })
  }

  // Create transactions for sold listings
  const soldListing = listings.find((listing) => listing.status === "sold")
  if (soldListing) {
    const interest = (await Models.Interest.findByListing(soldListing.id))[0]
    if (interest) {
      await Models.Transaction.create({
        listingId: soldListing.id,
        sellerId: soldListing.sellerId,
        buyerId: interest.buyerId,
        interestId: interest.id,
        amount: soldListing.price,
        status: "completed",
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      })
    }
  }

  // Create notifications
  for (let i = 0; i < 5; i++) {
    const userIndex = i % (sellers.length + buyers.length)
    const userId = userIndex < sellers.length ? sellers[userIndex].id : buyers[userIndex - sellers.length].id

    const types: Array<"new_interest" | "interest_accepted" | "message" | "listing_update" | "system"> = [
      "new_interest",
      "interest_accepted",
      "message",
      "listing_update",
      "system",
    ]

    await Models.Notification.create({
      userId,
      type: types[i % types.length],
      title: `Notification ${i + 1}`,
      message: `This is a ${types[i % types.length]} notification.`,
      relatedId: i % 2 === 0 ? listings[i % listings.length].id : undefined,
    })
  }

  // Create analytics data
  const metrics = ["waste_diverted", "users_registered", "transactions_completed", "active_listings"]
  const periods: Array<"daily" | "weekly" | "monthly" | "yearly" | "all_time"> = [
    "daily",
    "weekly",
    "monthly",
    "yearly",
    "all_time",
  ]

  for (let i = 0; i < 10; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    await Models.Analytics.create({
      metric: metrics[i % metrics.length],
      value: 10 + i * 5,
      period: periods[i % periods.length],
      date,
    })
  }

  console.log("Database seeded successfully!")
  return {
    admin,
    sellers,
    buyers,
    listings,
  }
}
