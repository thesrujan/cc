"use client";

import { useCart } from "@/lib/CartContext";
import { useState, useEffect } from "react";
import { Lock, CreditCard, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface SavedCard {
  _id: string;
  cardholderName: string;
  cardLastFour: string;
  cardType: string;
  expiryMonth: string;
  expiryYear: string;
}

export default function MockCheckoutPage() {
  const { cart, userEmail } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<SavedCard | null>(null);
  const [nameOnCard, setNameOnCard] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [autoFilled, setAutoFilled] = useState(false);
  const router = useRouter();

  const total = cart.reduce((sum, item) => {
    return sum + parseFloat(item.price.replace(/[^0-9.-]+/g, "")) * item.quantity;
  }, 0).toFixed(2);

  useEffect(() => {
    if (cart.length === 0) { router.push("/products"); return; }
    if (userEmail) {
      fetch(`/api/payment-details?email=${encodeURIComponent(userEmail)}`)
        .then(r => r.json())
        .then(data => {
          if (data.success && data.details.length > 0) {
            setSavedCards(data.details);
            fillCard(data.details[0]);
          }
        })
        .catch(() => {});
    }
  }, [cart.length, userEmail]);

  const fillCard = (card: SavedCard) => {
    setSelectedCard(card);
    setNameOnCard(card.cardholderName);
    setCardNumber(`•••• •••• •••• ${card.cardLastFour}`);
    setExpiry(`${card.expiryMonth}/${card.expiryYear.slice(-2)}`);
    setCvc("•••");
    setAutoFilled(true);
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => { router.push("/success"); }, 2500);
  };

  if (cart.length === 0) return null;

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 flex flex-col md:flex-row overflow-hidden">

      {/* Order Summary */}
      <div className="w-full md:w-1/3 bg-white dark:bg-neutral-900 border-b md:border-b-0 md:border-r border-neutral-200 dark:border-neutral-800 p-6 md:p-12 flex flex-col">
        <h2 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white mb-6 md:mb-8">Order Summary</h2>
        <div className="flex-1 overflow-y-auto space-y-6">
          {cart.map((item) => (
            <div key={item._id} className="flex gap-4">
              <div className="w-16 h-16 rounded-md bg-neutral-100 overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-white">{item.name}</h3>
                <p className="text-sm text-neutral-500">Qty: {item.quantity}</p>
                <p className="font-medium text-neutral-900 dark:text-white">{item.price}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800 mt-8">
          <div className="flex justify-between items-center text-xl font-bold text-neutral-900 dark:text-white">
            <span>Total to Pay</span>
            <span>${total}</span>
          </div>
        </div>
      </div>

      {/* Payment Panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-xl dark:shadow-none p-8 border border-neutral-200 dark:border-neutral-800">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold text-neutral-900 dark:text-white uppercase tracking-tighter">Aura Secure <span className="text-blue-600">Cloud Gateway</span></h1>
            <ShieldCheck className="w-6 h-6 text-blue-600" />
          </div>

          <div className="mb-8 p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
               <Lock className="w-4 h-4 text-neutral-400" />
               <span className="text-xs font-semibold text-neutral-500">256-BIT ENCRYPTION</span>
            </div>
            <span className="text-[10px] font-bold text-blue-600">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
          </div>

          {/* Auto-Fill Banner */}
          {autoFilled && selectedCard && (
            <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-blue-800 dark:text-blue-400">Cloud Auto-Fill Enabled</p>
                <p className="text-xs text-blue-700 dark:text-blue-500">{selectedCard.cardType} •••• {selectedCard.cardLastFour}</p>
              </div>
            </div>
          )}

          {/* Card Switcher (multiple cards) */}
          {savedCards.length > 1 && (
            <div className="mb-6">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Your Saved Cards</p>
              <div className="space-y-2">
                {savedCards.map(card => (
                  <button key={card._id} type="button" onClick={() => fillCard(card)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition ${
                      selectedCard?._id === card._id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-neutral-200 dark:border-neutral-700 hover:border-blue-300"
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-neutral-400" />
                    <span className="text-sm font-medium text-neutral-800 dark:text-white">
                      {card.cardType} •••• {card.cardLastFour} — {card.cardholderName}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Express Checkout */}
          <div className="space-y-4 mb-8">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider text-center">Express Checkout</p>
            <div className="flex gap-3">
              <button type="button" onClick={handlePay} disabled={isProcessing}
                className="flex-1 bg-black text-white hover:bg-neutral-800 py-3 rounded-lg font-semibold flex items-center justify-center transition disabled:opacity-70">
                Apple Pay
              </button>
              <button type="button" onClick={handlePay} disabled={isProcessing}
                className="flex-1 bg-white text-black border border-neutral-300 hover:bg-neutral-50 py-3 rounded-lg font-semibold flex items-center justify-center transition disabled:opacity-70">
                Google Pay
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center mb-8">
            <div className="absolute inset-x-0 h-px bg-neutral-200 dark:bg-neutral-800"></div>
            <span className="relative bg-white dark:bg-neutral-900 px-4 text-sm text-neutral-500">or pay with card</span>
          </div>

          <form onSubmit={handlePay} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Name on Card</label>
              <input type="text" required value={nameOnCard}
                onChange={e => { setNameOnCard(e.target.value); setAutoFilled(false); }}
                placeholder="Full Name"
                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-neutral-900 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Card Information</label>
                {autoFilled && <span className="text-xs text-green-600 font-medium">✓ Cloud Auto-filled</span>}
              </div>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input type="text" required value={cardNumber}
                  onChange={e => { setCardNumber(e.target.value); setAutoFilled(false); }}
                  placeholder="0000 0000 0000 0000" maxLength={19}
                  className="w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 tracking-wider font-mono text-neutral-900 dark:text-white text-sm"
                />
              </div>
              <div className="flex gap-4 mt-2">
                <input type="text" required value={expiry}
                  onChange={e => { setExpiry(e.target.value); setAutoFilled(false); }}
                  placeholder="MM/YY" maxLength={5}
                  className="w-1/2 px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-neutral-900 dark:text-white text-sm"
                />
                <input type="text" required value={cvc}
                  onChange={e => { setCvc(e.target.value); setAutoFilled(false); }}
                  placeholder="CVC" maxLength={4}
                  className="w-1/2 px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-neutral-900 dark:text-white text-sm"
                />
              </div>
            </div>

            <div className="pt-4">
              <button type="submit" disabled={isProcessing}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg transition flex items-center justify-center disabled:opacity-75">
                {isProcessing ? "Processing Secure Payment..." : `Pay $${total}`}
              </button>
            </div>
            <div className="flex justify-center items-center gap-2 mt-4 text-xs text-neutral-500">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <span>Payments are encrypted and secured by cloud infrastructure.</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
