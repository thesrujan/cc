"use client";

import { X, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CartDrawer() {
  const { cart, isCartOpen, closeCart, removeFromCart, cartCount, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  if (!isCartOpen) return null;

  const handleCheckoutCard = async () => {
    try {
      setIsProcessing(true);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
      });

      const data = await res.json();
      if (data.url) {
        if (data.url.startsWith("/")) {
          router.push(data.url);
          closeCart();
        } else {
          window.location.assign(data.url);
        }
      } else {
        alert("Failed to create checkout session. Did you add STRIPE keys to .env.local?");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong handling checkout.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckoutCash = () => {
    // Simulate successful order process for cash on delivery
    clearCart();
    closeCart();
    router.push('/success');
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const numericPrice = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
      return total + numericPrice * item.quantity;
    }, 0).toFixed(2);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={closeCart}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white dark:bg-neutral-950 shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Your Cart ({cartCount})
          </h2>
          <button 
            onClick={closeCart}
            className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-70">
              <ShoppingBag className="w-16 h-16 text-neutral-400" />
              <p className="text-neutral-600 dark:text-neutral-400">Your cart is currently empty.</p>
              <button 
                onClick={closeCart}
                className="mt-4 text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item._id} className="flex gap-4 items-center">
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-100 dark:bg-neutral-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-neutral-900 dark:text-white line-clamp-1">{item.name}</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Qty: {item.quantity}</p>
                  <p className="font-semibold text-neutral-900 dark:text-white mt-1">{item.price}</p>
                </div>
                <button 
                  onClick={() => removeFromCart(item._id)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
            <div className="flex justify-between items-center mb-4 text-xl font-bold text-neutral-900 dark:text-white">
              <span>Total Amount</span>
              <span>${calculateTotal()}</span>
            </div>
            
            <p className="text-sm text-neutral-500 mb-3 text-center">Select Payment Method:</p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleCheckoutCard}
                disabled={isProcessing}
                className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md hover:shadow-xl transform transition hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 flex justify-center items-center"
              >
                {isProcessing ? "Processing..." : "Secure Card Payment"}
              </button>
              
              <button 
                onClick={handleCheckoutCash}
                disabled={isProcessing}
                className="w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md hover:shadow-xl transform transition hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 flex justify-center items-center"
              >
                Cash on Delivery
              </button>
            </div>
            
            <button 
              onClick={clearCart}
              className="w-full mt-4 py-2 text-sm text-neutral-500 hover:text-red-500 dark:text-neutral-400 transition underline"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
