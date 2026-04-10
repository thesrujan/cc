import mongoose, { Schema } from "mongoose";

const LoginLogSchema = new Schema({
  email: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, default: "Success" },
  ip: { type: String },
  userAgent: { type: String },
});

export default mongoose.models.LoginLog || mongoose.model("LoginLog", LoginLogSchema);
