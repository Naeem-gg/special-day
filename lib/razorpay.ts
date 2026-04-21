import Razorpay from "razorpay";

if (typeof window !== "undefined") {
  throw new Error("Razorpay client should only be used on the server.");
}

const keyId = (process.env.RAZORPAY_KEY_ID || "").trim();
const keySecret = (process.env.RAZORPAY_KEY_SECRET || "").trim();

if (!keyId || !keySecret) {
  console.warn("⚠️ Razorpay API credentials are missing in environment variables.");
}

export const razorpay = new Razorpay({
  key_id: keyId || "missing_key_id",
  key_secret: keySecret || "missing_key_secret",
});
