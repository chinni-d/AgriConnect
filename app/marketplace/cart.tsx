"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar } from "lucide-react";

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
  };

  const handleBuy = (item: CartItem) => {
    // Logic to buy item
    alert(`Buying ${item.name}`);
  };

  const handleClearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Cart</h1>
        <Button variant="ghost" onClick={handleClearCart}>Clear Cart</Button>
      </div>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cartItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
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
                  <div className="flex items-center font-medium">
                    Price: ₹{item.price}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between p-4 pt-0">
                <div className="text-sm text-gray-500">
                  {item.interests} interested
                </div>
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  onClick={() => handleBuy(item)}
                >
                  Buy
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
