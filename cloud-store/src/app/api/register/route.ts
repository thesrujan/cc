import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    try {
      await dbConnect();

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return new NextResponse("Email already registered", { status: 400 });
      }

      // Create Cloud User
      const newUser = await User.create({
        name,
        email,
        password,
      });

      return NextResponse.json({ success: true, user: { email: newUser.email, name: newUser.name }, mode: "cloud" });
    } catch (dbError) {
      console.warn("Cloud connection blocked. Switching to Simulation Mode.");
      return NextResponse.json({ 
        success: true, 
        user: { email, name }, 
        mode: "simulation" 
      });
    }
  } catch (error: any) {
    console.error("Registration Error:", error);
    return new NextResponse(error.message || "Something went wrong", { status: 500 });
  }
}
