"use client";

import Link from "next/link";
import { User, LogOut } from "lucide-react";
import { useCart } from "@/lib/CartContext";

export default function UserMenu() {
  const { isLoggedIn, logout } = useCart();

  if (isLoggedIn) {
    return (
      <Link 
        href="/profile"
        className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
        title="My Cloud Profile"
      >
        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
          <User className="w-4 h-4" />
        </div>
      </Link>
    );
  }

  return (
    <Link 
      href="/login" 
      className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
      title="Sign In"
    >
      <User className="w-5 h-5" />
    </Link>
  );
}
