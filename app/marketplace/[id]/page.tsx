"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/hooks/use-auth"
import { Calendar, Heart, MapPin, MessageSquare, Phone, Share2, User, ArrowLeft, Check } from "lucide-react"

// Mock data for a single waste listing
const mockListing = {
  id: "1",
  title: "Rice Husk - 2 Tons",
  description:
    "Clean rice husk available for collection. Ideal for fuel or animal bedding. This rice husk is from the recent harvest and has been properly dried and stored. It's free from contaminants and ready for immediate collection.",
  type: "Agricultural",
  subtype: "Rice Husk",
  quantity: "2 tons",
  location: "Guntur, Andhra Pradesh",
  coordinates: { lat: 16.3067, lng: 80.4365 },
  distance: "5 km",
  price: "₹2,000",
  date: "2 days ago",
  images: [
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
  ],
  interests: 3,
  seller: {
    id: "seller-1",
    name: "Ramesh Farms",
    rating: 4.8,
    listings: 12,
    joined: "Jan 2023",
    responseRate: "95%",
  },
  specifications: [
    { name: "Waste Type", value: "Agricultural" },
    { name: "Sub Type", value: "Rice Husk" },
    { name: "Quantity", value: "2 tons" },
    { name: "Moisture Content", value: "< 10%" },
    { name: "Age", value: "Fresh (< 1 month)" },
    { name: "Collection Method", value: "Pickup only" },
  ],

}

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const { id } = React.use(params) as { id: string }
  const router = useRouter()
  const { user, status } = useAuth()
  const [activeImage, setActiveImage] = useState(0)
  const [isInterested, setIsInterested] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [showContact, setShowContact] = useState(false)

  const handleInterest = () => {
    if (status !== "authenticated") {
      router.push("/login")
      return
    }
    setIsInterested(!isInterested)
    if (!isInterested) {
      setShowContact(true)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-8">
          <Button variant="ghost" className="mb-4 flex items-center gap-1" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            Back to Marketplace
          </Button>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Image gallery */}
            <div className="md:col-span-2">
              <div className="overflow-hidden rounded-lg">
                <img
                  src={mockListing.images[activeImage] || "/placeholder.svg"}
                  alt={mockListing.title}
                  className="h-[400px] w-full object-cover"
                />
              </div>
              <div className="mt-4 flex gap-2 overflow-auto pb-2">
                {mockListing.images.map((image, index) => (
                  <button
                    key={index}
                    className={`flex-shrink-0 overflow-hidden rounded-md border-2 ${
                      activeImage === index ? "border-green-600" : "border-transparent"
                    }`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${mockListing.title} - Image ${index + 1}`}
                      className="h-20 w-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Listing details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <Badge className="bg-green-600 hover:bg-green-700">{mockListing.subtype}</Badge>
                  <Button variant="ghost" size="icon" onClick={() => setIsSaved(!isSaved)}>
                    <Heart className={`h-5 w-5 ${isSaved ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
                    <span className="sr-only">Save listing</span>
                  </Button>
                </div>
                <h1 className="mt-2 text-3xl font-bold">{mockListing.title}</h1>
                <div className="mt-2 text-2xl font-bold text-green-600">{mockListing.price}</div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-500">
                  <MapPin className="mr-2 h-4 w-4" />
                  {mockListing.location} ({mockListing.distance})
                </div>
                <div className="flex items-center text-gray-500">
                  <Calendar className="mr-2 h-4 w-4" />
                  Listed {mockListing.date}
                </div>
                <div className="flex items-center text-gray-500">
                  <User className="mr-2 h-4 w-4" />
                  {mockListing.seller.name}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  className={`w-full ${
                    isInterested ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-green-600 hover:bg-green-700"
                  }`}
                  onClick={handleInterest}
                >
                  {isInterested ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Interested
                    </>
                  ) : (
                    "Express Interest"
                  )}
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/marketplace/${id}/message`}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message Seller
                  </Link>
                </Button>
                <Button variant="outline" className="w-full">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Listing
                </Button>
              </div>

              {showContact && (
                <Card>
                  <CardContent className="p-4">
                    <h3 className="mb-2 font-medium">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Phone className="mr-2 h-4 w-4 text-green-600" />
                        <span>+91 98765 43210</span>
                      </div>
                      <p className="text-xs text-gray-500">Please mention AgriConnect when contacting the seller</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardContent className="p-4">
                  <h3 className="mb-2 font-medium">Seller Information</h3>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                    <div>
                      <p className="font-medium">{mockListing.seller.name}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-1">⭐ {mockListing.seller.rating}</span>
                        <span>•</span>
                        <span className="ml-1">{mockListing.seller.listings} listings</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Member since {mockListing.seller.joined}</p>
                    <p>Response rate: {mockListing.seller.responseRate}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Tabs for description, specifications, and map */}
          <Tabs defaultValue="description" className="mt-8">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4 text-xl font-medium">About this waste</h3>
                  <p className="whitespace-pre-line text-gray-700">{mockListing.description}</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="specifications" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4 text-xl font-medium">Specifications</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {mockListing.specifications.map((spec, index) => (
                      <div key={index} className="flex justify-between border-b pb-2">
                        <span className="font-medium">{spec.name}</span>
                        <span className="text-gray-600">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="location" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4 text-xl font-medium">Location</h3>
                  <div className="h-[300px] rounded-lg bg-gray-100 flex items-center justify-center">
                    <p className="text-gray-500">Map showing location in {mockListing.location}</p>
                    {/* In a real implementation, this would be a Google Maps component */}
                  </div>
                  <p className="mt-4 text-sm text-gray-500">
                    Exact location will be shared after mutual interest is established
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Similar listings */}
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold">Similar Listings</h2>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <Card key={item} className="overflow-hidden">
                  <div className="relative">
                    <img
                      src="/placeholder.svg?height=200&width=300"
                      alt="Similar listing"
                      className="h-40 w-full object-cover"
                    />
                    <Badge className="absolute left-2 top-2 bg-green-600 hover:bg-green-700">
                      {item % 2 === 0 ? "Rice Husk" : "Wheat Straw"}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium">
                      {item % 2 === 0 ? "Rice Husk" : "Wheat Straw"} - {item} Ton
                    </h3>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm text-gray-500">{item * 10} km away</span>
                      <span className="font-medium text-green-600">₹{item * 1000}</span>
                    </div>
                    <Button size="sm" className="mt-3 w-full bg-green-600 hover:bg-green-700" asChild>
                      <Link href={`/marketplace/${item}`}>View</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
