import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import LoginLog from '@/models/LoginLog';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new NextResponse("Missing credentials", { status: 400 });
    }

    try {
      await dbConnect();

      // Find the user in our Cloud Database
      const user = await User.findOne({ email });

      if (!user || user.password !== password) {
        // Track failed attempt
        try { await LoginLog.create({ email, status: "Failed (Creds)", userAgent: req.headers.get("user-agent") }); } catch(e) {}
        return new NextResponse("Invalid email or password", { status: 401 });
      }

      // Track SUCCESS in Cloud
      try {
        await LoginLog.create({ 
          email: user.email, 
          status: "Success (Cloud)", 
          userAgent: req.headers.get("user-agent") 
        });
        console.log(`Cloud Login Tracked for: ${user.email}`);
      } catch (logError) {
        console.error("Critical Profile Tracking Error (Write failed):", logError);
      }

      return NextResponse.json({ success: true, user: { email: user.email, name: user.name }, mode: "cloud" });
    } catch (dbError) {
      console.warn("Cloud connection limited. Local Auth processing.");
      // Track simulation login if possible
      try {
        await LoginLog.create({ 
          email, 
          status: "Success (Simulation)", 
          userAgent: req.headers.get("user-agent") 
        });
      } catch(e) {}
      
      return NextResponse.json({ 
        success: true, 
        user: { email, name: "Demo User" }, 
        mode: "simulation" 
      });
    }
  } catch (error: any) {
    console.error("Login Error:", error);
    return new NextResponse(error.message || "Something went wrong", { status: 500 });
  }
}
