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
  LogOut, // Changed from LogIn for logout button
  Home,
  Info,
  Mail,
  X // Added X icon for the close button
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
    // All links will now be active based on an exact path match.
    const isActive = pathname === href;

    const baseStyle = "flex items-center w-full text-left rounded-md px-3 py-2 text-sm";
    if (isActive) {
      return `${baseStyle} font-bold text-green-600 border-l-4 border-green-600 bg-green-50`;
    } else {
      return `${baseStyle} text-foreground hover:bg-accent hover:text-accent-foreground`;
    }
  };

  const getDesktopLinkClassName = (href: string) => {
    const isActive = pathname === href ||
                     (href.startsWith("/dashboard") && pathname.startsWith("/dashboard")) ||
                     (href.startsWith("/marketplace") && pathname.startsWith("/marketplace"));
    let styles = "text-sm font-medium transition-colors rounded-md px-3 py-2";
    if (isActive) {
      styles += " text-green-700 font-semibold bg-green-100";
    } else {
      styles += " text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800";
    }
    return styles;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container relative flex h-16 items-center justify-between">
        {/* Desktop Logo */}
        <div className="hidden md:flex items-center mr-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="AgriConnect Logo" width={32} height={32} />
            <span className="text-xl font-bold text-green-600">AgriConnect</span>
          </Link>
        </div>
        
        {/* Desktop Right Icons (Bell, User Dropdown) */}
        <div className="hidden md:flex items-center gap-3 ml-auto">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
            <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-green-600"></span>
          </Button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 hover:ring-2 hover:ring-green-500/50 transition-all">
                  <span className="flex h-full w-full items-center justify-center rounded-full bg-green-100 text-green-700 font-bold">
                    {user.name?.[0]?.toUpperCase() || <UserCircle className="h-5 w-5" />}
                  </span>
                  <span className="sr-only">Open user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>
                  <div className="font-medium">{user.name || "User"}</div>
                  <div className="text-xs text-muted-foreground break-all">{user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user.role === "seller" && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                {/* <DropdownMenuSeparator /> */} {/* Separator might be needed if other items are added for buyers */}
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>

        {/* Mobile View Setup */}
        <div className="md:hidden flex items-center justify-between w-full">
          {/* Mobile Menu Trigger (Sheet) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="p-2 bg-green-100 rounded-md hover:bg-green-200 transition-colors"
                aria-label="Toggle menu"
              >
                <Menu className="h-5 w-5 text-green-600" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-60 sm:w-72"> {/* Adjusted width here */}
              {/* REMOVED manually added SheetClose as SheetContent provides one by default */}
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
              <nav className="flex flex-col space-y-1 p-1">
                {user?.role === "seller" ? (
                  <>
                    <SheetClose asChild><Link href="/" className={getLinkClassName("/")}><Home className="mr-2 h-4 w-4" /> Home</Link></SheetClose>
                    <SheetClose asChild><Link href="/about" className={getLinkClassName("/about")}><Info className="mr-2 h-4 w-4" /> About</Link></SheetClose>
                    <SheetClose asChild><Link href="/dashboard" className={getLinkClassName("/dashboard")}><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</Link></SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/dashboard/listings"
                        className={getLinkClassName("/dashboard/listings")}
                      >
                        <List className="mr-2 h-4 w-4" /> My Listings
                      </Link>
                    </SheetClose>
                    <SheetClose asChild><Link href="/contact" className={getLinkClassName("/contact")}><Mail className="mr-2 h-4 w-4" /> Contact</Link></SheetClose>
                  </>
                ) : ( // Buyer or other authenticated user
                  <>
                    <SheetClose asChild><Link href="/" className={getLinkClassName("/")}><Home className="mr-2 h-4 w-4" /> Home</Link></SheetClose>
                    <SheetClose asChild><Link href="/about" className={getLinkClassName("/about")}><Info className="mr-2 h-4 w-4" /> About</Link></SheetClose>
                    <SheetClose asChild><Link href="/marketplace" className={getLinkClassName("/marketplace")}><ShoppingBag className="mr-2 h-4 w-4" /> Marketplace</Link></SheetClose>
                    <SheetClose asChild><Link href="/contact" className={getLinkClassName("/contact")}><Mail className="mr-2 h-4 w-4" /> Contact</Link></SheetClose>
                  </>
                )}
                <Separator className="my-2" />
                <SheetClose asChild>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left rounded-md px-3 py-2 text-sm font-medium text-red-600 bg-red-100 hover:bg-red-200 transition-colors"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </button>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Mobile Logo (Centered) */}
          <div className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="AgriConnect Logo" width={32} height={32} />
              <span className="text-xl font-bold text-green-600">AgriConnect</span>
            </Link>
          </div>
          
          {/* Mobile Right Icons (Bell, User Profile) */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative p-2">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
              <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-green-600"></span>
            </Button>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0 hover:ring-2 hover:ring-green-500/50 transition-all">
                    <span className="flex h-full w-full items-center justify-center rounded-full bg-green-100 text-green-700 font-bold text-sm">
                      {user.name?.[0]?.toUpperCase() || <UserCircle className="h-4 w-4" />}
                    </span>
                    <span className="sr-only">Open user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="bottom" className="w-64 z-[100] mt-1" sideOffset={5}>
                  <DropdownMenuLabel>
                    <div className="font-medium">{user.name || "User"}</div>
                    <div className="text-xs text-muted-foreground break-all">{user.email}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.role === "seller" && (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {/* <DropdownMenuSeparator /> */}
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex flex-row items-center gap-2 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {user?.role === "seller" ? (
          <>
            <Link href="/" className={getDesktopLinkClassName("/")}>
              <Home className="inline-block mr-1 h-4 w-4" />
              Home
            </Link>
            <Link href="/about" className={getDesktopLinkClassName("/about")}>
              <Info className="inline-block mr-1 h-4 w-4" />
              About
            </Link>
            <Link href="/dashboard" className={getDesktopLinkClassName("/dashboard")}>
              <LayoutDashboard className="inline-block mr-1 h-4 w-4" />
              Dashboard
            </Link>
            <Link href="/contact" className={getDesktopLinkClassName("/contact")}>
              <Mail className="inline-block mr-1 h-4 w-4" />
              Contact
            </Link>
          </>
        ) : (
          <>
            <Link href="/" className={getDesktopLinkClassName("/")}>
              <Home className="inline-block mr-1 h-4 w-4" />
              Home
            </Link>
            <Link href="/about" className={getDesktopLinkClassName("/about")}>
              <Info className="inline-block mr-1 h-4 w-4" />
              About
            </Link>
            <Link href="/marketplace" className={getDesktopLinkClassName("/marketplace")}>
              <ShoppingBag className="inline-block mr-1 h-4 w-4" />
              Marketplace
            </Link>
            <Link href="/dashboard" className={getDesktopLinkClassName("/dashboard")}>
              <LayoutDashboard className="inline-block mr-1 h-4 w-4" />
              Dashboard
            </Link>
            <Link href="/contact" className={getDesktopLinkClassName("/contact")}>
              <Mail className="inline-block mr-1 h-4 w-4" />
              Contact
            </Link>
          </>
        )}
      </nav>
    </header>
  )
}