"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { Menu, X } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter, usePathname } from "next/navigation"

export function Header() {
  const { user, status } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isDesktopProfileOpen, setIsDesktopProfileOpen] = useState(false); // New state for desktop profile dropdown
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

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const menu = document.querySelector(".menu-container");
      if (menu && !menu.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container relative flex h-16 items-center justify-between">
        {/* Nav name/logo for desktop view (top left) */}
        <div className="hidden md:flex items-center mr-4">
          <Link href="/">
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
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        localStorage.removeItem('agriconnect-user');
                        window.location.href = '/login';
                      }
                    }}
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
          {/* Hamburger menu (leftmost) */}
          <button
            className="p-2 bg-green-100 rounded-md hover:bg-green-200 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} className="text-green-600" /> : <Menu size={24} className="text-green-600" />}
          </button>
          {/* Logo (centered) */}
          <div className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2">
            <Link href="/">
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
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        localStorage.removeItem('agriconnect-user');
                        window.location.href = '/login';
                      }
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {isMenuOpen && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 h-screen w-1/2 bg-white shadow-lg z-50 md:hidden flex flex-col menu-container"
        >
          <div className="p-4 border-b flex items-center justify-between">
            <span className="text-lg font-bold text-green-600">Menu</span>
            <button
              className="text-gray-600 hover:text-gray-800"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          <nav className="flex flex-col space-y-4 p-4">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${pathname === "/" ? "text-green-600 font-bold border-l-4 border-green-600 pl-2" : "hover:text-green-600"}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors ${pathname === "/about" ? "text-green-600 font-bold border-l-4 border-green-600 pl-2" : "hover:text-green-600"}`}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/marketplace"
              className={`text-sm font-medium transition-colors ${pathname === "/marketplace" ? "text-green-600 font-bold border-l-4 border-green-600 pl-2" : "hover:text-green-600"}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Marketplace
            </Link>
            <Link
              href="/contact"
              className={`text-sm font-medium transition-colors ${pathname === "/contact" ? "text-green-600 font-bold border-l-4 border-green-600 pl-2" : "hover:text-green-600"}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            {status === "authenticated" ? (
              <button
                className="text-sm font-medium text-red-600 hover:text-white bg-red-100 hover:bg-red-600 transition-colors mt-4 py-2 px-4 rounded-md shadow-md"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    localStorage.removeItem("agriconnect-user");
                    window.location.href = "/login";
                  }
                }}
              >
                Logout
              </button>
            ) : (
              <div className="flex flex-col gap-2 pt-4">
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full" variant="outline">
                    Log in
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </motion.div>
      )}
    </header>
  )
}
