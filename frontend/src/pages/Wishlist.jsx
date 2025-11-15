import React, { useEffect, useState } from "react";
import { getWishlist, removeFromWishlist, addBookToCart } from "../api/axios";
import { toast } from "react-toastify";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const response = await getWishlist();
      setWishlist(response.data.items || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load wishlist");
    }
  };

  const handleRemove = async (bookId) => {
    try {
      await removeFromWishlist(bookId);
      toast.success("Removed from wishlist");
      loadWishlist(); // refresh the list
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
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">My Wishlist</h2>

      {wishlist.length === 0 ? (
        <p className="text-gray-500">Your wishlist is empty</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.bookId._id}
              className="border rounded-xl p-4 shadow hover:shadow-lg transition"
            >
              <img
                src={item.bookId.image}
                alt={item.bookId.title}
                className="w-full h-48 object-cover rounded"
              />

              <h3 className="text-lg font-semibold mt-3">
                {item.bookId.title}
              </h3>
              <p className="text-gray-600">{item.bookId.author}</p>
              <p className="font-bold mt-2">₹ {item.bookId.price}</p>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleRemove(item.bookId._id)}
                  className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Remove
                </button>

                <button
                  onClick={() => handleAddToCart(item.bookId._id)}
                  className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
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
