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
  UserCircle,
  LogOut
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
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { user, status, logout } = useAuth()
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

  const getSheetLinkClassName = (href: string) => {
    const isActive = pathname === href || 
                     (href.startsWith("/dashboard") && pathname.startsWith("/dashboard")) || 
                     (href.startsWith("/marketplace") && pathname.startsWith("/marketplace"));
    const baseStyle = "flex items-center w-full text-left rounded-md px-3 py-2 text-sm"; 
    if (isActive) {
      return `${baseStyle} font-bold text-green-600 border-l-4 border-green-600 bg-green-50`; // Added subtle bg for active sheet link
    } else {
      return `${baseStyle} text-foreground hover:bg-accent hover:text-accent-foreground`;
    }
  };

  const getDesktopLinkClassName = (href: string) => {
    const isActive = pathname === href || 
                     (href.startsWith("/dashboard") && pathname.startsWith("/dashboard")) || 
                     (href.startsWith("/marketplace") && pathname.startsWith("/marketplace"));
    let styles = "text-sm font-medium transition-colors rounded-md px-3 py-2"; // Added padding and rounded-md
    if (isActive) {
      styles += " text-green-700 font-semibold bg-green-100"; // Changed active style to background highlight
    } else {
      styles += " text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800"; // Refined hover for inactive
    }
    return styles;
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container relative flex h-16 items-center justify-between">
        <div className="hidden md:flex items-center mr-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="AgriConnect Logo" width={32} height={32} />
            <span className="text-xl font-bold text-green-600">AgriConnect</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-2 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"> {/* Reduced gap from 6 to 2 */} 
          {status === "authenticated" && user?.role === "seller" ? (
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
              {/* Dashboard link removed for non-sellers */}
              <Link href="/contact" className={getDesktopLinkClassName("/contact")}>
                <Mail className="inline-block mr-1 h-4 w-4" />
                Contact
              </Link>
            </>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3 ml-auto"> {/* Reduced gap from 4 to 3 */} 
          {/* Cart Icon for Buyers in Desktop View */} 
          {status === "authenticated" && user?.role === "buyer" && (
            <Link
              href="/marketplace/cart"
              className={`relative flex items-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${pathname === "/marketplace/cart" ? "text-green-600 bg-green-50 dark:bg-green-900/50" : "text-muted-foreground"}`}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Link>
          )}

          {status === "authenticated" && user ? (
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
                {/* For buyers, we might want a different link or no specific dashboard link here if their dashboard is the main /dashboard path already handled by nav */}
                {/* {(user.role === "seller") && <DropdownMenuSeparator />} */}
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2"> {/* Added gap for login/signup buttons */} 
              <Link href="/login">
                <Button variant="outline">
                  <LogIn className="mr-2 h-4 w-4" />
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-green-600 hover:bg-green-700">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile View Setup */}
        <div className="md:hidden flex items-center justify-between w-full">
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
            <SheetContent side="left" className="w-3/4 sm:w-1/2 md:hidden">
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

              <nav className="flex flex-col space-y-1 p-1">
                {status === "authenticated" && user?.role === "seller" ? (
                  <>
                    <SheetClose asChild><Link href="/" className={getSheetLinkClassName("/")}><Home className="mr-2 h-4 w-4" /> Home</Link></SheetClose>
                    <SheetClose asChild><Link href="/about" className={getSheetLinkClassName("/about")}><Info className="mr-2 h-4 w-4" /> About</Link></SheetClose>
                    <SheetClose asChild><Link href="/dashboard" className={getSheetLinkClassName("/dashboard")}><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</Link></SheetClose>
                    <SheetClose asChild><Link href="/contact" className={getSheetLinkClassName("/contact")}><Mail className="mr-2 h-4 w-4" /> Contact</Link></SheetClose>
                  </>
                ) : (
                  <>
                    <SheetClose asChild><Link href="/" className={getSheetLinkClassName("/")}><Home className="mr-2 h-4 w-4" /> Home</Link></SheetClose>
                    <SheetClose asChild><Link href="/about" className={getSheetLinkClassName("/about")}><Info className="mr-2 h-4 w-4" /> About</Link></SheetClose>
                    <SheetClose asChild><Link href="/marketplace" className={getSheetLinkClassName("/marketplace")}><ShoppingBag className="mr-2 h-4 w-4" /> Marketplace</Link></SheetClose>
                    {/* Dashboard link removed for non-sellers */}
                    <SheetClose asChild><Link href="/contact" className={getSheetLinkClassName("/contact")}><Mail className="mr-2 h-4 w-4" /> Contact</Link></SheetClose>
                  </>
                )}
                
                <Separator className="my-2" /> 

                {status === "authenticated" ? (
                  <SheetClose asChild>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left rounded-md px-3 py-2 text-sm font-medium text-red-600 bg-red-100 hover:bg-red-200 transition-colors"
                    >
                      <LogOut className="mr-2 h-4 w-4" /> {/* Corrected Icon */}
                      Logout
                    </button>
                  </SheetClose>
                ) : (
                  <>
                    <SheetClose asChild>
                      <Link href="/login" className={getSheetLinkClassName("/login") + " mt-1"}>
                        <Button variant="outline" className="w-full justify-start">
                          <LogIn className="mr-2 h-4 w-4" /> Log in
                        </Button>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/register" className={getSheetLinkClassName("/register")}>
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

          <div className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="AgriConnect Logo" width={32} height={32} />
              <span className="text-xl font-bold text-green-600">AgriConnect</span>
            </Link>
          </div>
          
          {/* Cart icon and User Profile for mobile view, right-aligned */} 
          <div className="flex items-center gap-2">
            {status === "authenticated" && user?.role === "buyer" && (
                <Link
                  href="/marketplace/cart"
                  className={`relative flex items-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${pathname === "/marketplace/cart" ? "text-green-600 bg-green-50 dark:bg-green-900/50" : "text-muted-foreground"}`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                  <span className="sr-only">Cart</span>
                </Link>
              )}
            
            {/* User Profile Avatar for Mobile */}
            {status === "authenticated" && user && (
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
                  {/* {(user.role === "seller") && <DropdownMenuSeparator />} */}
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* ADDED: Login Button for Mobile (unauthenticated users) */}
            {status !== "authenticated" && (
              <Link href="/login" passHref>
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
