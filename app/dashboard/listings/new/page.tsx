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
import { ArrowLeft, Upload, X } from "lucide-react"
import { useAuth } from "@/hooks/use-auth";

export default function NewListingPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const { user } = useAuth();
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      const validFile = files.find(file => 
        file.type.startsWith('image/')
      )
      if (validFile) {
        setSelectedImage(validFile)
      }
    }
  }
  const removeImage = () => {
    setSelectedImage(null)
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Check if user is authenticated
      if (!user) {
        throw new Error("You must be logged in to create a listing");
      }

      if (!user.id) {
        throw new Error("User ID is missing. Please log out and log back in.");
      }

      const formData = new FormData(e.target as HTMLFormElement);
      const location = `${formData.get("address")}, ${formData.get("city")}, ${formData.get("state")}, ${formData.get("pincode")}`;

      let imageUrl = null;// Upload image first if selected
      if (selectedImage) {
        const uploadFormData = new FormData();
        uploadFormData.append("image", selectedImage);

        // Try Supabase storage first, fallback to base64
        let uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        // If Supabase storage fails, try temporary base64 storage
        if (!uploadRes.ok) {
          console.log("Supabase storage failed, using temporary base64 storage");
          uploadRes = await fetch("/api/upload-temp", {
            method: "POST",
            body: uploadFormData,
          });
        }

        if (!uploadRes.ok) {
          const uploadError = await uploadRes.json();
          throw new Error(uploadError.error || "Failed to upload image");
        }

        const uploadData = await uploadRes.json();
        imageUrl = uploadData.imageUrl;
      }      // Create listing data
      const listingData = {
        title: formData.get("title"),
        description: formData.get("description"),
        wasteType: formData.get("waste-type"),
        subtype: formData.get("subtype"),
        quantity: Number(formData.get("quantity")),
        unit: formData.get("unit"),
        price: Number(formData.get("price")),        location,
        sellerId: user.id,
        contactNumber: formData.get("contactNumber"),
        imageUrl: imageUrl, // This will be stored as 'image' field in database
      };      // Create the listing
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listingData),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.error || "Failed to create listing");
      }

      // Show success message
      alert("Listing created successfully!");

      // Redirect to listings page after successful creation
      router.push("/dashboard/listings");    } catch (error) {
      console.error("Error creating listing:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      alert(`Failed to create listing: ${errorMessage}`);
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
  
      
      {!user && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded">
          You must be logged in to create a listing. Please <a href="/login" className="underline">log in</a> first.
        </div>
      )}
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
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input
                    id="contactNumber"
                    name="contactNumber"
                    placeholder="e.g., 9876543210"
                    type="tel"
                    pattern="[0-9]{10}"
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
                  <p className="text-xs text-gray-500">                    Enter the total price for the entire quantity
                  </p>
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
            </Card>            <Card>
              <CardHeader>
                <CardTitle>Image</CardTitle>
                <CardDescription>
                  Upload an image of your waste
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Upload Area */}                  {!selectedImage && (
                    <label className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-300 hover:border-gray-400 transition-colors">
                      <Upload className="mb-2 h-6 w-6 text-gray-400" />
                      <p className="text-xs text-gray-500">Click to upload image</p>
                      <p className="text-xs text-gray-400">All image formats supported, up to 5MB</p>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}

                  {/* Image Preview */}
                  {selectedImage && (
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-md border"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 rounded-b-md">
                        {selectedImage.name}
                      </div>
                      <div className="mt-2">                        <label className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer">
                          Change Image
                          <input
                            type="file"
                            name="image"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </label>
                      </div>
                    </div>
                  )}                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Supported formats: All image formats (JPG, PNG, GIF, WEBP, SVG, etc.). Max file size: 5MB.
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
