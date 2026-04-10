import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    if (!items || items.length === 0) {
      return new NextResponse("Cart is empty", { status: 400 });
    }

    // FORCE MOCK CHECKOUT FOR DEMO STABILITY
    console.log("Stripe disabled for demo stability. Using Mock Checkout Gateway.");
    return NextResponse.json({ url: `/mock-checkout` });
  } catch (error: any) {
    console.error("Stripe Error:", error);
    return new NextResponse(error.message, { status: 500 });
  }
}
