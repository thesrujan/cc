"use client";

import { useCart } from "@/lib/CartContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, LogOut, CreditCard, ShieldCheck, Plus, Trash2, Loader2 } from "lucide-react";

interface PaymentDetail {
  _id: string;
  cardholderName: string;
  cardLastFour: string;
  cardType: string;
  expiryMonth: string;
  expiryYear: string;
  billingAddress?: string;
  city?: string;
  country?: string;
}

export default function ProfilePage() {
  const { isLoggedIn, userEmail, logout } = useCart();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetail[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    cardholderName: "", cardNumber: "", expiryMonth: "",
    expiryYear: "", cardType: "Visa", billingAddress: "", city: "", country: ""
  });

  useEffect(() => {
    setMounted(true);
    if (!isLoggedIn) { router.push("/login"); return; }
    fetchPaymentDetails();
  }, [isLoggedIn, router]);

  const fetchPaymentDetails = async () => {
    if (!userEmail) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/payment-details?email=${encodeURIComponent(userEmail)}`);
      const data = await res.json();
      if (data.success) setPaymentDetails(data.details);
    } catch (e) {
      console.error("Failed to fetch payment details:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/payment-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, userEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setShowForm(false);
        setForm({ cardholderName: "", cardNumber: "", expiryMonth: "", expiryYear: "", cardType: "Visa", billingAddress: "", city: "", country: "" });
        fetchPaymentDetails();
      }
    } catch (e) {
      console.error("Failed to save:", e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this payment method?")) return;
    await fetch(`/api/payment-details?id=${id}`, { method: "DELETE" });
    setPaymentDetails(prev => prev.filter(p => p._id !== id));
  };

  const handleLogout = () => { logout(); router.push("/login"); };

  if (!mounted || !isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white mb-8">My Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Left Column */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6 text-center">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10" />
              </div>
              <h2 className="font-bold text-neutral-900 dark:text-white mb-1">Cloud User</h2>
              <p className="text-sm text-neutral-500 mb-6">{userEmail}</p>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 font-medium transition"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6">
              <h3 className="font-bold text-neutral-900 dark:text-white mb-4">Cloud Security</h3>
              <div className="flex items-start gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                <ShieldCheck className="w-5 h-5 text-green-500 shrink-0" />
                <p>Payment details are encrypted and saved securely to MongoDB Atlas Cloud. Only last 4 digits are stored.</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 space-y-6">

            {/* Payment Methods */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
                <h3 className="font-bold text-neutral-900 dark:text-white text-lg">💳 Cloud Payment Methods</h3>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider rounded-full">Atlas Cloud</span>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="flex justify-center py-6"><Loader2 className="animate-spin text-blue-500 w-6 h-6" /></div>
                ) : paymentDetails.length === 0 ? (
                  <p className="text-sm text-neutral-500 mb-4">No payment methods saved yet.</p>
                ) : (
                  <div className="space-y-3 mb-4">
                    {paymentDetails.map(card => (
                      <div key={card._id} className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-700 rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-8 bg-neutral-900 dark:bg-white rounded flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-white dark:text-neutral-900" />
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-white">{card.cardType} ending in {card.cardLastFour}</p>
                            <p className="text-sm text-neutral-500">{card.cardholderName} · Expires {card.expiryMonth}/{card.expiryYear}</p>
                            {card.city && <p className="text-xs text-neutral-400">{card.city}, {card.country}</p>}
                          </div>
                        </div>
                        <button onClick={() => handleDelete(card._id)} className="text-red-400 hover:text-red-600 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {!showForm ? (
                  <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition"
                  >
                    <Plus className="w-4 h-4" /> Add payment method
                  </button>
                ) : (
                  <form onSubmit={handleSave} className="mt-4 space-y-4 border-t border-neutral-100 dark:border-neutral-800 pt-4">
                    <h4 className="font-semibold text-neutral-800 dark:text-white">Add New Card</h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-neutral-500 mb-1">Cardholder Name</label>
                        <input required value={form.cardholderName} onChange={e => setForm(f => ({...f, cardholderName: e.target.value}))}
                          className="w-full border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="John Doe" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-neutral-500 mb-1">Card Number</label>
                        <input required maxLength={19} value={form.cardNumber} onChange={e => setForm(f => ({...f, cardNumber: e.target.value}))}
                          className="w-full border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="1234 5678 9012 3456" />
                        <p className="text-xs text-neutral-400 mt-1">Only last 4 digits are saved to cloud.</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-neutral-500 mb-1">Card Type</label>
                        <select value={form.cardType} onChange={e => setForm(f => ({...f, cardType: e.target.value}))}
                          className="w-full border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option>Visa</option><option>Mastercard</option><option>Amex</option><option>Rupay</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-neutral-500 mb-1">Exp. Month</label>
                          <input required value={form.expiryMonth} onChange={e => setForm(f => ({...f, expiryMonth: e.target.value}))}
                            className="w-full border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="MM" maxLength={2} />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-neutral-500 mb-1">Exp. Year</label>
                          <input required value={form.expiryYear} onChange={e => setForm(f => ({...f, expiryYear: e.target.value}))}
                            className="w-full border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="YYYY" maxLength={4} />
                        </div>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-neutral-500 mb-1">Billing Address (Optional)</label>
                        <input value={form.billingAddress} onChange={e => setForm(f => ({...f, billingAddress: e.target.value}))}
                          className="w-full border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="123 Main Street" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-neutral-500 mb-1">City</label>
                        <input value={form.city} onChange={e => setForm(f => ({...f, city: e.target.value}))}
                          className="w-full border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Mumbai" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-neutral-500 mb-1">Country</label>
                        <input value={form.country} onChange={e => setForm(f => ({...f, country: e.target.value}))}
                          className="w-full border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="India" />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button type="submit" disabled={saving}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50">
                        {saving && <Loader2 className="animate-spin w-4 h-4" />}
                        {saving ? "Saving to Cloud..." : "💾 Save to Cloud"}
                      </button>
                      <button type="button" onClick={() => setShowForm(false)}
                        className="px-5 py-2 rounded-lg text-sm text-neutral-500 hover:text-neutral-700 border border-neutral-200 dark:border-neutral-700 transition">
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Order History */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
                <h3 className="font-bold text-neutral-900 dark:text-white text-lg">Recent Cloud Orders</h3>
              </div>
              <div className="p-6">
                <div className="text-center py-8">
                  <p className="text-neutral-500 mb-2">No recent cloud orders found on this account.</p>
                  <p className="text-sm text-neutral-400">When you complete checkout, your transaction ID will log via cloud.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
