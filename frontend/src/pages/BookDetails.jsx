import React, { useEffect, useState } from "react";
import { getSellerBooks, deleteBook } from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BookDetails = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const response = await getSellerBooks();
      setBooks(response.data || []);
    } catch (err) {
      toast.error("Failed to load books");
    }
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      await deleteBook(bookId);
      toast.success("Book deleted successfully");
      loadBooks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete book");
    }
  };

  return (

  <div className="max-w-7xl mx-auto px-6 py-12 mt-20">

      {/* Add Book Button + Title */}
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800 tracking-wide">
          📚 Your Books
        </h2>

        <button
          onClick={() => navigate("/add-book")}
          className="px-5 py-3 bg-gradient-to-r from-green-500 to-green-600 
                     text-white rounded-xl shadow-md hover:scale-105 transition-transform"
        >
          + Add New Book
        </button>
      </div>

      {/* Book Cards */}
      {books.length === 0 ? (
        <p className="text-gray-500 text-lg text-center mt-10">No books added yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {books.map((book) => (
            <div
              key={book._id}
              className="bg-white border-blue-200 rounded-2xl shadow-lg hover:shadow-2xl transition 
                         p-5 border hover:border-blue-400 hover:-translate-y-1"
            >
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-56 object-cover rounded-xl shadow-xl hover:scale-105 transition-transform"
              />

              <h3 className="text-xl font-semibold mt-4 text-gray-800">
                {book.title}
              </h3>

              <p className="text-gray-600 text-sm mt-1">{book.author}</p>

              <p className="text-lg font-bold text-blue-600 mt-3">
                ₹ {book.price}
              </p>

              <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                {book.description}
              </p>

              <p className="text-gray-700 mt-2 font-medium">
                Stock: <span className="text-green-600">{book.stock}</span>
              </p>

              {/* Buttons */}
              <div className="flex justify-between mt-5">
                <button
                  onClick={() => navigate(`/update-book/${book._id}`)}
                  className="px-4 py-2 bg-yellow-500 text-white 
                             rounded-lg hover:bg-yellow-600 hover:scale-105 shadow-sm transition"
                >
                  Update
                </button>

                <button
                  onClick={() => handleDelete(book._id)}
                  className="px-4 py-2 bg-red-500 text-white 
                             rounded-lg hover:bg-red-600 hover:scale-105 shadow-sm transition"
                >
                  Delete
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookDetails;
