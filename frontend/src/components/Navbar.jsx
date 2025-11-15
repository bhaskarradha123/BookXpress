import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">BookStore</Link>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search books..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Right side menu */}
      <div className="menu">
        {!user ? (
          // Before Login
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
        ) : (
          // After Login
          <>
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/profile">{user.name}</Link>

            {/* Logout Button */}
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
