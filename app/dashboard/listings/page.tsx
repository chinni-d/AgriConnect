"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, MoreHorizontal, Plus, Search, Users } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"


import { useEffect } from "react"

export default function ListingsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [listings, setListings] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);

  const handleMarkAsSold = async (listingId: string) => {
    try {
      const response = await fetch(`/api/listings/${listingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'sold' }),
      });

      if (response.ok) {
        // Refresh the listings
        fetchListings();
      } else {
        console.error('Failed to mark listing as sold');
      }
    } catch (error) {
      console.error('Error marking listing as sold:', error);
    }
  };

  const handleMarkAsActive = async (listingId: string) => {
    try {
      const response = await fetch(`/api/listings/${listingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'active' }),
      });

      if (response.ok) {
        // Refresh the listings
        fetchListings();
      } else {
        console.error('Failed to mark listing as active');
      }
    } catch (error) {
      console.error('Error marking listing as active:', error);
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      try {
        const response = await fetch(`/api/listings/${listingId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Refresh the listings
          fetchListings();
        } else {
          console.error('Failed to delete listing');
        }
      } catch (error) {
        console.error('Error deleting listing:', error);
      }
    }
  };

  const fetchListings = () => {
    if (!user?.id) return;
    setLoading(true);
    fetch(`/api/listings?seller=${user.id}`)
      .then(res => res.json())
      .then(data => setListings(data.listings || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchListings();
  }, [user?.id]);

  // Filter listings based on search and active tab
  const filteredListings = listings.filter((listing: any) => {
    const matchesSearch =
      (listing.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.subtype?.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTab = activeTab === "all" || listing.status === activeTab;

    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Listings</h1>
          <p className="text-muted-foreground">Manage your waste listings and track interested buyers</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700" asChild>
          <Link href="/dashboard/listings/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Listing
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search listings..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="active" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="sold">Sold</TabsTrigger>
          <TabsTrigger value="all">All Listings</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-6">
          {filteredListings.length === 0 ? (
            <Card>
              <CardContent className="flex h-40 flex-col items-center justify-center p-6">
                <p className="text-center text-muted-foreground">No active listings found</p>
                <Button variant="link" className="mt-2 text-green-600" asChild>
                  <Link href="/dashboard/listings/new">Create your first listing</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredListings.map((listing: any) => (
                <Card key={listing.id}>
                  <div className="relative">
                    <img
                      src={listing.image || "https://www.cn-pellet.com/d/file/p/2019/11-17/ece68421685b9b8a4694bb0ab7178ed2.jpg"}
                      alt={listing.title}
                      className="h-48 w-full object-cover"
                    />
                    <Badge
                      className={`absolute left-2 top-2 ${
                        listing.status === "active"
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-gray-600 hover:bg-gray-700"
                      }`}
                    >
                      {listing.status === "active" ? "Active" : "Sold"}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-2 bg-white/80 hover:bg-white/90"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {listing.status === "active" ? (
                          <DropdownMenuItem onClick={() => handleMarkAsSold(listing.id)}>Mark as Sold</DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleMarkAsActive(listing.id)}>Mark as Active</DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleDeleteListing(listing.id)} className="text-red-600">Delete Listing</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardHeader className="p-4 pb-0">
                    <CardTitle className="text-lg">{listing.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <p className="mb-2 line-clamp-2 text-sm text-gray-500">{listing.description}</p>
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex items-center text-gray-500">
                        <MapPin className="mr-2 h-4 w-4" />
                        {listing.location}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Calendar className="mr-2 h-4 w-4" />
                        {listing.status === 'sold' && listing.updatedAt ? `Sold on ${new Date(listing.updatedAt).toLocaleDateString()}` : `Listed ${listing.date}`}
                      </div>
                      <div className="flex items-center font-medium">Price: {listing.price}</div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between p-4 pt-0">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="mr-1 h-4 w-4" />
                      {listing.interests} interested
                    </div>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700" asChild>
                      <Link href={`/dashboard/listings/${listing.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="sold" className="mt-6">
          {/* Similar structure for sold listings */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredListings
              .filter((listing: any) => listing.status === "sold")
              .map((listing: any) => (
                <Card key={listing.id}>
                  {/* Similar card structure as above */}
                  <div className="relative">
                    <img
                      src={listing.image || "https://www.cn-pellet.com/d/file/p/2019/11-17/ece68421685b9b8a4694bb0ab7178ed2.jpg"}
                      alt={listing.title}
                      className="h-48 w-full object-cover"
                    />
                    <Badge className="absolute left-2 top-2 bg-green-600 hover:bg-green-700 ">Sold</Badge>
                  </div>
                  <CardHeader className="p-4 pb-0">
                    <CardTitle className="text-lg">{listing.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <p className="mb-2 line-clamp-2 text-sm text-gray-500">{listing.description}</p>
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex items-center text-gray-500">
                        <MapPin className="mr-2 h-4 w-4" />
                        {listing.location}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Calendar className="mr-2 h-4 w-4" />
                        {listing.status === 'sold' && listing.updatedAt ? `Sold on ${new Date(listing.updatedAt).toLocaleDateString()}` : (listing.date ? `Listed ${listing.date}` : 'Date not available')}
                      </div>
                      <div className="flex items-center font-medium">Price: {listing.price}</div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between p-4 pt-0">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="mr-1 h-4 w-4" />
                      {listing.interests} were interested
                    </div>
                    <Button size="sm" variant="outline" className="bg-green-600 hover:bg-green-700 text-white" asChild>
                      <Link href={`/dashboard/listings/${listing.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="all" className="mt-6">
          {/* All listings */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredListings.map((listing: any) => (
              <Card key={listing.id}>
                {/* Similar card structure as above */}
                <div className="relative">
                  <img
                    src={listing.image || "https://www.cn-pellet.com/d/file/p/2019/11-17/ece68421685b9b8a4694bb0ab7178ed2.jpg"}
                    alt={listing.title}
                    className="h-48 w-full object-cover"
                  />
                  <Badge
                    className={`absolute left-2 top-2 ${
                      listing.status === "active" ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 hover:bg-gray-700"
                    }`}
                  >
                    {listing.status === "active" ? "Active" : "Sold"}
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
                      {listing.location}
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Calendar className="mr-2 h-4 w-4" />
                      {listing.status === 'sold' && listing.updatedAt ? `Sold on ${new Date(listing.updatedAt).toLocaleDateString()}` : (listing.date ? `Listed ${listing.date}` : 'Date not available')}
                    </div>
                    <div className="flex items-center font-medium">Price: {listing.price}</div>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between p-4 pt-0">
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="mr-1 h-4 w-4" />
                    {listing.interests} interested
                  </div>
                  <Button
                    size="sm"
                    className={
                      listing.status === "active" ? "bg-green-600 hover:bg-green-700" : "bg-green-600 hover:bg-green-700"
                    }
                    asChild
                  >
                    <Link href={`/dashboard/listings/${listing.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

