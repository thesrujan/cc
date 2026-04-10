"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CartButton() {
  const { cartCount, openCart, isLoggedIn } = useCart();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = () => {
    if (isLoggedIn) {
      openCart();
    } else {
      alert("Please log in to view your cart!");
      router.push("/login");
    }
  };

  return (
    <button 
      onClick={handleClick}
      className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors relative"
    >
      <ShoppingCart className="w-5 h-5" />
      {mounted && isLoggedIn && cartCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
          {cartCount}
        </span>
      )}
    </button>
  );
}
