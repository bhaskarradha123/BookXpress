import React, { useContext, useEffect, useState } from "react";
import { getAllBooks, addBookToCart, addToWishlist } from "../api/axios";
import { toast } from "react-toastify";
import { CartContext } from "../context/CartContext";

const Home = () => {
  const [books, setBooks] = useState([]);
  const token = localStorage.getItem("token");
const { loadCartCount } = useContext(CartContext);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const response = await getAllBooks();
      console.log(response.data);
      
      setBooks(response.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load books");
    }
  };

  const handleAddToCart = async (bookId) => {
    if (!token) {
      return toast.warn("Please login to add books to cart");
    }

    try {
      await addBookToCart(bookId);
      toast.success("Book added to cart");
      loadCartCount();  
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleWishlist = async (bookId) => {
    if (!token) {
      return toast.warn("Please login to add to wishlist");
    }

    try {
      await addToWishlist(bookId);
      toast.success("Book added to wishlist");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to wishlist");
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
              src={book.image}          // << FIXED HERE
              alt={book.title}
              className="w-full h-48 object-cover rounded"
            />

            <h3 className="text-lg font-semibold mt-3">{book.title}</h3>
            <p className="text-gray-600">{book.author}</p>
            <p className="font-bold mt-2">₹ {book.price}</p>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleWishlist(book._id)}
                className="px-3 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
              >
                Wishlist
              </button>

              <button
                onClick={() => handleAddToCart(book._id)}
                className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
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
