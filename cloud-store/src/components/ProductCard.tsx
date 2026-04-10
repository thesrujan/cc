"use client";

import React from "react";
import { useCart } from "@/lib/CartContext";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }: { product: any }) {
  const { addToCart, isLoggedIn } = useCart();
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("Please log in to add items to your cart!");
      router.push("/login");
      return;
    }
    
    addToCart({
      _id: product._id.toString(),
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  // Simplest possible image URL - guaranteed to work or show broken icon
  const imageUrl = product.image || "https://picsum.photos/seed/placeholder/800/600";

  return (
    <div className="group bg-white dark:bg-neutral-900 rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-100 dark:border-neutral-800">
      <div className="relative h-48 w-full overflow-hidden rounded-xl mb-4 bg-neutral-100 dark:bg-neutral-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // If the image fails, use a reliable fallback immediately
            (e.target as HTMLImageElement).src = "https://picsum.photos/seed/error/800/600";
          }}
        />
      </div>
      
      <div className="space-y-1 mb-4">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-neutral-900 dark:text-white truncate pr-2">{product.name}</h3>
          <span className="text-blue-600 dark:text-blue-400 font-bold whitespace-nowrap">{product.price}</span>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">{product.category}</p>
      </div>

      <button 
        onClick={handleAddToCart}
        className="w-full py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl font-bold text-sm transform transition active:scale-95 hover:opacity-90"
      >
        Add to Cart
      </button>
    </div>
  );
}
