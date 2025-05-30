"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Heart, Calendar } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

// Mock data for waste listings
const mockListings = [
  {
    id: "1",
    title: "Rice Husk - 2 Tons",
    description: "Clean rice husk available for collection. Ideal for fuel or animal bedding.",
    type: "Agricultural",
    subtype: "Rice Husk",
    quantity: "2 tons",
    location: "Guntur, Andhra Pradesh",
    distance: "5 km",
    price: "₹2,000",
    date: "2 days ago",
    image: "/placeholder.svg?height=200&width=300",
    interests: 3,
  },
  {
    id: "2",
    title: "Sugarcane Bagasse - 5 Tons",
    description: "Fresh sugarcane bagasse available. Perfect for paper manufacturing or biofuel.",
    type: "Agricultural",
    subtype: "Bagasse",
    quantity: "5 tons",
    location: "Pune, Maharashtra",
    distance: "12 km",
    price: "₹4,500",
    date: "1 week ago",
    image: "/placeholder.svg?height=200&width=300",
    interests: 7,
  },
  {
    id: "3",
    title: "Coconut Shells - 500kg",
    description: "Dried coconut shells available. Great for activated carbon or crafts.",
    type: "Agricultural",
    subtype: "Coconut Shells",
    quantity: "500 kg",
    location: "Kochi, Kerala",
    distance: "8 km",
    price: "₹1,500",
    date: "3 days ago",
    image: "/placeholder.svg?height=200&width=300",
    interests: 2,
  },
  {
    id: "4",
    title: "Wheat Straw - 3 Tons",
    description: "Baled wheat straw available. Suitable for animal feed, mushroom cultivation, or biofuel.",
    type: "Agricultural",
    subtype: "Straw",
    quantity: "3 tons",
    location: "Ludhiana, Punjab",
    distance: "15 km",
    price: "₹3,000",
    date: "5 days ago",
    image: "/placeholder.svg?height=200&width=300",
    interests: 5,
  },
  {
    id: "5",
    title: "Sawdust - 1 Ton",
    description: "Clean sawdust from furniture manufacturing. Ideal for composting or animal bedding.",
    type: "Industrial",
    subtype: "Sawdust",
    quantity: "1 ton",
    location: "Jaipur, Rajasthan",
    distance: "20 km",
    price: "₹1,200",
    date: "1 day ago",
    image: "/placeholder.svg?height=200&width=300",
    interests: 1,
  },
  {
    id: "6",
    title: "Cotton Stalks - 4 Tons",
    description: "Dried cotton stalks available. Can be used for fuel or paper manufacturing.",
    type: "Agricultural",
    subtype: "Cotton Stalks",
    quantity: "4 tons",
    location: "Ahmedabad, Gujarat",
    distance: "25 km",
    price: "₹3,500",
    date: "2 weeks ago",
    image: "/placeholder.svg?height=200&width=300",
    interests: 4,
  },
]

type Listing = {
  id: string;
  title: string;
  description: string;
  subtype: string;
  type: string;
  distance: string;
  price: string;
  location: string;
  date: string;
  image?: string;
  interests: number;
};

export default function MarketplacePage() {
  const { user, status } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [wasteType, setWasteType] = useState("all")
  const [maxDistance, setMaxDistance] = useState([50])
  const [sortBy, setSortBy] = useState("newest")
  const [savedListings, setSavedListings] = useState<string[]>([])
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true);
    fetch(`/api/listings?status=active`)
      .then(res => res.json())
      .then(data => setListings(data.listings || []))
      .finally(() => setLoading(false));
  }, []);

  // Filter listings based on search and filters
  const filteredListings = listings.filter((listing: any) => {
    const matchesSearch =
      listing?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing?.subtype?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = wasteType === "all" || listing?.type === wasteType;
    const matchesDistance = Number.parseInt(listing?.distance || "0") <= maxDistance[0];

    return matchesSearch && matchesType && matchesDistance;
  });

  // Sort listings
  const sortedListings = [...filteredListings].sort((a: any, b: any) => {
    if (sortBy === "newest") {
      return a?.date?.includes("day") && b?.date?.includes("week") ? -1 : 1;
    } else if (sortBy === "oldest") {
      return a?.date?.includes("week") && b?.date?.includes("day") ? -1 : 1;
    } else if (sortBy === "price_low") {
      return (
        Number.parseInt(a?.price?.replace("₹", "").replace(",", "")) -
        Number.parseInt(b?.price?.replace("₹", "").replace(",", ""))
      );
    } else if (sortBy === "price_high") {
      return (
        Number.parseInt(b?.price?.replace("₹", "").replace(",", "")) -
        Number.parseInt(a?.price?.replace("₹", "").replace(",", ""))
      );
    } else if (sortBy === "distance") {
      return Number.parseInt(a?.distance || "0") - Number.parseInt(b?.distance || "0");
    }
    return 0;
  });

  const toggleSave = (id: string) => {
    setSavedListings((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Waste Marketplace</h1>
            <p className="text-muted-foreground">Browse available waste listings from farmers and industries</p>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {/* Filters sidebar */}
            <div className="space-y-6">
              <div className="space-y-4 rounded-lg border p-4">
                <h3 className="font-medium">Search</h3>
                <div className="space-y-2">
                  <Input
                    placeholder="Search listings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4 rounded-lg border p-4">
                <h3 className="font-medium">Filters</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="waste-type">Waste Type</Label>
                    <Select value={wasteType} onValueChange={setWasteType}>
                      <SelectTrigger id="waste-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Agricultural">Agricultural</SelectItem>
                        <SelectItem value="Industrial">Industrial</SelectItem>
                        <SelectItem value="Food">Food</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Maximum Distance: {maxDistance[0]} km</Label>
                    <Slider defaultValue={[50]} max={100} step={5} value={maxDistance} onValueChange={setMaxDistance} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sort-by">Sort By</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger id="sort-by">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="price_low">Price: Low to High</SelectItem>
                        <SelectItem value="price_high">Price: High to Low</SelectItem>
                        <SelectItem value="distance">Distance: Nearest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Listings grid */}
            <div className="md:col-span-3">
              {loading ? (
                <div className="flex h-40 items-center justify-center rounded-lg border">
                  <p className="text-muted-foreground">Loading listings...</p>
                </div>
              ) : sortedListings.length === 0 ? (
                <div className="flex h-40 items-center justify-center rounded-lg border">
                  <p className="text-muted-foreground">No listings found matching your criteria</p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {sortedListings.map((listing) => (
                    <Card key={listing.id} className="overflow-hidden">
                      <div className="relative">
                        <img
                          src={listing.image || "/placeholder.svg"}
                          alt={listing.title}
                          className="h-48 w-full object-cover"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-2 bg-white/80 hover:bg-white/90"
                          onClick={() => toggleSave(listing.id)}
                        >
                          <Heart
                            className={`h-5 w-5 ${
                              savedListings.includes(listing.id) ? "fill-red-500 text-red-500" : "text-gray-500"
                            }`}
                          />
                          <span className="sr-only">Save listing</span>
                        </Button>
                        <Badge className="absolute left-2 top-2 bg-green-600 hover:bg-green-700">
                          {listing.subtype}
                        </Badge>
                      </div>
                      <CardHeader className="p-4 pb-0">
                        <CardTitle className="text-lg">{listing.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <p className="mb-2 line-clamp-2 text-sm text-gray-500">{listing.description}</p>
                        <div className="mt-4 space-y-2 text-sm">
                          <div className="flex items-center text-gray-500">
                            <MapPin className="mr-2 h-4 w-4" />
                            {listing.location} ({listing.distance})
                          </div>
                          <div className="flex items-center text-gray-500">
                            <Calendar className="mr-2 h-4 w-4" />
                            Listed {listing.date}
                          </div>
                          <div className="flex items-center font-medium">Price: {listing.price}</div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex items-center justify-between p-4 pt-0">
                        <div className="text-sm text-gray-500">{listing.interests} interested</div>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700" asChild>
                          <Link href={`/marketplace/${listing.id}`}>View Details</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
