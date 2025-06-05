"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { 
  ShoppingCart, 
  Menu, 
  Home, 
  Info, 
  Users, 
  LayoutDashboard, 
  ShoppingBag, 
  Mail, 
  LogIn, 
  UserPlus,
  UserCircle // For user info
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useRouter, usePathname } from "next/navigation"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator" // Added Separator

export function Header() {
  const { user, status, logout } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isDesktopProfileOpen, setIsDesktopProfileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter()
  const pathname = usePathname();

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cart.length);
    };
    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cart-updated", updateCartCount);
    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cart-updated", updateCartCount);
    };
  }, []);

  const getLinkClassName = (href: string) => {
    const isActive = pathname === href;
    // Added flex items-center for icon alignment
    const baseStyle = "flex items-center w-full text-left rounded-md px-3 py-2 text-sm"; 
    if (isActive) {
      return `${baseStyle} font-bold text-green-600 border-l-4 border-green-600`;
    } else {
      return `${baseStyle} text-foreground hover:bg-accent hover:text-accent-foreground`;
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container relative flex h-16 items-center justify-between">
        {/* Nav name/logo for desktop view (top left) */}
        <div className="hidden md:flex items-center mr-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="AgriConnect Logo" width={32} height={32} />
            <span className="text-xl font-bold text-green-600">AgriConnect</span>
          </Link>
        </div>
        {/* Cart button is now only in nav, not beside logo */}
        <nav className="hidden md:flex items-center gap-6 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {status === "authenticated" && user?.role === "seller" ? (
            <>
              <Link href="/" className="text-sm font-medium hover:text-green-600 transition-colors">
                Home
              </Link>
              <Link href="/about" className="text-sm font-medium hover:text-green-600 transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-sm font-medium hover:text-green-600 transition-colors">
                Contact
              </Link>
              <Link href="/dashboard" className="text-sm font-medium hover:text-green-600 transition-colors">
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link href="/" className="text-sm font-medium hover:text-green-600 transition-colors">
                Home
              </Link>
              <Link href="/about" className="text-sm font-medium hover:text-green-600 transition-colors">
                About
              </Link>
              <Link href="/marketplace" className="text-sm font-medium hover:text-green-600 transition-colors">
                Marketplace
              </Link>
              <Link href="/contact" className="text-sm font-medium hover:text-green-600 transition-colors">
                Contact
              </Link>
              {status === "authenticated" && user?.role === "buyer" && (
                <Link
                  href="/marketplace/cart"
                  className="relative flex items-center ml-2"
                  style={{ minWidth: 40 }}
                >
                  <ShoppingCart className="h-6 w-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}
            </>
          )}
        </nav>
        <div className="hidden md:flex items-center gap-4 ml-auto">
          {status === "authenticated" && user ? (
            <div className="relative group">
              <button
                className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600"
                aria-label="User menu"
                tabIndex={0}
                onClick={() => setIsDesktopProfileOpen(!isDesktopProfileOpen)} // Updated to use isDesktopProfileOpen
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700 font-bold text-lg">
                  {user.name?.[0]?.toUpperCase() || <svg width="24" height="24"><circle cx="12" cy="12" r="12" fill="#22c55e" /></svg>}
                </span>
              </button>
              {/* User dropdown */}
              {isDesktopProfileOpen && ( // Updated to use isDesktopProfileOpen
                <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-2 px-4 text-sm text-gray-700">{user.name || user.email}</div>
                  {/* No dashboard for buyers */}
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    onClick={handleLogout} // Use centralized handleLogout
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline">Log in</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-green-600 hover:bg-green-700">Sign up</Button>
              </Link>
            </>
          )}
        </div>
        {/* Profile, cart, and hamburger menu for mobile - right aligned */}
        <div className="md:hidden flex items-center justify-between w-full">
          {/* Hamburger menu (leftmost) - Replaced with SheetTrigger */}
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
            <SheetContent side="left" className="w-3/4 sm:w-1/2 md:hidden"> {/* Adjusted width for better responsiveness */}
              <SheetHeader className="mb-4 pb-2 border-b">
                <SheetTitle className="flex items-center gap-2">
                  <Image src="/logo.png" alt="AgriConnect Logo" width={32} height={32} />
                  <span className="text-lg font-bold text-green-600">AgriConnect</span>
                </SheetTitle>
              </SheetHeader>
              
              {status === "authenticated" && user && (
                <div className="px-3 py-2 mb-2 border-b">
                  <div className="flex items-center gap-2 mb-1">
                    <UserCircle className="h-5 w-5 text-muted-foreground" />
                    <p className="text-sm font-medium">{user.name || user.email}</p>
                  </div>
                  <p className="text-xs text-muted-foreground px-1">{user.role}</p>
                </div>
              )}

              <nav className="flex flex-col space-y-1 p-1"> {/* Reduced space-y and added padding */}
                {status === "authenticated" && user?.role === "seller" ? (
                  <>
                    <SheetClose asChild>
                      <Link href="/" className={getLinkClassName("/")}>
                        <Home className="mr-2 h-4 w-4" /> Home
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/about" className={getLinkClassName("/about")}>
                        <Info className="mr-2 h-4 w-4" /> About
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/contact" className={getLinkClassName("/contact")}>
                        <Mail className="mr-2 h-4 w-4" /> Contact
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/dashboard" className={getLinkClassName("/dashboard")}>
                        <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                      </Link>
                    </SheetClose>
                  </>
                ) : (
                  <>
                    <SheetClose asChild>
                      <Link href="/" className={getLinkClassName("/")}>
                        <Home className="mr-2 h-4 w-4" /> Home
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/about" className={getLinkClassName("/about")}>
                        <Info className="mr-2 h-4 w-4" /> About
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/marketplace" className={getLinkClassName("/marketplace")}>
                        <ShoppingBag className="mr-2 h-4 w-4" /> Marketplace
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/contact" className={getLinkClassName("/contact")}>
                        <Mail className="mr-2 h-4 w-4" /> Contact
                      </Link>
                    </SheetClose>
                  </>
                )}
                
                <Separator className="my-2" /> 

                {status === "authenticated" ? (
                  <SheetClose asChild>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left rounded-md px-3 py-2 text-sm font-medium text-red-600 bg-red-100 hover:bg-red-200 transition-colors"
                    >
                      <LogIn className="mr-2 h-4 w-4" /> {/* Changed icon to LogOut or similar if available, using LogIn for now */}
                      Logout
                    </button>
                  </SheetClose>
                ) : (
                  <>
                    <SheetClose asChild>
                      <Link href="/login" className={getLinkClassName("/login") + " mt-1"}> {/* Added mt-1 for spacing */}
                        <Button variant="outline" className="w-full justify-start">
                          <LogIn className="mr-2 h-4 w-4" /> Log in
                        </Button>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/register" className={getLinkClassName("/register")}>
                        <Button className="w-full justify-start bg-green-600 hover:bg-green-700">
                          <UserPlus className="mr-2 h-4 w-4" /> Sign up
                        </Button>
                      </Link>
                    </SheetClose>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo (centered) */}
          <div className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="AgriConnect Logo" width={32} height={32} />
              <span className="text-xl font-bold text-green-600">AgriConnect</span>
            </Link>
            {/* Cart button (beside nav name) */}
            {status === "authenticated" && user?.role === "buyer" && (
              <Link
                href="/marketplace/cart"
                className="relative flex items-center ml-4"
                style={{ minWidth: 40 }}
              >
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
          </div>
          {/* Profile button (rightmost) */}
          {status === "authenticated" && user && (
            <div className="relative">
              <button
                className="flex items-center gap-1 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600"
                aria-label="User menu"
                tabIndex={0}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700 font-bold text-lg">
                  {user.name?.[0]?.toUpperCase()}
                  {!user.name?.[0] && (
                    <svg width="24" height="24"><circle cx="12" cy="12" r="12" fill="#22c55e" /></svg>
                  )}
                </span>
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-2 px-4 text-sm text-gray-700">{user.name || user.email}</div>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    onClick={handleLogout} // Use centralized handleLogout
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
