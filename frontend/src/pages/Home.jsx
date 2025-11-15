import React, { useContext, useEffect, useState } from "react";
import {
  getAllBooks,
  addBookToCart,
  removeBookFromCart,
  addToWishlist,
  removeFromWishlist,
} from "../api/axios"; // make sure to implement removeBookFromCart & removeFromWishlist in your API
import { toast } from "react-toastify";
import { CartContext } from "../context/CartContext";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [cartBooks, setCartBooks] = useState([]); // store books in cart
  const [wishlistBooks, setWishlistBooks] = useState([]); // store wishlist books
  const token = localStorage.getItem("token");
  const { loadCartCount } = useContext(CartContext);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const response = await getAllBooks();
      setBooks(response.data || []);

      // Optionally, if API provides cart/wishlist info:
      const cartIds = response.data.filter((b) => b.inCart).map((b) => b._id);
      const wishlistIds = response.data.filter((b) => b.inWishlist).map((b) => b._id);
      setCartBooks(cartIds);
      setWishlistBooks(wishlistIds);

    } catch (err) {
      console.error(err);
      toast.error("Failed to load books");
    }
  };

  const handleAddToCart = async (bookId) => {
    if (!token) return toast.warn("Please login to add books to cart");

    try {
      if (cartBooks.includes(bookId)) {
        await removeBookFromCart(bookId);
        setCartBooks(cartBooks.filter((id) => id !== bookId));
        toast.info("Book removed from cart");
      } else {
        await addBookToCart(bookId);
        setCartBooks([...cartBooks, bookId]);
        toast.success("Book added to cart");
      }
      loadCartCount();
    } catch (err) {
      toast.error(err.response?.data?.message || "Cart operation failed");
    }
  };

 const handleWishlist = async (bookId) => {
  if (!token) return toast.warn("Please login to add to wishlist");

  try {
    if (wishlistBooks.includes(bookId)) {
      await removeFromWishlist(bookId); 
      setWishlistBooks(wishlistBooks.filter((id) => id !== bookId));
      toast.info("Book removed from wishlist");
    } else {
      await addToWishlist({ bookId }); 
      setWishlistBooks([...wishlistBooks, bookId]);
      toast.success("Book added to wishlist");
    }
  } catch (err) {
    toast.error(err.response?.data?.error || "Wishlist operation failed");
  }
};


  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
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
