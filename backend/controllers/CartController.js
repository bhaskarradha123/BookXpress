const Cart = require("../models/Cart");
const Book = require("../models/Book");

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId, quantity } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ error: "Book not found" });

    let cart = await Cart.findOne({ userId });

    // If cart doesn't exist, create one
    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [{ bookId, quantity }]
      });
      return res.status(201).json(cart);
    }

    // If cart exists, check if book already in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.bookId.toString() === bookId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity || 1;
    } else {
      cart.items.push({ bookId, quantity });
    }

    await cart.save();
    res.json({ message: "Added to cart", cart });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id })
      .populate("items.bookId");

    if (!cart) return res.json({ items: [] });

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateQuantity = async (req, res) => {
  try {
    const { bookId, quantity } = req.body;

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.find(item => item.bookId.toString() === bookId);
    if (!item) return res.status(404).json({ error: "Book not in cart" });

    item.quantity = quantity;

    await cart.save();
    res.json({ message: "Quantity updated", cart });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeItem = async (req, res) => {
  try {
    const { bookId } = req.params;

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.bookId.toString() !== bookId
    );

    await cart.save();
    res.json({ message: "Item removed", cart });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { userId: req.user.id },
      { items: [] }
    );

    res.json({ message: "Cart cleared" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
