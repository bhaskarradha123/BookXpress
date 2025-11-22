import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import BookDetails from "./pages/BookDetails";
import AddBook from "./pages/AddBook";
import UpdateBook from "./pages/UpdateBook";

// Components
import Navbar from "./components/Navbar";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />

        {/* Auth Pages (redirect if logged in) */}
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <Login />}
        />

        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <Register />}
        />

        {/* Protected Pages */}
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/login" />}
        />

        <Route
          path="/wishlist"
          element={user ? <Wishlist /> : <Navigate to="/login" />}
        />

        <Route
          path="/cart"
          element={user ? <Cart /> : <Navigate to="/login" />}
        />

        <Route
          path="/manageBooks"
          element={user ? <BookDetails /> : <Navigate to="/login" />}
        />

        <Route
          path="/add-book"
          element={user ? <AddBook /> : <Navigate to="/login" />}
        />

        <Route
          path="/update-book/:id"
          element={user ? <UpdateBook /> : <Navigate to="/login" />}
        />

        {/* 🚨 Catch-All Route → Redirect to Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
