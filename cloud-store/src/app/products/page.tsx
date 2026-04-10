import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductFilters from "@/components/ProductFilters";
import ProductCard from "@/components/ProductCard";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// FINAL 100% RELEVANT CATALOG
const PERFECT_20_CATALOG = [
  // LIGHTING
  { name: "Sleek Desk Lamp", price: "$49.99", category: "Lighting", image: "https://images.pexels.com/photos/8263858/pexels-photo-8263858.jpeg" },
  { name: "Cozy Floor Lamp", price: "$89.99", category: "Lighting", image: "https://images.pexels.com/photos/32684360/pexels-photo-32684360.jpeg" },
  { name: "Modern Pendant Light", price: "$129.99", category: "Lighting", image: "https://images.pexels.com/photos/1123262/pexels-photo-1123262.jpeg" },
  { name: "Industrial Edison Bulb", price: "$15.99", category: "Lighting", image: "https://images.pexels.com/photos/1107717/pexels-photo-1107717.jpeg" },
  { name: "Smart RGB Strip", price: "$39.99", category: "Lighting", image: "https://images.pexels.com/photos/8100140/pexels-photo-8100140.jpeg" },

  // FURNITURE
  { name: "Ergonomic Office Chair", price: "$249.99", category: "Furniture", image: "https://images.pexels.com/photos/3762497/pexels-photo-3762497.jpeg" },
  { name: "Solid Oak Dining Table", price: "$599.99", category: "Furniture", image: "https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg" },
  { name: "Velvet Accent Sofa", price: "$899.99", category: "Furniture", image: "https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg" },
  { name: "Minimalist Bookshelf", price: "$129.99", category: "Furniture", image: "https://images.pexels.com/photos/2067569/pexels-photo-2067569.jpeg" },
  { name: "Kingsize Bed Frame", price: "$750.00", category: "Furniture", image: "https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg" },

  // AUDIO
  { name: "Studio Headphones", price: "$199.99", category: "Audio", image: "https://images.pexels.com/photos/339465/pexels-photo-339465.jpeg" },
  { name: "Bluetooth Speaker", price: "$89.99", category: "Audio", image: "https://images.pexels.com/photos/1034653/pexels-photo-1034653.jpeg" },
  { name: "Soundbar Home Theater", price: "$250.00", category: "Audio", image: "https://images.pexels.com/photos/3945638/pexels-photo-3945638.jpeg" },
  { name: "Vinyl Record Player", price: "$175.99", category: "Audio", image: "https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg" },
  { name: "Condenser Microphone", price: "$145.00", category: "Audio", image: "https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg" },

  // ACCESSORIES
  { name: "Mechanical Keyboard", price: "$125.00", category: "Accessories", image: "https://images.pexels.com/photos/1974520/pexels-photo-1974520.jpeg" },
  { name: "Gaming Mouse RGB", price: "$65.00", category: "Accessories", image: "https://images.pexels.com/photos/2106216/pexels-photo-2106216.jpeg" },
  { name: "Large Desk Mat", price: "$25.00", category: "Accessories", image: "https://images.pexels.com/photos/4458420/pexels-photo-4458420.jpeg" },
  { name: "Laptop Stand", price: "$45.00", category: "Accessories", image: "https://images.pexels.com/photos/4062451/pexels-photo-4062451.jpeg" },
  { name: "Webcam 4K Ultra", price: "$110.00", category: "Accessories", image: "https://images.pexels.com/photos/4107068/pexels-photo-4107068.jpeg" },
];

export default async function ProductsPage({ searchParams }: Props) {
  let displayProducts: any[] = [];
  let connectionStatus = "Cloud Optimized";

  const params = await searchParams;
  const search = typeof params.search === 'string' ? params.search.toLowerCase() : "";
  const categorySelected = typeof params.category === 'string' ? params.category : "All";

  try {
    await dbConnect();
    const query: any = {};
    if (categorySelected !== "All") query.category = categorySelected;
    if (search) query.name = { $regex: search, $options: "i" };
    
    const dbData = await Product.find(query).lean();
    if (dbData.length > 0) {
      displayProducts = dbData.map((p: any) => ({ ...p, _id: p._id.toString() }));
    } else {
       throw new Error("Empty DB");
    }
  } catch (error) {
    connectionStatus = "Offline Mode";
    displayProducts = PERFECT_20_CATALOG.map((item, index) => ({
      _id: `offline-${index}`,
      ...item
    }));

    if (categorySelected !== "All") {
      displayProducts = displayProducts.filter(p => p.category === categorySelected);
    }
    if (search) {
      displayProducts = displayProducts.filter(p => p.name.toLowerCase().includes(search));
    }
  }

  return (
    <div className="bg-white dark:bg-neutral-950 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-neutral-900 dark:text-white">Our Collection</h1>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
               {connectionStatus === "Cloud Optimized" 
                 ? `Displaying ${displayProducts.length} premium products.`
                 : "⚠️ Offline Mode: Showing 20 curated products."}
            </p>
          </div>
        </div>

        <ProductFilters />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {displayProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
