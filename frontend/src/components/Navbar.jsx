import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const role = JSON.parse(localStorage.getItem("role"));
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">BookStore</Link>



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

            {/* Show only for admin */}
            {role === "seller" && (
              <>
                <Link to="/manageBooks" className="hover:text-yellow-300">Manage Books</Link>
              </>
            )}




            {!token ? (
              <Link to="/login" className="hover:text-yellow-300">Login</Link>
            ) : (
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/";
                }}
                className="hover:text-red-400"
              >
                Logout
              </button>
            )}



          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
