"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { BarChart, FileText, Home, MessageSquare, Settings, ShoppingCart, Users } from "lucide-react"

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const sellerNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "My Listings",
      href: "/dashboard/listings",
      icon: FileText,
    },
    {
      title: "Interested Buyers",
      href: "/dashboard/interests",
      icon: Users,
    },
    {
      title: "Messages",
      href: "/dashboard/messages",
      icon: MessageSquare,
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  const buyerNavItems = [
    {
      title: "Marketplace",
      href: "/marketplace",
      icon: ShoppingCart,
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: Settings,
    },
  ]

  const navItems = user?.role === "seller" ? sellerNavItems : buyerNavItems

  return (
    <div className="hidden border-r bg-background md:block">
      <div className="flex h-full flex-col gap-2 p-4">
        <div className="py-2">
          <h2 className="px-4 text-lg font-semibold tracking-tight">
            {user?.role === "seller" ? "Seller Dashboard" : "Buyer Dashboard"}
          </h2>
          <p className="px-4 text-sm text-muted-foreground">
            Manage your {user?.role === "seller" ? "waste listings" : "interests"}
          </p>
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </nav>
        <div className="mt-auto">
          <div className="rounded-md bg-green-50 p-4">
            <h3 className="font-medium text-green-800">Need Help?</h3>
            <p className="mt-1 text-xs text-green-700">
              Contact our support team for assistance with your account or listings.
            </p>
            <Link href="/contact">
              <button className="mt-2 w-full rounded-md bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-700">
                Contact Support
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
