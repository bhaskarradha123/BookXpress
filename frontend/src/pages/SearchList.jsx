import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { searchBooks } from "../api/axios";

const SearchList = () => {
  const location = useLocation();
  const [books, setBooks] = useState([]);
  const { query } = useParams();

  useEffect(() => {
    if (query) {
      console.log(query,'query');
      fetchBooks(query);
    }
  }, [query]);

  const fetchBooks = async (q) => {
    try {
      const res = await searchBooks(q);
      console.log(res);
      const data = res.data;
      
      setBooks(data.books || []);
    } catch (err) {
      console.log("Error:", err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        Search Results for: <span className="text-blue-600">"{query}"</span>
      </h2>

      {books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {books.map((book) => (
            <div key={book._id} className="border p-3 rounded-lg shadow-sm">
              <img src={book.image} className="w-full h-40 object-cover rounded" />
              <h3 className="text-lg font-semibold">{book.title}</h3>
              <p className="text-gray-600">{book.author}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchList;
