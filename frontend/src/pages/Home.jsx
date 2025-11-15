import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";

function Home() {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    // Search filter
    const result = books.filter((b) =>
      b.title.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, books]);

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/books");
      setBooks(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.log("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading books...</p>;

  return (
    <div className="home-container">

      {/* Search Bar */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search Books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Book List */}
      <div className="book-grid">
        {filtered.length === 0 ? (
          <p>No books found</p>
        ) : (
          filtered.map((book) => (
            <div key={book._id} className="book-card">
              <Link to={`/book/${book._id}`}>
                <img src={book.image} alt={book.title} className="book-img" />
              </Link>

              <h3>{book.title}</h3>
              <p>by {book.author}</p>
              <p>₹ {book.price}</p>

              {/* Wishlist + Cart only if logged in */}
              {user && (
                <div className="btn-row">
                  <button>Add to Wishlist</button>
                  <button>Add to Cart</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
