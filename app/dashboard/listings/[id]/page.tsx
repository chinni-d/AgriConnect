"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Listing {
  id: string;
  title: string;
  description: string;
  wasteType: string;
  quantity: number;
  unit: string;
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  imageUrl?: string;
}

export default function ListingDetailsPage() {
  const { id } = useParams(); // Use useParams to get the id
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchListing() {
      try {
        const response = await fetch(`/api/listings/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch listing details");
        }
        const data = await response.json();
        setListing(data);
      } catch (error) {
        console.error("Error fetching listing details:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchListing();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!listing) {
    return <p>Listing not found.</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{listing.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p><strong>Description:</strong> {listing.description}</p>
        <p><strong>Waste Type:</strong> {listing.wasteType}</p>
        <p><strong>Quantity:</strong> {listing.quantity} {listing.unit}</p>
        <p><strong>Price:</strong> ${listing.price}</p>
        <p><strong>Location:</strong> {listing.location?.address || "N/A"}, {listing.location?.city || "N/A"}, {listing.location?.state || "N/A"}, {listing.location?.pincode || "N/A"}</p>
        {listing.imageUrl && <img src={listing.imageUrl} alt={listing.title} className="mt-4" />}
      </CardContent>
    </Card>
  );
}
