"use client"

import { useState, useEffect } from "react"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { MapPin, Heart, Calendar } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"


type Listing = {
  id: string;
  title: string;
  description: string;
  subtype: string;
  type: string;
  distance: string;
  price: string | number;
  location: string;
  date: string;
  image?: string;
  interests: number;
  quantity: string;
  unit: string;
  contactNumber?: string;
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

  const handleAddToCart = (item: any) => {
    const cartItem = {
      id: item.id,
      name: item.title,
      price:
        typeof item.price === "string"
          ? parseFloat(item.price.replace("₹", "").replace(",", ""))
          : item.price,
      image: item.image,
      description: item.description,
      subtype: item.subtype,
      location: item.location,
      distance: item.distance,
      date: item.date,
      interests: item.interests,
    };

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push(cartItem);
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
    toast({
      title: "Added to cart",
      description: `${item.title} has been added to your cart.`,
      duration: 2000,
    });
  };

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
                <Dialog key={listing.id}>
                  <DialogTrigger asChild>
                    <div>
                      <Card className="overflow-hidden">
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
                            onClick={(e) => { e.stopPropagation(); toggleSave(listing.id); }}
                          >
                            <Heart
                              className={`h-5 w-5 ${
                                savedListings.includes(listing.id)
                                  ? "fill-red-500 text-red-500"
                                  : "text-gray-500"
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
                          <p className="mb-2 line-clamp-2 text-sm text-gray-500">
                            {listing.description}
                          </p>
                          <div className="mt-4 space-y-2 text-sm">
                            <div className="flex items-center text-gray-500">
                              <MapPin className="mr-2 h-4 w-4" />
                              {listing.location} ({listing.distance})
                            </div>
                            <div className="flex items-center font-medium justify-between">
                              <span className="text-left">Contact Seller: {listing.contactNumber}</span>
                            </div>

                            <div className="flex items-center text-gray-500">
                              <Calendar className="mr-2 h-4 w-4" />
                              Listed {listing.date}
                            </div>
                            <div className="flex items-center font-medium justify-between">
                              <span className="text-left">Qty: {listing.quantity} {listing.unit}</span>
                              <span className="ml-auto text-right">₹{listing.price}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex items-center justify-between p-4 pt-0">
                          <div className="text-sm text-gray-500">
                            {listing.interests} 
                            <span className="ml-2  text-blue-600 hover:text-blue-800 cursor-pointer">View more</span>
                          </div>
                          <div className="flex justify-end mt-2">
                                <button
                                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                  onClick={(e) => { e.stopPropagation(); handleAddToCart(listing); }}
                                >
                                  Add to Cart
                                </button>
                          </div>
                        </CardFooter>
                      </Card>
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{listing.title}</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-2 mt-2">
                      <img src={listing.image || "/placeholder.svg"} alt={listing.title} className="w-full h-48 object-cover rounded" />
                      <div><strong>Description:</strong> {listing.description}</div>
                      <div><strong>Subtype:</strong> {listing.subtype}</div>
                      <div><strong>Quantity:</strong> {listing.quantity} {listing.unit}</div>
                      <div><strong>Location:</strong> {listing.location}</div>
                      <div><strong>Price:</strong> ₹{listing.price}</div>
                      {listing.contactNumber && (
                        <div><strong>Contact Number:</strong> {listing.contactNumber}</div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </main>
  <Footer />
</div>
  );
}
