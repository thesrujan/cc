"use client";

import { useEffect, useState } from "react";
import { Cloud, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Suspense } from "react";

function ReceiptContent() {
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const txId = searchParams.get("id") || `ch_mock_${Math.random().toString(36).substring(2, 10)}`;

  useEffect(() => {
    setMounted(true);
    // Automatically trigger the browser's PDF save/print dialog once the invoice loads
    const timer = setTimeout(() => {
      window.print();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4 print:p-0 print:bg-white text-neutral-900">
      <div className="max-w-2xl w-full bg-white p-10 md:p-16 shadow-2xl print:shadow-none mx-auto">
        
        {/* Receipt Header */}
        <div className="flex justify-between items-start border-b border-neutral-200 pb-8 mb-8">
          <div>
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <Cloud className="w-8 h-8" />
              <span className="text-2xl font-black tracking-tight">Cloud Store.</span>
            </div>
            <p className="text-neutral-500 text-sm">Automated Cloud Receipt</p>
          </div>
          <div className="text-right">
            <h1 className="text-3xl font-light text-neutral-300">RECEIPT</h1>
            <p className="font-mono text-sm mt-2 text-neutral-500">{txId}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-8 mb-10">
          <div>
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Billed To</p>
            <p className="font-medium">Cloud Demo User</p>
            <p className="text-sm text-neutral-500">demo@cloudstore.test</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Date Paid</p>
            <p className="font-medium text-sm">{date}</p>
            <div className="flex items-center justify-end gap-1 mt-1 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Successfully Paid</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mb-10">
          <div className="flex justify-between border-b-2 border-neutral-900 pb-2 mb-4">
            <span className="font-bold text-sm tracking-wide">Description</span>
            <span className="font-bold text-sm tracking-wide">Amount</span>
          </div>
          
          <div className="flex justify-between py-3 border-b border-neutral-100">
            <span className="text-neutral-700">Cloud Store Purchase (Online Catalog)</span>
            <span className="font-mono">$249.00</span>
          </div>
          <div className="flex justify-between py-3 border-b border-neutral-100">
            <span className="text-neutral-700">Cloud Processing Fee</span>
            <span className="font-mono">$0.00</span>
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-1/2">
            <div className="flex justify-between py-2">
              <span className="text-neutral-500">Subtotal</span>
              <span className="font-mono">$249.00</span>
            </div>
            <div className="flex justify-between py-2 border-b border-neutral-200">
              <span className="text-neutral-500">Tax (0%)</span>
              <span className="font-mono">$0.00</span>
            </div>
            <div className="flex justify-between py-4 text-xl font-bold">
              <span>Total Paid</span>
              <span className="font-mono">$249.00</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-neutral-400 print:hidden">
          <p className="mb-4">This receipt was algorithmically generated via Cloud Microservices.</p>
          <Link href="/products" className="inline-block px-6 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-full font-medium transition">
            Back to Application
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function ReceiptPage() {
  return (
    <Suspense fallback={<div>Loading Secure Cloud Receipt...</div>}>
      <ReceiptContent />
    </Suspense>
  );
}
