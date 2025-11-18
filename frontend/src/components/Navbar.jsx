// src/components/Navbar.jsx
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

import {
  FaHeart,
  FaShoppingCart,
  FaUser,
  FaMoon,
  FaSun,
  FaEllipsisV,
  FaHome,
} from "react-icons/fa";

export default function Navbar() {
  const { cartCount } = useContext(CartContext || {});
  const { user } = useContext(AuthContext || {});

  // const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [open, setOpen] = useState(false);

  const role = JSON.parse(localStorage.getItem("role"));

  // useEffect(() => {
  //   document.documentElement.classList.toggle("dark", theme === "dark");
  //   localStorage.setItem("theme", theme);
  // }, [theme]);

  // Close menu on outside click
  useEffect(() => {
    function closeMenu(e) {
      if (!e.target.closest(".mobile-menu")) setOpen(false);
    }
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);



  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <nav
        className="
          w-full flex items-center justify-between
          px-6 py-3
          backdrop-blur-md bg-white/10 dark:bg-black/20
          shadow-[0_0_20px_rgba(0,0,0,0.5)]
        "
      >
        {/* Brand */}
        <Link
          to="/"
          className="
            text-2xl md:text-3xl font-extrabold tracking-tight 
            bg-gradient-to-r from-blue-500 to-blue-500
            bg-clip-text text-transparent 
            animate-pulse hover:scale-110 transition duration-300
          "
        >
          BookXpress
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 ml-auto text-lg font-medium">
          {!user && (
            <>
              <NavLink className="hover:text-blue-400 transition" to="/register">
                Register
              </NavLink>
              <NavLink className="hover:text-blue-400 transition" to="/login">
                Login
              </NavLink>
            </>
          )}

          {user && (
            <>
              <NavLink className="hover:text-red-500 text-xl transition" to="/wishlist">
                <FaHeart />
              </NavLink>

              <NavLink className="relative text-xl transition" to="/cart">
                <FaShoppingCart />
                <span
                  className={`
                    absolute -top-2 -right-2 text-xs px-2 rounded-full font-bold
                    ${cartCount > 0 ? "bg-red-600 text-white" : "bg-gray-400 text-white"}
                  `}
                >
                  {cartCount || 0}
                </span>
              </NavLink>

              <NavLink className="text-xl transition" to="/profile">
                <FaUser />
              </NavLink>

              {role === "seller" && (
                <NavLink className="text-xl transition" to="/manageBooks">
                  Manage Books
                </NavLink>
              )}

              {/* Theme Toggle */}
              {/* <button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="p-2 rounded-full bg-white/20 hover:scale-110 transition"
              >
                {theme === "light" ? <FaMoon /> : <FaSun />}
              </button> */}


            </>
          )}
        </div>

        {/* Mobile: Theme + 3 Dot Menu */}
        <div className="md:hidden flex items-center gap-4 relative mobile-menu group">
          {/* Theme Toggle */}
          {/* <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 rounded-full bg-white/20 hover:scale-110 transition"
          >
            {theme === "light" ? <FaMoon /> : <FaSun />}
          </button> */}

          {/* Menu Icon */}
          {user && (
            <button
              onClick={() => setOpen(!open)}
              className="text-l p-2 rounded-full bg-white/20 hover:scale-110 transition"
            >
              <FaEllipsisV />
            </button>
          )}

          {/* Popup Menu */}
          {open && (
            <div
              className="
                      absolute right-0 top-15  
                      w-20
                    
                      animate-slide-down transition-all
                    "
            >
              <div className="flex flex-col gap-4 text-sm">
                <NavLink onClick={() => setOpen(false)} to="/" className="flex gap-2">
                  <FaHome /> Home
                </NavLink>


                <NavLink onClick={() => setOpen(false)} to="/wishlist" className="flex gap-2">
                  <FaHeart /> Wishlist
                </NavLink>

                <NavLink onClick={() => setOpen(false)} to="/cart" className="flex gap-2">
                  <FaShoppingCart /> Cart ({cartCount || 0})
                </NavLink>

                <NavLink onClick={() => setOpen(false)} to="/profile" className="flex gap-2">
                  <FaUser /> Profile
                </NavLink>

                {role === "seller" && (
                  <NavLink onClick={() => setOpen(false)} to="/manageBooks">
                    Manage Books
                  </NavLink>
                )}



              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
