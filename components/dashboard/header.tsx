"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Menu, User } from "lucide-react"
import { useState } from "react"

export function DashboardHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-green-600">AgriConnect</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
            <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-green-600"></span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="border-t p-4 md:hidden">
          <nav className="flex flex-col space-y-2">
            <Link
              href="/dashboard"
              className="rounded-md px-3 py-2 text-sm hover:bg-accent"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            {user?.role === "seller" ? (
              <>
                <Link
                  href="/dashboard/listings"
                  className="rounded-md px-3 py-2 text-sm hover:bg-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Listings
                </Link>
                <Link
                  href="/dashboard/interests"
                  className="rounded-md px-3 py-2 text-sm hover:bg-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Interested Buyers
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/marketplace"
                  className="rounded-md px-3 py-2 text-sm hover:bg-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Marketplace
                </Link>
                <Link
                  href="/dashboard/interests"
                  className="rounded-md px-3 py-2 text-sm hover:bg-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Saved Listings
                </Link>
              </>
            )}
            <Link
              href="/dashboard/profile"
              className="rounded-md px-3 py-2 text-sm hover:bg-accent"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Profile
            </Link>
            <Link
              href="/dashboard/settings"
              className="rounded-md px-3 py-2 text-sm hover:bg-accent"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Settings
            </Link>
            <button onClick={handleLogout} className="rounded-md px-3 py-2 text-sm text-left hover:bg-accent">
              Log out
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}
