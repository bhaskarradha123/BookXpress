import { razorpayInstance } from "../utils/razorpay.js";

export const placeOrder = async (req, res) => {
  try {
    const { amount } = req.body; 

    const options = {
      amount: amount * 100,    
      currency: "INR",
      receipt: "receipt_order_" + Date.now(),
    };

    const order = await razorpayInstance.orders.create(options);
    res.status(200).json(order);

  } catch (error) {
    res.status(500).json({ message: "Order creation failed", error });
  }
};

import crypto from "crypto";

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      return res.status(200).json({ success: true, message: "Payment verified" });
    } else {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

  } catch (error) {
    res.status(500).json({ message: "Error verifying payment", error });
  }
};

