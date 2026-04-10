import mongoose, { Schema } from "mongoose";

const PaymentDetailSchema = new Schema({
  userEmail: { type: String, required: true, index: true },
  cardholderName: { type: String, required: true },
  cardLastFour: { type: String, required: true },
  cardType: { type: String, default: "Visa" }, // Visa, Mastercard, etc.
  expiryMonth: { type: String, required: true },
  expiryYear: { type: String, required: true },
  billingAddress: { type: String },
  city: { type: String },
  country: { type: String },
  isDefault: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.PaymentDetail ||
  mongoose.model("PaymentDetail", PaymentDetailSchema);
