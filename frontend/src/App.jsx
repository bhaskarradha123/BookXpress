import { Routes, Route } from "react-router-dom";
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

// Components
import Navbar from "./components/Navbar";
import AddBook from "./pages/AddBook";
import UpdateBook from "./pages/UpdateBook";
import SearchList from "./pages/SearchList";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />

        {/* Auth Pages - redirect if logged-in */}
        <Route
          path="/login"
          element={user ? <Home /> : <Login />}
        />

        <Route
          path="/register"
          element={user ? <Home /> : <Register />}
        />

        {/* Protected Routes */}
        <Route
          path="/profile"
          element={user ? <Profile /> : <Login />}
        />

        <Route
          path="/wishlist"
          element={user ? <Wishlist /> : <Login />}
        />

        <Route
          path="/cart"
          element={user ? <Cart /> : <Login />}
        />

        <Route
          path="/manageBooks"
          element={user ? <BookDetails /> : <Login />}
        />
        <Route
          path="/add-book"
          element={user ? <AddBook /> : <Login />}
        />
        <Route
          path="/update-book/:id"
          element={user ? <UpdateBook /> : <Login />}
        />

        <Route path="/search/:query" element={<SearchList />} />

      </Routes>
    </>
  );
}

export default App;
