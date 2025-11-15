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
    <div className="container mx-auto p-6">
      
      {/* Add Book Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Your Books</h2>
        <button
          onClick={() => navigate("/add-book")}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          + Add Book
        </button>
      </div>

      {/* Book Cards */}
      {books.length === 0 ? (
        <p className="text-gray-500">No books added yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <div key={book._id} className="border rounded-xl p-4 shadow hover:shadow-lg transition">

              <img
                src={book.image}
                alt={book.title}
                className="w-full h-48 object-cover rounded"
              />

              <h3 className="text-lg font-semibold mt-3">{book.title}</h3>
              <p className="text-gray-600">{book.author}</p>
              <p className="font-bold mt-2">₹ {book.price}</p>
              <p>{book.description}</p>
              <p>{book.stock} in stock</p>
              {/* Buttons */}
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => navigate(`/update-book/${book._id}`)}
                  className="px-3 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                >
                  Update
                </button>

                <button
                  onClick={() => handleDelete(book._id)}
                  className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
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
