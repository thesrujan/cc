import Link from "next/link";
import { ArrowRight, Cloud, ShieldCheck, Zap } from "lucide-react";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductCard from "@/components/ProductCard";

export default async function Home() {
  let featuredProducts: any[] = [];
  try {
    // Attempt cloud connection but fail fast
    await dbConnect();
    const raw = await Product.find({}).sort({ createdAt: -1 }).limit(3).lean();
    featuredProducts = raw.map((p: any) => ({ ...p, _id: p._id.toString() }));
  } catch (e) {
    // If cloud fails or is blocked, show instant beauty fallbacks
    featuredProducts = [
      { _id: "f1", name: "Premium Aura Light", price: "$129.00", category: "Lighting", image: "https://picsum.photos/seed/lamp1/800/600" },
      { _id: "f2", name: "Zenith Studio Chair", price: "$349.00", category: "Furniture", image: "https://picsum.photos/seed/chair1/800/600" },
      { _id: "f3", name: "Sonic Pro Audio", price: "$199.00", category: "Audio", image: "https://picsum.photos/seed/audio1/800/600" }
    ];
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:w-2/3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
              <Cloud className="w-3 h-3" /> Cloud-Native E-Commerce
            </div>
            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-neutral-900 dark:text-white mb-6 leading-[0.9]">
              The Future of <br/>
              <span className="text-blue-600">Smart Shopping.</span>
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-10 max-w-xl">
              Experience the power of a fully decentralized cloud store. High-performance, secure, and globally scaleable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products" className="px-8 py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:shadow-2xl transition transform hover:-translate-y-1">
                Shop the Catalog <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/register" className="px-8 py-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition">
                Create Account
              </Link>
            </div>
          </div>
        </div>
        
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-50/50 dark:from-blue-900/10 to-transparent -z-0 skew-x-12 transform translate-x-20"></div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-neutral-900 rounded-3xl shadow-sm border border-neutral-100 dark:border-neutral-800">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Cloud Security</h3>
              <p className="text-neutral-500 text-sm">Every transaction is encrypted and stored in MongoDB Atlas for military-grade protection.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-neutral-900 rounded-3xl shadow-sm border border-neutral-100 dark:border-neutral-800">
              <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-600 mb-6">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Ultra Fast</h3>
              <p className="text-neutral-500 text-sm">Built with Next.js edge-rendering for sub-second page loads across the planet.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-neutral-900 rounded-3xl shadow-sm border border-neutral-100 dark:border-neutral-800">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                <Cloud className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Global Sync</h3>
              <p className="text-neutral-500 text-sm">Real-time inventory synchronization across all your cloud devices instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black mb-12 text-center uppercase tracking-widest">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((p: any) => <ProductCard key={p._id.toString()} product={p} />)
            ) : (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl">
                    <p className="text-neutral-400">Waiting for first Cloud Upload... Check Admin Dashboard.</p>
                </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
