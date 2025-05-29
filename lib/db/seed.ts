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
  for (let i = 1; i <= 5; i++) {
    const seller = await Models.User.create({
      name: `Seller ${i}`,
      email: `seller${i}@example.com`,
      password: "password123", // In a real app, this would be hashed
      role: "seller",
      phone: `+91 98765432${i}0`,
      address: `${i} Farmer Street`,
      city: ["Guntur", "Pune", "Kochi", "Ludhiana", "Jaipur"][i - 1],
      state: ["Andhra Pradesh", "Maharashtra", "Kerala", "Punjab", "Rajasthan"][i - 1],
      pincode: `5000${i}1`,
      bio: `Experienced farmer with ${i * 5} years in sustainable agriculture.`,
    })
    sellers.push(seller)
  }

  // Create buyer users
  const buyers: User[] = []
  for (let i = 1; i <= 5; i++) {
    const buyer = await Models.User.create({
      name: `Buyer ${i}`,
      email: `buyer${i}@example.com`,
      password: "password123", // In a real app, this would be hashed
      role: "buyer",
      phone: `+91 87654321${i}0`,
      address: `${i} Industry Road`,
      city: ["Bangalore", "Mumbai", "Chennai", "Delhi", "Hyderabad"][i - 1],
      state: ["Karnataka", "Maharashtra", "Tamil Nadu", "Delhi", "Telangana"][i - 1],
      pincode: `6000${i}1`,
      bio: `Industry professional looking for sustainable waste materials.`,
    })
    buyers.push(buyer)
  }

  // Create waste listings
  const wasteTypes = [
    {
      title: "Rice Husk - 2 Tons",
      description: "Clean rice husk available for collection. Ideal for fuel or animal bedding.",
      type: "Agricultural",
      subtype: "Rice Husk",
      quantity: 2,
      unit: "ton",
      price: 2000,
    },
    {
      title: "Sugarcane Bagasse - 5 Tons",
      description: "Fresh sugarcane bagasse available. Perfect for paper manufacturing or biofuel.",
      type: "Agricultural",
      subtype: "Bagasse",
      quantity: 5,
      unit: "ton",
      price: 4500,
    },
    {
      title: "Coconut Shells - 500kg",
      description: "Dried coconut shells available. Great for activated carbon or crafts.",
      type: "Agricultural",
      subtype: "Coconut Shells",
      quantity: 500,
      unit: "kg",
      price: 1500,
    },
    {
      title: "Wheat Straw - 3 Tons",
      description: "Baled wheat straw available. Suitable for animal feed, mushroom cultivation, or biofuel.",
      type: "Agricultural",
      subtype: "Straw",
      quantity: 3,
      unit: "ton",
      price: 3000,
    },
    {
      title: "Sawdust - 1 Ton",
      description: "Clean sawdust from furniture manufacturing. Ideal for composting or animal bedding.",
      type: "Industrial",
      subtype: "Sawdust",
      quantity: 1,
      unit: "ton",
      price: 1200,
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
      isNegotiable: i % 2 === 0,
      status: i === 2 ? "sold" : "active", // Make one listing sold
      images: [`/placeholder.svg?height=200&width=300&text=${wasteTypes[i].subtype}`],
      location: {
        address: seller.address || "",
        city: seller.city || "",
        state: seller.state || "",
        pincode: seller.pincode || "",
        coordinates: {
          latitude: 10 + i * 0.5,
          longitude: 76 + i * 0.5,
        },
      },
      specifications: {
        "Moisture Content": i % 2 === 0 ? "< 10%" : "10-15%",
        Age: i % 3 === 0 ? "Fresh (< 1 month)" : "1-3 months old",
        "Collection Method": i % 2 === 0 ? "Pickup only" : "Delivery available",
      },
    })
    listings.push(listing)
  }

  // Create interests
  for (let i = 0; i < 10; i++) {
    const listingIndex = i % listings.length
    const buyerIndex = i % buyers.length

    if (listings[listingIndex].status === "active") {
      await Models.Interest.create({
        listingId: listings[listingIndex].id,
        buyerId: buyers[buyerIndex].id,
        status: i % 3 === 0 ? "accepted" : "pending",
        message: `I'm interested in your ${listings[listingIndex].subtype} listing. Is it still available?`,
      })
    }
  }

  // Create messages
  for (let i = 0; i < 15; i++) {
    const sellerIndex = i % sellers.length
    const buyerIndex = i % buyers.length
    const listingIndex = i % listings.length

    await Models.Message.create({
      senderId: i % 2 === 0 ? sellers[sellerIndex].id : buyers[buyerIndex].id,
      receiverId: i % 2 === 0 ? buyers[buyerIndex].id : sellers[sellerIndex].id,
      listingId: listings[listingIndex].id,
      content: `Message ${i + 1}: Regarding the ${listings[listingIndex].subtype} listing. ${
        i % 2 === 0 ? "Is it still available?" : "Yes, it's available for pickup."
      }`,
    })
  }

  // Create reviews
  for (let i = 0; i < 8; i++) {
    const sellerIndex = i % sellers.length
    const buyerIndex = i % buyers.length

    await Models.Review.create({
      reviewerId: i % 2 === 0 ? buyers[buyerIndex].id : sellers[sellerIndex].id,
      revieweeId: i % 2 === 0 ? sellers[sellerIndex].id : buyers[buyerIndex].id,
      rating: 3 + (i % 3), // Ratings from 3-5
      comment: `${i % 2 === 0 ? "Great seller!" : "Reliable buyer!"} Transaction was smooth and professional.`,
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
  for (let i = 0; i < 10; i++) {
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
      message: `This is a ${types[i % types.length]} notification for testing purposes.`,
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

  for (let i = 0; i < 20; i++) {
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
