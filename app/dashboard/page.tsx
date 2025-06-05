"use client"

import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BarChart, FileText, ShoppingCart, Users, Clock } from "lucide-react" // Added Clock icon
import { useEffect, useState } from "react"

// Helper function to format date (can be moved to a utils file later)
const formatDate = (dateString?: string) => {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

interface ActivityItem {
  id: string;
  description: string;
  date?: string;
  href?: string;
  icon?: React.ElementType;
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [activeListingsCount, setActiveListingsCount] = useState(0)
  const [soldListingsCount, setSoldListingsCount] = useState(0);
  const [totalWasteDiverted, setTotalWasteDiverted] = useState(0);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]); // State for recent activity

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/listings?seller=${user.id}`)
      .then(res => res.json())
      .then(data => {
        const listings = data.listings || [];
        const activeListings = listings.filter((listing: any) => listing.status === "active");
        setActiveListingsCount(activeListings.length);
        
        const soldListings = listings.filter((listing: any) => listing.status === "sold");
        setSoldListingsCount(soldListings.length);

        let wasteDiverted = 0;
        soldListings.forEach((listing: any) => {
          if (typeof listing.quantity === 'number' && listing.unit) {
            let quantityInKg = listing.quantity;
            switch (listing.unit.toLowerCase()) {
              case 'tons':
              case 'ton':
                quantityInKg *= 1000;
                break;
              case 'quintals':
              case 'quintal':
                quantityInKg *= 100;
                break;
              // Default is kg, no conversion needed
              case 'kg':
              case 'kilograms':
              case 'kilogram':
                break;
              default:
                // if unit is unknown or not provided, we assume kg or skip if quantity is not a number
                // console.warn(`Unknown unit: ${listing.unit} for listing ${listing.id}. Assuming kg if quantity is a number.`);
                break; 
            }
            wasteDiverted += quantityInKg;
          } else if (typeof listing.quantity === 'number') {
            // If unit is not specified, assume kg as a fallback
            wasteDiverted += listing.quantity;
          }
        });
        setTotalWasteDiverted(wasteDiverted);

        // Populate recent activity for sellers (e.g., last 3 created listings)
        if (user?.role === "seller") {
          const sortedListings = [...listings].sort((a: any, b: any) => 
            new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
          );
          const recentItems: ActivityItem[] = sortedListings.slice(0, 3).map((listing: any) => {
            let listingIdentifier = "ID unavailable";
            if (listing.id && typeof listing.id === 'string') {
              listingIdentifier = listing.id.substring(0, 8);
            } else if (listing.id) {
              const idStr = String(listing.id);
              listingIdentifier = idStr.length > 8 ? idStr.substring(0,8) : idStr;
            }
            
            let descriptiveName;
            // Prioritize showing the actual listing title if available
            if (listing.title && String(listing.title).trim() !== "") {
                descriptiveName = String(listing.title).trim();
            } else {
                descriptiveName = `Listing ${listingIdentifier}`;
            }

            return {
              id: listing.id ? String(listing.id) : `unknown-id-${Math.random()}`, // Ensure id is always a string for the key
              description: `New listing created: "${descriptiveName}"`,
              date: listing.createdAt,
              // href: `/dashboard/listings/${listing.id}`, // Links were previously removed
              icon: FileText,
            };
          });
          setRecentActivity(recentItems);
        }
      });
  }, [user?.id, user?.role]); // Added user.role to dependency array

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name}! Here&apos;s an overview of your activity.</p>
      </div>

      {/* Empty dashboard cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {user?.role === "seller" ? "Active Listings" : "Saved Listings"}
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">{user?.role === "seller" ? activeListingsCount : '--'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {user?.role === "seller" ? "Interested Buyers" : "Pending Requests"}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">--</div>
            <p className="text-xs text-muted-foreground">No data yet</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {user?.role === "seller" ? "Completed Sales" : "Completed Purchases"}
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* Updated to display soldListingsCount for seller, or '--' for buyer or if no data */}
            <div className="text-2xl font-bold text-muted-foreground">
              {user?.role === "seller" ? soldListingsCount : '--'}
            </div>
            {user?.role === "seller" && soldListingsCount === 0 && (
              <p className="text-xs text-muted-foreground">No data yet</p>
            )}
            {user?.role === "buyer" && (
              <p className="text-xs text-muted-foreground">No data yet</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Environmental Impact</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* Updated to display totalWasteDiverted for seller, or '--' for buyer or if no data */}
            <div className="text-2xl font-bold text-muted-foreground">
              {user?.role === "seller" ? `${totalWasteDiverted} kg` : '--'}
            </div>
            {user?.role === "seller" && totalWasteDiverted === 0 && (
              <p className="text-xs text-muted-foreground">No data yet</p>
            )}
            {user?.role === "seller" && totalWasteDiverted > 0 && (
              <p className="text-xs text-muted-foreground">Total waste diverted from landfills</p>
            )}
            {user?.role === "buyer" && (
              <p className="text-xs text-muted-foreground">Track your positive impact here soon!</p> 
            )}
          </CardContent>
        </Card>
      </div>

      {/* Empty recent activity and quick actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your recent interactions on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((item) => (
                  <div key={item.id} className="flex items-start space-x-3">
                    {item.icon && <item.icon className="h-5 w-5 text-muted-foreground mt-1" />} 
                    <div className="flex-1">
                      {/* Always render as plain text, removed Link component */}
                      <p className="text-sm font-medium">{item.description}</p>
                      {item.date && (
                        <p className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" /> {formatDate(item.date)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4 text-muted-foreground">
                {user?.role === "seller" ? "No recent listing activity yet." : "Your recent activity will appear here."}
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you might want to perform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            No quick actions available yet.
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
