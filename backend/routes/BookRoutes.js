const express = require("express");
const router = express.Router();
const bookController = require("../controllers/BookController");
const auth = require("../middleWare/AuthMiddleWare");

// -----------------
// Public Routes
// -----------------
router.get("/search", bookController.searchBooks); 
router.get("/", bookController.getAllBooks);
router.get("/:id", bookController.getBookById);

// -----------------
// Protected Routes (Seller Only)
// -----------------
router.post("/", auth, bookController.addBook);
router.put("/:id", auth, bookController.updateBook);
router.delete("/:id", auth, bookController.deleteBook);
router.get("/seller/me", auth, bookController.getBooksBySeller);

module.exports = router;
