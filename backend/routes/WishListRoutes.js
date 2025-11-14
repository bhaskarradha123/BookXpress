const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/WishListController");
const auth = require("../middleWare/AuthMiddleWare");

router.post("/add", auth, wishlistController.addToWishlist);
router.get("/", auth, wishlistController.getWishlist);
router.delete("/remove/:bookId", auth, wishlistController.removeFromWishlist);
router.delete("/clear", auth, wishlistController.clearWishlist);

module.exports = router;
