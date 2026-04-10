import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    if (!items || items.length === 0) {
      return new NextResponse("Cart is empty", { status: 400 });
    }

    // MOCK CHECKOUT: If the user hasn't put a Stripe Key in .env.local, we simulate a checkout terminal.
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === "") {
      console.log("No Stripe Key found. Redirecting to Mock Checkout Gateway.");
      return NextResponse.json({ url: `/mock-checkout` });
    }

    // REAL STRIPE CHECKOUT: If keys exist, use them.
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cloud-store-wheat.vercel.app';

    // Format line items for Stripe
    const lineItems = items.map((item: any) => {
      // Strip currency symbols and convert to cents (Stripe expects integers in cents)
      const numericPrice = parseFloat(item.price.replace(/[^0-9.-]+/g,""));
      const unitAmount = Math.round(numericPrice * 100);

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: unitAmount,
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/success`,
      cancel_url: `${baseUrl}/products`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Error:", error);
    return new NextResponse(error.message, { status: 500 });
  }
}
