const express = require("express");
const router = express.Router();
const cartController = require("../controllers/CartController");
const auth = require("../middleWare/AuthMiddleWare");

router.post("/add", auth, cartController.addToCart);
router.get("/", auth, cartController.getCart);
router.put("/update", auth, cartController.updateQuantity);
router.delete("/remove/:bookId", auth, cartController.removeItem);
router.delete("/clear", auth, cartController.clearCart);

module.exports = router;
