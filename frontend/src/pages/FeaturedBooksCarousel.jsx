import React from "react";
import { motion } from "framer-motion";

const FeaturedStrip = ({
  featuredBooks,
  cartBooks,
  wishlistBooks,
  handleAddToCart,
  handleWishlist,
}) => {

  // ⭐ BOOK CARD INSIDE SAME FILE
  const BookCard = ({ book }) => (
    <motion.div
      className="min-w-[45%] sm:min-w-[30%] md:min-w-[23%] bg-white rounded-2xl shadow-md p-4 mx-2 
                 hover:shadow-xl transition-all duration-300"
      whileHover={{ scale: 1.03 }}
    >
      {/* IMAGE */}
      <div className="relative overflow-hidden rounded-xl">
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-44 object-cover rounded-xl"
        />
        <span className="absolute top-2 right-2 bg-white/80 text-xs px-2 py-1 rounded">
          {book.category}
        </span>
      </div>

      {/* TEXT */}
      <h4 className="font-semibold text-sm sm:text-base mt-3 line-clamp-1">
        {book.title}
      </h4>

      <p className="text-xs text-gray-500 line-clamp-1">{book.author}</p>

      {/* PRICE */}
      <div className="flex justify-between items-center mt-3">
        <span className="text-indigo-600 font-bold text-sm sm:text-base">
          ₹{book.price}
        </span>
      </div>

      {/* ACTION BUTTONS */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => handleAddToCart(book._id)}
          className={`flex-1 py-2 rounded-lg text-white text-sm ${
            cartBooks.includes(book._id)
              ? "bg-indigo-700"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          Add
        </button>

        <button
          onClick={() => handleWishlist(book._id)}
          className={`px-3 py-2 rounded-lg text-sm ${
            wishlistBooks.includes(book._id)
              ? "bg-pink-500 text-white"
              : "bg-gray-100"
          }`}
        >
          ♡
        </button>
      </div>
    </motion.div>
  );

  return (
    <section className="mb-10 w-full overflow-hidden">
      <h3 className="text-2xl font-bold mb-6">Featured Picks</h3>

      {/* SCROLL ANIMATION WRAPPER */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
        {featuredBooks.map((book) => (
          <BookCard
            key={book._id}
            book={book}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedStrip;
