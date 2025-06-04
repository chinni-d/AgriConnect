"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  subtype?: string;
  location?: string;
  distance?: string;
  date?: string;
  interests?: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(cart);
  }, []);

  const handleRemove = (id: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cart-updated"));
  };

  const handleBuy = (item: CartItem) => {
    // Implement actual buy logic
    alert(`Buying ${item.name}`);
  };

  const handleClear = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">My Cart</h1>
          </div>
          <div>
            {cartItems.length === 0 ? (
              <div className="flex h-40 items-center justify-center rounded-lg border">
                <p className="text-muted-foreground">Your cart is empty.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {cartItems.map((item, idx) => (
                  <Card key={item.id + '-' + idx} className="overflow-hidden relative">
                    {/* Remove (X) button */}
                    <button
                      className="absolute right-2 top-2 z-10 bg-white/80 hover:bg-red-100 rounded-full p-1 text-gray-500 hover:text-red-600"
                      onClick={() => handleRemove(item.id)}
                      aria-label="Remove from cart"
                    >
                      <span style={{fontWeight: 'bold', fontSize: '1.2rem', lineHeight: 1}}>×</span>
                    </button>
                    <div className="relative">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-48 w-full object-cover"
                        />
                      )}
                      {item.subtype && (
                        <Badge className="absolute left-2 top-2 bg-green-600 hover:bg-green-700">
                          {item.subtype}
                        </Badge>
                      )}
                    </div>
                    <CardHeader className="p-4 pb-0">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      {item.description && (
                        <p className="mb-2 line-clamp-2 text-sm text-gray-500">
                          {item.description}
                        </p>
                      )}
                      <div className="mt-4 space-y-2 text-sm">
                        {item.location && (
                          <div className="flex items-center text-gray-500">
                            <MapPin className="mr-2 h-4 w-4" />
                            {item.location} {item.distance && `(${item.distance})`}
                          </div>
                        )}
                        {item.date && (
                          <div className="flex items-center text-gray-500">
                            <Calendar className="mr-2 h-4 w-4" />
                            Listed {item.date}
                          </div>
                        )}
                        <div className="flex items-center font-medium">Price: ₹{item.price}</div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between p-4 pt-0">
                    
                      <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleBuy(item)}>
                        Buy
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
