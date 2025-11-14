const express = require("express");
const router = express.Router();
const orderController = require("../controllers/OrderController");
const auth = require("../middleWare/AuthMiddleWare");

// User routes
router.post("/", auth, orderController.placeOrder);
router.get("/my-orders", auth, orderController.getUserOrders);
router.get("/:id", auth, orderController.getOrderById);

// Admin/Seller
router.put("/:id/status", auth, orderController.updateOrderStatus);

module.exports = router;
