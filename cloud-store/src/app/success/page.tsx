"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const { clearCart } = useCart();
  const [txId, setTxId] = useState("");

  useEffect(() => {
    // Generate static ID on client mount to prevent hydration mismatch
    setTxId(`ch_mock_${Math.random().toString(36).substring(2, 10)}`);
    // Clear the cart when the user lands on the success page
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-4">
      <div className="max-w-md w-full bg-white dark:bg-neutral-900 rounded-3xl shadow-xl dark:shadow-none border border-neutral-200 dark:border-neutral-800 p-8 text-center">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
          Payment Successful!
        </h1>
        
        <p className="text-neutral-600 dark:text-neutral-400 mb-8">
          Thank you for your secure cloud purchase. Your order has been processed via mock Stripe integration and is preparing for delivery.
        </p>

        <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4 mb-8 text-left border border-neutral-100 dark:border-neutral-800">
          <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2 font-semibold">Transaction Details</p>
          <div className="flex justify-between items-center text-sm mb-1">
            <span className="text-neutral-600 dark:text-neutral-400">Payment ID</span>
            <span className="font-mono text-neutral-900 dark:text-white">{txId}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">Status</span>
            <span className="text-green-500 font-medium">Succeeded</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link 
            href="/products" 
            className="flex-1 py-4 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-xl font-bold flex justify-center hover:shadow-lg transform transition hover:-translate-y-1 active:translate-y-0"
          >
            Continue Shopping
          </Link>
          <Link 
            href={`/receipt?id=${txId}`}
            className="flex-1 py-4 bg-white text-neutral-900 dark:bg-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 flex justify-center rounded-xl font-bold hover:bg-neutral-50 dark:hover:bg-neutral-800 transform transition hover:-translate-y-1 active:translate-y-0"
          >
            Generate Cloud Receipt
          </Link>
        </div>
      </div>
    </div>
  );
}
