import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function POST(req: Request) {
  try {
    const { name, price, category, imageBase64 } = await req.json();

    if (!name || !price || !category || !imageBase64) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    let imageUrl = imageBase64; // Default to base64 for College Presentation Mocking
    
    // REAL CLOUDINARY UPLOAD: Check if keys exist
    if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_KEY !== "") {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
        folder: 'cloud-store-products',
      });
      imageUrl = uploadResponse.secure_url;
      console.log("Successfully uploaded to Cloudinary:", imageUrl);
    } else {
      console.log("No Cloudinary Key found. Simulating image storage by saving Base64 directly to database.");
    }

    // Connect to MongoDB & save
    await dbConnect();
    const newProduct = await Product.create({
      name,
      price: `$${parseFloat(price).toFixed(2)}`, // ensuring currency format
      category,
      image: imageUrl,
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error: any) {
    console.error("Upload Error:", error);
    return new NextResponse(error.message || "Something went wrong", { status: 500 });
  }
}
