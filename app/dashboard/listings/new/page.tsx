"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload } from "lucide-react"
import { useAuth } from "@/hooks/use-auth";

export default function NewListingPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const location = `${formData.get("address")}, ${formData.get("city")}, ${formData.get("state")}, ${formData.get("pincode")}`;

    const listingData = {
      title: formData.get("title"),
      description: formData.get("description"),
      wasteType: formData.get("waste-type"),
      subtype: formData.get("subtype"),
      quantity: formData.get("quantity"),
      unit: formData.get("unit"),
      price: formData.get("price"),
      location,
      sellerId: user?.id, // Assuming user ID is available from auth context
    };

    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listingData),
      });

      const responseData = await res.json();
      console.log("API Response:", responseData);

      if (!res.ok) {
        throw new Error("Failed to create listing");
      }

      // Redirect to listings page after successful creation
      router.push("/dashboard/listings");
    } catch (error) {
      console.error("Error creating listing:", error);
      alert("Failed to create listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Create New Listing</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Provide the basic details about your waste listing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., Rice Husk - 2 Tons"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your waste in detail, including its condition, age, and potential uses"
                    rows={5}
                    required
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="waste-type">Waste Type</Label>
                    <Select name="waste-type" required>
                      <SelectTrigger id="waste-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="agricultural">Agricultural</SelectItem>
                        <SelectItem value="industrial">Industrial</SelectItem>
                        <SelectItem value="food">Food</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subtype">Sub Type</Label>
                    <Input
                      id="subtype"
                      name="subtype"
                      placeholder="e.g., Rice Husk, Bagasse"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quantity & Pricing</CardTitle>
                <CardDescription>
                  Specify the quantity and pricing details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      placeholder="e.g., 2"
                      type="number"
                      min="0"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Select name="unit" required>
                      <SelectTrigger id="unit">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">Kilograms (kg)</SelectItem>
                        <SelectItem value="ton">Tons</SelectItem>
                        <SelectItem value="quintal">Quintals</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    name="price"
                    placeholder="e.g., 2000"
                    type="number"
                    min="0"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Enter the total price for the entire quantity
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="negotiable">Price Negotiability</Label>
                  <Select>
                    <SelectTrigger id="negotiable">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Price</SelectItem>
                      <SelectItem value="negotiable">Negotiable</SelectItem>
                      <SelectItem value="best-offer">Best Offer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
                <CardDescription>
                  Provide the location details for your waste
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    placeholder="Enter your address"
                    rows={3}
                    required
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="e.g., Guntur"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      placeholder="e.g., Andhra Pradesh"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">PIN Code</Label>
                  <Input
                    id="pincode"
                    name="pincode"
                    placeholder="e.g., 522001"
                    required
                  />
                </div>
                <div className="pt-2">
                  <p className="text-xs text-gray-500">
                    Note: Exact location will only be shared with interested buyers after mutual interest is established
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
                <CardDescription>
                  Upload images of your waste (max 5 images)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-300 hover:border-gray-400">
                    <Upload className="mb-2 h-6 w-6 text-gray-400" />
                    <p className="text-xs text-gray-500">Click to upload</p>
                  </div>
                  <div className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-300 hover:border-gray-400">
                    <Upload className="mb-2 h-6 w-6 text-gray-400" />
                    <p className="text-xs text-gray-500">Click to upload</p>
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Supported formats: JPG, PNG. Max file size: 5MB.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Specifications</CardTitle>
                <CardDescription>
                  Provide any additional details about your waste
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age of Waste</Label>
                  <Select>
                    <SelectTrigger id="age">
                      <SelectValue placeholder="Select age" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fresh">Fresh (&lt; 1 month)</SelectItem>
                      <SelectItem value="1-3">1-3 months old</SelectItem>
                      <SelectItem value="3-6">3-6 months old</SelectItem>
                      <SelectItem value="6+">Over 6 months old</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="moisture">Moisture Content</Label>
                  <Input id="moisture" placeholder="e.g., < 10%" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="collection">Collection Method</Label>
                  <Select>
                    <SelectTrigger id="collection">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pickup">Pickup only</SelectItem>
                      <SelectItem value="delivery">Delivery available</SelectItem>
                      <SelectItem value="both">Both options available</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Listing"}
          </Button>
        </div>
      </form>
    </div>
  )
}
