const express = require("express");
const router = express.Router();
const bookController = require("../controllers/BookController");
const auth = require("../middleWare/AuthMiddleWare");

// Public
router.get("/", bookController.getAllBooks);
router.get("/:id", bookController.getBookById);
router.get("/search", bookController.searchBooks);

// Protected (Seller Only)
router.post("/", auth, bookController.addBook);
router.put("/:id", auth, bookController.updateBook);   
router.delete("/:id", auth, bookController.deleteBook);
router.get("/seller/me", auth, bookController.getBooksBySeller);

module.exports = router;
