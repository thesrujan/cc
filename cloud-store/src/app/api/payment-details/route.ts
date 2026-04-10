import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import PaymentDetail from "@/models/PaymentDetail";

// GET - fetch payment details for a user
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    if (!email) return new NextResponse("Email required", { status: 400 });

    await dbConnect();
    const details = await PaymentDetail.find({ userEmail: email }).lean();
    return NextResponse.json({ success: true, details });
  } catch (err: any) {
    return new NextResponse(err.message, { status: 500 });
  }
}

// POST - save new payment detail
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userEmail, cardholderName, cardNumber, expiryMonth, expiryYear, billingAddress, city, country, cardType } = body;

    if (!userEmail || !cardholderName || !cardNumber || !expiryMonth || !expiryYear) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    await dbConnect();

    // NEVER store full card number — only last 4 digits
    const cardLastFour = cardNumber.replace(/\s/g, "").slice(-4);

    const detail = await PaymentDetail.create({
      userEmail,
      cardholderName,
      cardLastFour,
      cardType: cardType || "Visa",
      expiryMonth,
      expiryYear,
      billingAddress,
      city,
      country,
      isDefault: true,
    });

    return NextResponse.json({ success: true, detail });
  } catch (err: any) {
    return new NextResponse(err.message, { status: 500 });
  }
}

// DELETE - remove a payment detail by ID
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return new NextResponse("ID required", { status: 400 });

    await dbConnect();
    await PaymentDetail.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return new NextResponse(err.message, { status: 500 });
  }
}
