"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
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
import { 
  Bell, 
  Menu, 
  User, 
  LayoutDashboard, 
  List, 
  Users, // For Interested Buyers / Saved Listings
  MessageSquare, 
  BarChart2, 
  ShoppingBag, 
  UserCircle, // For Profile link and user info
  Settings, 
  LogOut // Changed from LogIn for logout button
} from "lucide-react"
import Image from "next/image"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator" // Added Separator

export function DashboardHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const getLinkClassName = (href: string) => {
    const isActive = pathname === href || (href === "/dashboard/listings" && pathname.startsWith("/dashboard/listings")); // Adjusted for listings child routes
    // Added flex items-center for icon alignment
    const baseStyle = "flex items-center w-full text-left rounded-md px-3 py-2 text-sm";
    if (isActive) {
      return `${baseStyle} font-bold text-green-600 border-l-4 border-green-600`;
    } else {
      return `${baseStyle} text-foreground hover:bg-accent hover:text-accent-foreground`;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden p-2 bg-green-100 rounded-md hover:bg-green-200 transition-colors"
              >
                <Menu className="h-5 w-5 text-green-600" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-3/4 sm:w-1/2 md:hidden"> {/* Adjusted width */}
              <SheetHeader className="mb-4 pb-2 border-b">
                <SheetTitle className="flex items-center gap-2">
                  <Image src="/logo.png" alt="AgriConnect Logo" width={32} height={32} />
                  <span className="text-lg font-bold text-green-600">AgriConnect</span>
                </SheetTitle>
              </SheetHeader>

              {user && (
                <div className="px-3 py-2 mb-2 border-b">
                  <div className="flex items-center gap-2 mb-1">
                    <UserCircle className="h-5 w-5 text-muted-foreground" />
                    <p className="text-sm font-medium">{user.name || user.email}</p>
                  </div>
                  <p className="text-xs text-muted-foreground px-1">{user.role}</p>
                </div>
              )}

              <nav className="flex flex-col space-y-1 p-1"> {/* Reduced space-y and added padding */}
                <SheetClose asChild>
                  <Link
                    href="/dashboard"
                    className={getLinkClassName("/dashboard")}
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                  </Link>
                </SheetClose>
                {user?.role === "seller" ? (
                  <>
                    <SheetClose asChild>
                      <Link
                        href="/dashboard/listings"
                        className={getLinkClassName("/dashboard/listings")}
                      >
                        <List className="mr-2 h-4 w-4" /> My Listings
                      </Link>
                    </SheetClose>
                    {/* REMOVED Interested Buyers LINK */}
                    {/* REMOVED Messages LINK */}
                    {/* REMOVED Analytics LINK */}
                  </>
                ) : (
                  <>
                    <SheetClose asChild>
                      <Link
                        href="/marketplace"
                        className={getLinkClassName("/marketplace")}
                      >
                        <ShoppingBag className="mr-2 h-4 w-4" /> Marketplace
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/dashboard/interests"
                        className={getLinkClassName("/dashboard/interests")}
                      >
                        <Users className="mr-2 h-4 w-4" /> Saved Listings
                      </Link>
                    </SheetClose>
                  </>
                )}
                
      

               
                {/* REMOVED Settings LINK */}
                
                <Separator className="my-2" />
                
                <SheetClose asChild>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left rounded-md px-3 py-2 text-sm font-medium text-red-600 bg-red-100 hover:bg-red-200 transition-colors"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> {/* Corrected Icon */}
                    Log out
                  </button>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="AgriConnect Logo" width={40} height={40} />
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
  
              {/* REMOVED Settings DropdownMenuItem */}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
