const Book = require("../models/Book");

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
    const book = await Book.findById(req.params.id);

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
      image,               // Cloudinary URL
      sellerId: req.user.id, // Seller who owns the book
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

    // check if book exists
    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ error: "Book not found" });

    // seller authorization
    if (book.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // update book
    const updatedBook = await Book.findByIdAndUpdate(id, req.body, {
      new: true,           // return updated data
      runValidators: true, // validate fields
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

    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ error: "Book not found" });

    // authorization check
    if (book.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await book.deleteOne();

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getBooksBySeller = async (req, res) => {
  try {
    const books = await Book.find({ sellerId: req.user.id });

    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
