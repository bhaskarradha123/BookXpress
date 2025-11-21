
import React, { useContext, useEffect, useState } from "react";
import {
  getAllBooks,
  addBookToCart,
  removeBookFromCart,
  addToWishlist,
  removeFromWishlist,
} from "../api/axios";
import { toast } from "react-toastify";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

// Carousel
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Small rating stars component
const Stars = ({ value = 4.5 }) => {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const items = [];
  for (let i = 0; i < full; i++) items.push("★");
  if (half) items.push("⯨");
  while (items.length < 5) items.push("☆");
  return <div className="text-yellow-400">{items.join(" ")}</div>;
};

const Home = () => {
  // Splash screen loader
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3200);
    return () => clearTimeout(timer);
  }, []);

  // === Main states ===
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartBooks, setCartBooks] = useState([]);
  const [wishlistBooks, setWishlistBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  const token = localStorage.getItem("token");
  const { loadCartCount } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const response = await getAllBooks();
      setBooks(response.data || []);
      setFilteredBooks(response.data || []);

      const cartIds = response.data.filter((b) => b.inCart).map((b) => b._id);
      const wishlistIds = response.data.filter((b) => b.inWishlist).map((b) => b._id);

      setCartBooks(cartIds);
      setWishlistBooks(wishlistIds);
    } catch (err) {
      toast.error("Failed to load books");
    }
  };

  const handleSearch = (e) => {
    const q = e.target.value;
    setSearchQuery(q);

    if (!q.trim()) {
      setFilteredBooks(books);
      return;
    }

    const lower = q.toLowerCase();

    setFilteredBooks(
      books.filter(
        (book) =>
          book.title.toLowerCase().includes(lower) ||
          book.author.toLowerCase().includes(lower) ||
          book.category.toLowerCase().includes(lower) ||
          book.description.toLowerCase().includes(lower)
      )
    );
  };

  const handleAddToCart = async (bookId) => {
    if (!token) {
      toast.warn("Please login to add books to cart");
      navigate("/login");
      return;
    }
    try {
      if (cartBooks.includes(bookId)) {
        await removeBookFromCart(bookId);
        setCartBooks(cartBooks.filter((id) => id !== bookId));
        toast.warning("Removed from cart");
      } else {
        await addBookToCart(bookId);
        setCartBooks([...cartBooks, bookId]);
        toast.success("Added to cart");
      }
      loadCartCount();
    } catch (err) {
      toast.error("Cart operation failed");
    }
  };

  const handleWishlist = async (bookId) => {
    if (!token) {
      toast.warn("Please login to add to wishlist");
      navigate("/login");
      return;
    }
    try {
      if (wishlistBooks.includes(bookId)) {
        await removeFromWishlist(bookId);
        setWishlistBooks(wishlistBooks.filter((id) => id !== bookId));
        toast.warning("Removed from wishlist");
      } else {
        await addToWishlist({ bookId });
        setWishlistBooks([...wishlistBooks, bookId]);
        toast.success("Added to wishlist");
      }
    } catch (err) {
      toast.error("Wishlist operation failed");
    }
  };

  // Featured & trending
  const featuredBooks = books.slice(0, 8);
  const trendingBooks = books.slice(0, 24);

  // Carousel Settings
  const carouselSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,       // Desktop
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,  // Tablet
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,    // Large mobile
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,    // Small mobile
        settings: {
          slidesToShow: 2,  // Still show 2 cards
        },
      },
    ],
  };


  const categories = [
    { key: "fiction", title: "Fiction", color: "from-pink-500 to-pink-300" },
    { key: "non-fiction", title: "Non-Fiction", color: "from-green-400 to-green-200" },
    { key: "romance", title: "Romance", color: "from-red-400 to-pink-200" },
    { key: "thriller", title: "Thriller", color: "from-indigo-500 to-purple-400" },
    { key: "self-help", title: "Self Help", color: "from-yellow-400 to-yellow-200" },
    { key: "comics", title: "Comics", color: "from-blue-400 to-cyan-300" },
  ];

  const testimonials = [
    {
      name: "Ayesha K.",
      text: "A curated collection and fast delivery — loved it!",
      rating: 5,
      avatar: "https://i.pravatar.cc/80?img=11",
    },
    {
      name: "Rahul S.",
      text: "Great UI, easy to browse — found books I couldn't elsewhere.",
      rating: 4.5,
      avatar: "https://i.pravatar.cc/80?img=12",
    },
    {
      name: "Meera P.",
      text: "Excellent customer service and beautiful packaging.",
      rating: 5,
      avatar: "https://i.pravatar.cc/80?img=13",
    },
  ];

  // ================================
  //        RETURN UI
  // ================================
  return (
    <>
      {/* -------- SPLASH SCREEN -------- */}
      {showSplash && (
        <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50 animate-fadeOut">
          <img
            src="/vite.svg"
            alt="BookXpress Logo"
            className="w-28 h-28 animate-pulse"
          />
          <p className="mt-4 text-lg font-semibold text-gray-700 animate-fadeInSlow">
            BookXpress
          </p>

          <style>{`
            @keyframes fadeOut {
              0% { opacity: 1; }
              80% { opacity: 1; }
              100% { opacity: 0; visibility: hidden; }
            }
            .animate-fadeOut {
              animation: fadeOut 2.2s ease forwards;
            }

            @keyframes fadeInSlow {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            .animate-fadeInSlow {
              animation: fadeInSlow 1.2s ease-in-out;
            }
          `}</style>
        </div>
      )}

      {/* -------- MAIN PAGE -------- */}
      {!showSplash && (
        <div className="w-full min-h-screen " >
          {/* HERO */}
          <section
            className="relative h-[420px] md:h-[520px] flex items-center"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 60%), url('https://images.unsplash.com/photo-1512820790803-83ca734da794')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="container mx-auto px-6 md:px-12 lg:px-20 flex items-center">
              <div className="w-full md:w-1/2 text-white space-y-6 animate-fadeIn">
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                  Discover Your Next <span className="text-indigo-300">Favorite Book</span>
                </h1>
                <p className="text-gray-200 max-w-xl">
                  Handpicked collections, new arrivals and bestsellers. Browse by category, read reviews, and get it delivered to your door.
                </p>

                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => window.scrollTo({ top: 800, behavior: "smooth" })}
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400 text-white font-semibold shadow-lg hover:scale-105 transition"
                  >
                    Explore Books
                  </button>

                  <button
                    onClick={() => window.scrollTo({ top: 1400, behavior: "smooth" })}
                    className="px-6 py-3 rounded-full border border-white/30 text-white font-semibold hover:bg-white/10 transition"
                  >
                    Shop Now
                  </button>
                </div>
              </div>

              {/* hero side visual: featured book stack */}
              <div className="hidden md:flex md:w-1/2 justify-end">
                <div className="relative w-64 h-80">
                  <div className="absolute -left-8 -top-6 w-56 h-72 bg-white/5 rounded-lg transform rotate-6 shadow-2xl" />
                  <img
                    src={featuredBooks[0]?.image || "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"}
                    alt="hero book"
                    className="relative w-56 h-72 object-cover rounded-lg shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="container mx-auto px-6 md:px-12 lg:px-20 -mt-20">
            {/* CATEGORIES */}
            <section className="mb-12">
              <h3 className="text-2xl font-bold mb-6">Browse by Category</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
                {categories.map((c) => (
                  <div
                    key={c.key}
                    className="group rounded-xl overflow-hidden cursor-pointer transform hover:scale-105 transition"
                  >
                    <div className={`p-6 rounded-xl bg-gradient-to-br ${c.color} text-white shadow-lg flex flex-col items-start justify-center h-36`}>
                      <div className="text-lg font-semibold">{c.title}</div>
                      <div className="mt-2 text-sm opacity-90">Explore {c.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Carousel */}

            <section className="mb-12 w-full">
              <h3 className="text-2xl font-bold mb-6">Featured Picks</h3>

              <div className="overflow-hidden">
                <Slider {...carouselSettings}>
                  {featuredBooks.map((book) => (
                    <div key={book._id} className="px-2 sm:px-3">
                      <div className="bg-white rounded-xl p-3 sm:p-4 shadow-lg hover:shadow-2xl transition transform group">

                        {/* IMAGE */}
                        <div className="relative overflow-hidden rounded-lg">
                          <img
                            src={book.image}
                            alt={book.title}
                            className="w-full h-40 sm:h-52 object-cover rounded-lg group-hover:scale-105 transition"
                          />

                          <div className="absolute top-2 right-2 bg-white/80 px-2 py-1 rounded text-[10px] sm:text-xs">
                            {book.category}
                          </div>
                        </div>

                        {/* TEXT */}
                        <div className="mt-3">
                          <h4 className="font-semibold text-sm sm:text-base line-clamp-1">
                            {book.title}
                          </h4>

                          <p classwayme="text-xs sm:text-sm text-gray-500 line-clamp-1">
                            {book.author}
                          </p>

                          {/* RATING + PRICE */}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-1 sm:gap-2">
                              <Stars value={book.rating || 4.5} />
                              <span className="text-[10px] sm:text-sm text-gray-500">
                                ({book.reviews || 120})
                              </span>
                            </div>

                            <div className="text-indigo-600 font-bold text-sm sm:text-base">
                              ₹ {book.price}
                            </div>
                          </div>

                          {/* BUTTONS */}
                          <div className="mt-4 flex gap-2">
                            <button
                              onClick={() => handleAddToCart(book._id)}
                              className={`flex-1 py-2 rounded-lg text-white text-sm sm:text-base ${cartBooks.includes(book._id)
                                ? "bg-indigo-700"
                                : "bg-indigo-600 hover:bg-indigo-700"
                                }`}
                            >
                              Add
                            </button>

                            <button
                              onClick={() => handleWishlist(book._id)}
                              className={`px-3 py-2 rounded-lg text-sm sm:text-base ${wishlistBooks.includes(book._id)
                                ? "bg-pink-500 text-white"
                                : "bg-gray-100"
                                }`}
                            >
                              ♡
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            </section>




            {/* OFFER BANNER */}
            <section className="mb-12">
              <div className="rounded-3xl p-8 bg-gradient-to-r from-purple-500 to-indigo-500 text-white flex items-center justify-between gap-6">
                <div>
                  <h3 className="text-3xl font-bold">50% OFF on Bestselling Novels</h3>
                  <p className="mt-2 text-white/90">Limited time offer — hurry up before stock runs out.</p>
                </div>
                <div>
                  <button className="px-6 py-3 bg-white text-indigo-600 rounded-full font-semibold shadow hover:scale-105 transition">Shop Offers</button>
                </div>
              </div>
            </section>

            {/* TRENDING GRID */}
            <section className="mb-12">
              <h3 className="text-2xl font-bold mb-6">Trending Now</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {trendingBooks.map((book) => (
                  <div key={book._id} className="bg-white rounded-xl shadow hover:shadow-2xl transition group">
                    <div className="relative overflow-hidden rounded-t-xl">
                      <img src={book.image} alt={book.title} className="w-full h-56 object-cover group-hover:scale-105 transition" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                      <button onClick={() => setSelectedBook(book)} className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-white text-black px-4 py-2 rounded-lg">Quick View</button>
                    </div>

                    <div className="p-4">
                      <h4 className="font-semibold">{book.title}</h4>
                      <p className="text-sm text-gray-500">{book.author}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-indigo-600 font-bold">₹ {book.price}</div>
                        <button onClick={() => handleAddToCart(book._id)} className={`px-3 py-2 rounded-lg text-white ${cartBooks.includes(book._id) ? "bg-indigo-700" : "bg-indigo-600 hover:bg-indigo-700"}`}>Add</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="mb-12">
              <h3 className="text-2xl font-bold mb-6">What Readers Say</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((t, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition">
                    <div className="flex items-center gap-4">
                      <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <div className="font-semibold">{t.name}</div>
                        <Stars value={t.rating} />
                      </div>
                    </div>
                    <p className="mt-4 text-gray-600">{t.text}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* FOOTER */}
            <footer className="mt-12 border-t pt-8 pb-12 text-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <h4 className="font-bold mb-3">BookStore</h4>
                  <p className="text-sm text-gray-600">Discover, read and buy from thousands of books across categories.</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Customer Service</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>Help Center</li>
                    <li>Returns</li>
                    <li>Shipping</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Quick Links</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>Best Sellers</li>
                    <li>New Releases</li>
                    <li>Gift Cards</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Contact</h4>
                  <p className="text-sm text-gray-600">support@bookstore.com</p>
                  <div className="flex gap-3 mt-3">
                    <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">f</div>
                    <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">t</div>
                    <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">in</div>
                  </div>
                </div>
              </div>
            </footer>
          </div>

          {/* QUICK VIEW MODAL */}
          {selectedBook && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
              <div className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-4xl relative animate-slideUp">
                <button className="absolute top-4 right-4 text-gray-600 text-xl" onClick={() => setSelectedBook(null)}>✕</button>

                <div className="flex flex-col md:flex-row gap-6">
                  <img src={selectedBook.image} alt={selectedBook.title} className="w-full md:w-48 h-64 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">{selectedBook.title}</h2>
                    <p className="text-gray-600">{selectedBook.author}</p>
                    <p className="text-indigo-600 font-bold mt-3">₹ {selectedBook.price}</p>

                    <div className="mt-4 text-gray-700 leading-relaxed">{selectedBook.description}</div>

                    <div className="mt-6 flex gap-3">
                      <button onClick={() => handleWishlist(selectedBook._id)} className={`px-5 py-2 rounded-xl ${wishlistBooks.includes(selectedBook._id) ? "bg-pink-500 text-white" : "bg-gray-100"}`}>{wishlistBooks.includes(selectedBook._id) ? "Remove Wishlist" : "Add Wishlist"}</button>
                      <button onClick={() => handleAddToCart(selectedBook._id)} className="px-5 py-2 rounded-xl bg-indigo-600 text-white">Add to Cart</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Small animations */}
          <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 800ms ease both; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slideUp { animation: slideUp 420ms ease both; }
      `}</style>
        </div>
      )}
    </>
  );
};

export default Home;

