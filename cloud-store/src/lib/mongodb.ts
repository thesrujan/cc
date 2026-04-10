import mongoose from "mongoose";
import dns from "dns";

// Force Google DNS immediately to resolve SRV records on restrictive networks
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      connectTimeoutMS: 60000,
      serverSelectionTimeoutMS: 60000,
      family: 4,
    };

    console.log("Attempting to connect to MongoDB Cloud...");
    
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("✅ Successfully connected to MongoDB Atlas Cloud!");
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ MONGODB CONNECTION ERROR:");
        if (err.message.includes("ECONNREFUSED") || err.message.includes("querySrv")) {
          console.error("👉 DIAGNOSIS: Your network is blocking the Cloud Connection.");
          console.error("👉 FIX 1: Whitelist '0.0.0.0/0' (Allow access from anywhere) in your MongoDB Atlas Dashboard.");
          console.error("👉 FIX 2: Try using a mobile hotspot instead of your current Wi-Fi.");
          console.error("👉 FIX 3: Ensure your DNS settings support SRV records (use 8.8.8.8).");
        } else {
          console.error(err.message);
        }
        cached.promise = null;
        throw err;
      });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}


export default dbConnect;
