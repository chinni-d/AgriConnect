"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CartItem {
  id: string;
  name: string;
  price: number;
}

export default function AddToCart({ item }: { item: CartItem }) {
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    // Simulate adding to cart
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
    setAdded(true);
  };

  return (
    <Button
      className="bg-green-600 hover:bg-green-700"
      onClick={handleAddToCart}
      disabled={added}
    >
      {added ? "Added to Cart" : "Add to Cart"}
    </Button>
  );
}
