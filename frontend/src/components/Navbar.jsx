// src/components/Navbar.jsx
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

import {
  FaHeart,
  FaShoppingCart,
  FaUser,
  FaEllipsisV,
  FaHome,
  FaBook,
} from "react-icons/fa";

export default function Navbar() {
  // safe context access with defaults
  const { cartCount: ctxCartCount = 0 } = useContext(CartContext) || {};
  const { user, logout: authLogout } = useContext(AuthContext) || {};
  const cartCount = Number(ctxCartCount || 0);

  const [open, setOpen] = useState(false);
  const role = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("role")) : null;
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <nav
        className="
          w-full flex items-center justify-between
          px-6 py-3
          backdrop-blur-md bg-white/70 dark:bg-black/20
          shadow-[0_0_20px_rgba(0,0,0,0.05)]
        "
        role="navigation"
        aria-label="Main"
      >
        {/* Brand */}
        <Link
          to="/"
          className="
            text-2xl md:text-3xl font-extrabold tracking-tight 
            bg-gradient-to-r from-blue-500 to-indigo-600
            bg-clip-text text-transparent 
            hover:scale-105 transition duration-200
          "
        >
          BookXpress
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 ml-auto text-lg font-medium">
          {!user && (
            <>
              <NavLink className="hover:text-blue-500 transition" to="/register">
                Register
              </NavLink>
              <NavLink className="hover:text-blue-500 transition" to="/login">
                Login
              </NavLink>
            </>
          )}

          {user && (
            <>
              <NavLink className="hover:text-red-500 text-xl transition" to="/wishlist" title="Wishlist">
                <FaHeart />
              </NavLink>

              <NavLink className="relative text-xl transition" to="/cart" title="Cart">
                <FaShoppingCart />
                <span
                  className={`
                    absolute -top-2 -right-3 text-xs px-2 rounded-full font-bold
                    ${cartCount > 0 ? "bg-red-600 text-white" : "bg-gray-400 text-white"}
                  `}
                  aria-live="polite"
                >
                  {cartCount}
                </span>
              </NavLink>

              <NavLink className="text-xl transition" to="/profile" title="Profile">
                <FaUser />
              </NavLink>

              {role === "seller" && (
                <NavLink className="text-lg transition hover:text-blue-500" to="/manageBooks">
                  Manage Books
                </NavLink>
              )}
            </>
          )}
        </div>

        {/* Mobile Section */}
        <div className="md:hidden flex items-center gap-4 relative mobile-menu" ref={menuRef}>
          {/* When not logged in show Register/Login directly for mobile */}
          {!user && (
            <div className="flex gap-3 items-center">
              <NavLink className="text-sm px-3 py-2 rounded-md hover:bg-white/30 transition" to="/register">
                Register
              </NavLink>
              <NavLink className="text-sm px-3 py-2 rounded-md hover:bg-white/30 transition" to="/login">
                Login
              </NavLink>
            </div>
          )}

          {/* When logged in show 3-dot menu */}
          {user && (
            <>
              <button
                aria-haspopup="true"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="p-2 rounded-full bg-white/20 hover:scale-105 transition"
                title="Menu"
              >
                <FaEllipsisV />
              </button>

              {/* Popup Menu */}
              {open && (
                <div
                  className="
                    absolute right-0 top-12 w-35 rounded-xl
                    text-gray-700 bg-white shadow-lg
                    animate-slide-down
                  "
                >
                  <div className="flex flex-col gap-3 text-sm">
                    <NavLink onClick={() => setOpen(false)} to="/" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100">
                      <FaHome /> <span>Home</span>
                    </NavLink>

                    <NavLink onClick={() => setOpen(false)} to="/wishlist" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100">
                      <FaHeart /> <span>Wishlist</span>
                    </NavLink>

                    <NavLink onClick={() => setOpen(false)} to="/cart" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100">
                      <FaShoppingCart /> <span>Cart ({cartCount})</span>
                    </NavLink>

                    <NavLink onClick={() => setOpen(false)} to="/profile" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100">
                      <FaUser /> <span>Profile</span>
                    </NavLink>

                    {role === "seller" && (
                      <NavLink onClick={() => setOpen(false)} to="/manageBooks" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100">
                        <FaBook /> <span>Manage Books</span>
                      </NavLink>
                    )}

                 
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
