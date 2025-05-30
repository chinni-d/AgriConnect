"use client"

import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface ListingCardProps {
  id: string
  title: string
  description?: string
  image?: string
  subtype?: string
  location?: string
  distance?: string
  date?: string
  interests?: number
  price: string | number
  onAction: () => void
  actionLabel: string
}

export function ListingCard({
  id,
  title,
  description,
  image,
  subtype,
  location,
  distance,
  date,
  interests,
  price,
  onAction,
  actionLabel,
}: ListingCardProps) {
  return (
    <Card key={id} className="overflow-hidden">
      <div className="relative">
        {image && <img src={image} alt={title} className="h-48 w-full object-cover" />}
        {subtype && (
          <Badge className="absolute left-2 top-2 bg-green-600 hover:bg-green-700">{subtype}</Badge>
        )}
      </div>
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        {description && <p className="mb-2 line-clamp-2 text-sm text-gray-500">{description}</p>}
        <div className="mt-4 space-y-2 text-sm">
          {location && (
            <div className="flex items-center text-gray-500">
              <MapPin className="mr-2 h-4 w-4" />
              {location} {distance && `(${distance})`}
            </div>
          )}
          {date && (
            <div className="flex items-center text-gray-500">
              <Calendar className="mr-2 h-4 w-4" />
              Listed {date}
            </div>
          )}
          <div className="flex items-center font-medium">Price: ₹{price}</div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        {interests !== undefined && (
          <div className="text-sm text-gray-500">{interests} interested</div>
        )}
        <Button className="bg-green-600 hover:bg-green-700" onClick={onAction}>
          {actionLabel}
        </Button>
      </CardFooter>
    </Card>
  )
}
