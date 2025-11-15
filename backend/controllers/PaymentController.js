import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js"; // if you created Order model

import * as dotenv from "dotenv";
dotenv.config({ path: "./.env" });

// 1️⃣ Create Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

console.log(process.env.RAZORPAY_KEY_SECRET+" key secret");

// 2️⃣ Create order (frontend calls this when user clicks PAY)
export const createOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;

    const options = {
      amount: amount * 100,  // convert to paise
      currency,
      receipt
    };

    const order = await razorpay.orders.create(options);

    return res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 3️⃣ Verify payment signature (Razorpay sends paymentId + orderId + signature)
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {

      // OPTIONAL: Save to DB
      await Order.create({
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        status: "success"
      });

      return res.json({
        success: true,
        message: "Payment verified successfully"
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid payment signature"
    });

  } catch (error) {
    console.error("Verify Payment Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
