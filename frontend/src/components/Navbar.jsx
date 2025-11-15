import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { getBookCart } from "../api/axios";

import { FaHeart, FaShoppingCart, FaUser, FaUserAlt, FaUserAltSlash, FaUserCircle } from "react-icons/fa";
import { CartContext } from "../context/CartContext";
import SearchBar from "./SearchBox";

function Navbar() {
  const { cartCount } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const role = JSON.parse(localStorage.getItem("role"));
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
    navigate("/login");
  };
 

  return (
    <nav className="navbar flex items-center justify-between px-6 py-3 bg-blue-600 text-white shadow-lg">
      <Link to="/" className="logo text-2xl font-bold">BookStore</Link>

      <SearchBar  />
      <div className="flex items-center gap-5">

        {!user ? (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
        ) : (
          <>
            {/* Wishlist */}
            <Link to="/wishlist" className="text-xl hover:text-pink-300">
              <FaHeart />
            </Link>

            {/* Cart + Badge */}
            <Link to="/cart" className="relative text-xl hover:text-yellow-300">
              <FaShoppingCart />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile */}
            <Link to="/profile">
            <FaUser />
            </Link>

            {/* Seller menu */}
            {role === "seller" && (
              <Link to="/manageBooks">Manage Books</Link>
            )}

            {
              token && <button onClick={handleLogout}>Logout</button>
            }
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
