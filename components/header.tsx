"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { Menu, X } from "lucide-react"

export function Header() {
  const { user, status } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0);

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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container relative flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-green-600">AgriConnect</span>
          </Link>
        </div>
        {/* Cart button for buyers: only in desktop nav, not in mobile header */}
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
                  className="relative flex items-center"
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
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700 font-bold text-lg">
                  {user.name?.[0]?.toUpperCase() || <svg width="24" height="24"><circle cx="12" cy="12" r="12" fill="#22c55e" /></svg>}
                </span>
              </button>
              {/* User dropdown */}
              {isMenuOpen && (
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
        <div className="md:hidden flex items-center gap-1 ml-auto">
          {/* Profile button (leftmost) */}
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
          {/* Cart button (middle) */}
          {status === "authenticated" && user?.role === "buyer" && (
            <Link
              href="/marketplace/cart"
              className="relative flex items-center"
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
          {/* Hamburger menu (rightmost) */}
          <button className="ml-1" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden border-t p-4">
          <nav className="flex flex-col space-y-4 items-center text-center">
            <Link
              href="/"
              className="text-sm font-medium hover:text-green-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium hover:text-green-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/marketplace"
              className="text-sm font-medium hover:text-green-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Marketplace
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium hover:text-green-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            {/* Cart for buyers as nav item - removed in mobile, handled in header */}
            {/* Dashboard for sellers */}
            <div className="flex flex-col gap-2 pt-2 w-full items-center">
              {status === "authenticated" && user?.role === "seller" ? (
                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full" variant="outline">
                    Dashboard
                  </Button>
                </Link>
              ) : status !== "authenticated" ? (
                <>
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full" variant="outline">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-green-600 hover:bg-green-700">Sign up</Button>
                  </Link>
                </>
              ) : null}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
