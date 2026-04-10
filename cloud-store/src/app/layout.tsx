import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Search } from "lucide-react";
import { CartProvider } from "@/lib/CartContext";
import CartButton from "@/components/CartButton";
import CartDrawer from "@/components/CartDrawer";
import UserMenu from "@/components/UserMenu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aura | Premium Cloud Store",
  description: "A smart, cloud-based e-commerce platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 transition-colors duration-300">
        <CartProvider>
          <nav className="sticky top-0 z-50 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex-shrink-0 flex items-center">
                  <Link href="/" className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-400">
                    Aura.
                  </Link>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-6">
                  <UserMenu />
                  <div className="h-4 w-px bg-neutral-300 dark:bg-neutral-700 hidden sm:block"></div>
                  <CartButton />
                </div>
              </div>
            </div>
          </nav>
           <main className="flex-grow flex flex-col">
            {children}
          </main>

        <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 py-12 text-center mt-auto">
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
            &copy; {new Date().getFullYear()} Aura E-Commerce. Built for Cloud Scaling.
          </p>
          <Link 
            href="/admin" 
            className="text-xs text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors underline decoration-neutral-200"
          >
            Management Dashboard (Admin)
          </Link>
        </footer>
        <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
