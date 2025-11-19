import React, { useEffect, useState } from "react";
import { getWishlist, removeFromWishlist, addBookToCart } from "../api/axios";
import { toast } from "react-toastify";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const response = await getWishlist();
      setWishlist(response.data.items || []);
    } catch (err) {
      toast.error("Failed to load wishlist");
    }
  };

  const handleRemove = async (bookId) => {
    try {
      await removeFromWishlist(bookId);
      toast.success("Removed from wishlist");
      loadWishlist();
    } catch (err) {
      toast.error("Failed to remove");
    }
  };

  const handleAddToCart = async (bookId) => {
    try {
      await addBookToCart(bookId, 1);
      toast.success("Added to cart");
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-indigo-200 px-6 py-20">

      {/* Title */}
      <h2 className="text-4xl font-bold text-center text-gray-800 drop-shadow mb-10">
        ❤️ My Wishlist
      </h2>

      {/* Empty Wishlist */}
      {wishlist.length === 0 ? (
        <p className="text-center text-gray-600 text-lg font-medium">
          Your wishlist is empty.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">

          {wishlist.map((item) => (
            <div
              key={item.bookId._id}
              className="bg-white/40 backdrop-blur-xl border border-white/50 p-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.03]"
            >
              {/* Book Image */}
              <img
                src={item.bookId.image}
                alt={item.bookId.title}
                className="w-full h-60 object-cover rounded-xl shadow-md"
              />

              {/* Title */}
              <h3 className="text-xl font-bold mt-4 text-gray-800">
                {item.bookId.title}
              </h3>

              {/* Author */}
              <p className="text-gray-700">{item.bookId.author}</p>

              {/* Price */}
              <p className="font-bold mt-2 text-indigo-700 text-lg">
                ₹ {item.bookId.price}
              </p>

              {/* Buttons */}
              <div className="flex justify-between mt-5">
                <button
                  onClick={() => handleRemove(item.bookId._id)}
                  className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 hover:scale-[1.05] transition"
                >
                  Remove
                </button>

                <button
                  onClick={() => handleAddToCart(item.bookId._id)}
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 hover:scale-[1.05] transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default Wishlist;
