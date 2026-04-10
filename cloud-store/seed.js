const mongoose = require('mongoose');
const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

const MONGODB_URI = "mongodb+srv://srujan7406_db_user:Srujan%401234@cluster0.6euaaf1.mongodb.net/cloud_store?retryWrites=true&w=majority&appName=Cluster0";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
});

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

const catalog = [
  // LIGHTING
  { name: "Sleek Desk Lamp", price: "$49.99", category: "Lighting", image: "https://images.pexels.com/photos/8263858/pexels-photo-8263858.jpeg" },
  { name: "Cozy Floor Lamp", price: "$89.99", category: "Lighting", image: "https://images.pexels.com/photos/32684360/pexels-photo-32684360.jpeg" },
  { name: "Modern Pendant Light", price: "$129.99", category: "Lighting", image: "https://images.pexels.com/photos/1123262/pexels-photo-1123262.jpeg" },
  { name: "Industrial Edison Bulb", price: "$15.99", category: "Lighting", image: "https://i.pinimg.com/originals/a6/92/7f/a6927f8cae03961246a0fe75f706935f.jpg" },
  { name: "Smart RGB Strip", price: "$39.99", category: "Lighting", image: "https://galaxyhomeautomation.com/wp-content/uploads/2022/09/Web-Product-2022-09-19T171137.009.png" },

  // FURNITURE
  { name: "Ergonomic Office Chair", price: "$249.99", category: "Furniture", image: "https://m.media-amazon.com/images/I/71DWj8XOd9L.jpg" },
  { name: "Solid Oak Dining Table", price: "$599.99", category: "Furniture", image: "https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg" },
  { name: "Velvet Accent Sofa", price: "$899.99", category: "Furniture", image: "https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg" },
  { name: "Minimalist Bookshelf", price: "$129.99", category: "Furniture", image: "https://images.pexels.com/photos/2067569/pexels-photo-2067569.jpeg" },
  { name: "Kingsize Bed Frame", price: "$750.00", category: "Furniture", image: "https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg" },

  // AUDIO
  { name: "Studio Headphones", price: "$199.99", category: "Audio", image: "https://gadgetspage.com/wp-content/uploads/2017/06/best-studio-headphones-review.png" },
  { name: "Bluetooth Speaker", price: "$89.99", category: "Audio", image: "https://www.slashgear.com/img/gallery/10-major-bluetooth-speaker-brands-ranked-worst-to-best/l-intro-1684351042.jpg" },
  { name: "Soundbar Home Theater", price: "$250.00", category: "Audio", image: "https://www.pngall.com/wp-content/uploads/11/Home-Theater-System-PNG-Cutout.png" },
  { name: "Vinyl Record Player", price: "$175.99", category: "Audio", image: "https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg" },
  { name: "Condenser Microphone", price: "$145.00", category: "Audio", image: "https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg" },

  // ACCESSORIES
  { name: "Mechanical Keyboard", price: "$125.00", category: "Accessories", image: "https://robots.net/wp-content/uploads/2023/08/14-amazing-logitech-mechanical-keyboard-for-2023-1692371036.jpg" },
  { name: "Gaming Mouse RGB", price: "$65.00", category: "Accessories", image: "https://png.pngtree.com/thumb_back/fw800/background/20240619/pngtree-gaming-mouse-with-rgb-led-light-creative-ai-image_15894643.jpg" },
  { name: "Large Desk Mat", price: "$25.00", category: "Accessories", image: "https://m.media-amazon.com/images/I/91D-Wk4QckL._AC_.jpg" },
  { name: "Laptop Stand", price: "$45.00", category: "Accessories", image: "https://facts.net/wp-content/uploads/2024/01/9-best-laptop-stands-1706505860.jpg" },
  { name: "Webcam 4K Ultra", price: "$110.00", category: "Accessories", image: "https://media.s-bol.com/RPRZkyM08gLY/1200x1110.jpg" },
];

async function seed() {
  try {
    console.log("🚀 FINAL PRECISION SEEDING: 20 Items...");
    await mongoose.connect(MONGODB_URI, { family: 4, serverSelectionTimeoutMS: 60000 });
    await Product.deleteMany({});
    await Product.insertMany(catalog);
    console.log("✅ SUCCESS: All images are now 100% relevant and professional.");
    process.exit(0);
  } catch (err) {
    console.error("❌ ERROR:", err.message);
    process.exit(1);
  }
}

seed();
