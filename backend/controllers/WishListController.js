const Wishlist = require("../models/Wishlist");
const Book = require("../models/Book");

exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ error: "Book not found" });

    let wishlist = await Wishlist.findOne({ userId });

    // If wishlist doesn't exist, create new one
    if (!wishlist) {
      wishlist = await Wishlist.create({
        userId,
        items: [{ bookId }]
      });
      return res.status(201).json({ message: "Added to wishlist", wishlist });
    }

    // Check if book is already in wishlist
    const exists = wishlist.items.some(
      (item) => item.bookId.toString() === bookId
    );

    if (exists) {
      return res.status(400).json({ error: "Already in wishlist" });
    }

    wishlist.items.push({ bookId });
    await wishlist.save();

    res.json({ message: "Added to wishlist", wishlist });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user.id })
      .populate("items.bookId");

    if (!wishlist) return res.json({ items: [] });

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { bookId } = req.params;

    const wishlist = await Wishlist.findOne({ userId: req.user.id });
    if (!wishlist) return res.status(404).json({ error: "Wishlist not found" });

    wishlist.items = wishlist.items.filter(
      (item) => item.bookId.toString() !== bookId
    );

    await wishlist.save();
    res.json({ message: "Removed from wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.clearWishlist = async (req, res) => {
  try {
    await Wishlist.findOneAndUpdate(
      { userId: req.user.id },
      { items: [] }
    );

    res.json({ message: "Wishlist cleared" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
