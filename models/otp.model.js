import { Schema, model } from "mongoose";

const otpSchema = new Schema({
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 120,
  },
});

// Create the model from the schema
export const OTP = model("OTP", otpSchema);
