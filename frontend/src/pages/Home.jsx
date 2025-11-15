import React, { useContext, useEffect, useState } from "react";
import {
  getAllBooks,
  addBookToCart,
  removeBookFromCart,
  addToWishlist,
  removeFromWishlist,
  searchBooks,
} from "../api/axios";
import { toast } from "react-toastify";
import { CartContext } from "../context/CartContext";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartBooks, setCartBooks] = useState([]);
  const [wishlistBooks, setWishlistBooks] = useState([]);
  const token = localStorage.getItem("token");
  const { loadCartCount } = useContext(CartContext);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const response = await getAllBooks();
      setBooks(response.data || []);
      setFilteredBooks(response.data || []);
      
      const cartIds = response.data.filter((b) => b.inCart).map((b) => b._id);
      const wishlistIds = response.data.filter((b) => b.inWishlist).map((b) => b._id);
      setCartBooks(cartIds);
      setWishlistBooks(wishlistIds);

    } catch (err) {
      console.error(err);
      toast.error("Failed to load books");
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter((book) =>
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase()) ||
        book.category?.toLowerCase().includes(query.toLowerCase()) ||
        book.description?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredBooks(filtered);
    }
  };

  // --- CART / WISHLIST TOGGLE HANDLERS ---
  const handleAddToCart = async (bookId) => {
    if (!token) return toast.warn("Please login to add books to cart");
    try {
      if (cartBooks.includes(bookId)) {
        await removeBookFromCart(bookId);
        setCartBooks(cartBooks.filter((id) => id !== bookId));
        toast.warning("Removed from cart");
      } else {
        await addBookToCart(bookId);
        setCartBooks([...cartBooks, bookId]);
        toast.success("Added to cart");
      }
      loadCartCount();
    } catch (err) {
      toast.error(err.response?.data?.error || "Cart operation failed");
    }
  };

  const handleWishlist = async (bookId) => {
    if (!token) return toast.warn("Please login to add to wishlist");
    try {
      if (wishlistBooks.includes(bookId)) {
        await removeFromWishlist(bookId);
        
        setWishlistBooks(wishlistBooks.filter((id) => id !== bookId));
        toast.warning("Removed from wishlist");
      } else {
        await addToWishlist({ bookId });
        setWishlistBooks([...wishlistBooks, bookId]);
        toast.success("Added to wishlist");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Wishlist operation failed");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by title, author, category or description..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full border p-2 rounded-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <div
            key={book._id}
            className="border rounded-xl p-4 shadow hover:shadow-lg transition"
          >
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-48 object-cover rounded"
            />
            <h3 className="text-lg font-semibold mt-3">{book.title}</h3>
            <p className="text-gray-600">{book.author}</p>
            <p className="font-bold mt-2">₹ {book.price}</p>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleWishlist(book._id)}
                className={`px-3 py-2 rounded-md ${
                  wishlistBooks.includes(book._id)
                    ? "bg-pink-700 text-white"
                    : "bg-pink-500 text-white hover:bg-pink-600"
                }`}
              >
                Wishlist
              </button>

              <button
                onClick={() => handleAddToCart(book._id)}
                className={`px-3 py-2 rounded-md ${
                  cartBooks.includes(book._id)
                    ? "bg-blue-700 text-white"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
