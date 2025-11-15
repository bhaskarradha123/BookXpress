const mongoose = require("mongoose");
const Book = require("../models/Book");

// =====================
// Search Books (Public)
// =====================
exports.searchBooks = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    const searchRegex = new RegExp(query, "i"); // case-insensitive

    const books = await Book.find({
      $or: [
        { title: searchRegex },
        { author: searchRegex },
        { category: searchRegex },
        { description: searchRegex },
      ],
    });

    res.status(200).json({
      success: true,
      count: books.length,
      books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Search failed",
      error: error.message,
    });
  }
};

// =====================
// Get All Books (Public)
// =====================
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =====================
// Get Book By ID (Public)
// =====================
exports.getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Book ID" });
    }

    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ error: "Book not found" });

    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =====================
// Add Book (Seller Only)
// =====================
exports.addBook = async (req, res) => {
  try {
    const { title, author, price, category, description, image } = req.body;

    if (!title || !author || !price || !category || !image) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    const newBook = await Book.create({
      title,
      author,
      price,
      category,
      description,
      image,
      sellerId: req.user.id,
    });

    res.status(201).json({
      message: "Book added successfully",
      book: newBook,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =====================
// Update Book (Seller Only)
// =====================
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Book ID" });
    }

    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ error: "Book not found" });

    if (book.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const updatedBook = await Book.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      message: "Book updated successfully",
      book: updatedBook,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========================
// Delete Book (Seller Only)
// ========================
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Book ID" });
    }

    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ error: "Book not found" });

    if (book.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await book.deleteOne();

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========================
// Get Books By Seller
// ========================
exports.getBooksBySeller = async (req, res) => {
  try {
    const books = await Book.find({ sellerId: req.user.id });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
