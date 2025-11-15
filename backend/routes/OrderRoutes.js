import express from "express";
import { placeOrder, verifyPayment } from "../controllers/OrderController";

const router = express.Router();

router.post("/order", placeOrder);
router.post("/verify", verifyPayment);

export default router;
