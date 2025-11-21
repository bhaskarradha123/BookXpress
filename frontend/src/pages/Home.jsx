import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import { Stars } from "../components/Stars";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();

  // STATES
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [newBooks, setNewBooks] = useState([]);
  const [topSelling, setTopSelling] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cartBooks, setCartBooks] = useState([]);
  const [wishlistBooks, setWishlistBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all homepage data
  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/books/home");
      setFeaturedBooks(res.data.featured);
      setNewBooks(res.data.latest);
      setTopSelling(res.data.topSelling);
      setCategories(res.data.categories);
      setCartBooks(res.data.cartIds || []);
      setWishlistBooks(res.data.wishlistIds || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  // Add to cart
  const handleAddToCart = async (bookId) => {
    try {
      await axios.post("/api/cart/add", { bookId });
      setCartBooks((prev) => [...prev, bookId]);
      toast.success("Added to cart");
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  // Toggle wishlist
  const handleWishlist = async (bookId) => {
    try {
      await axios.post("/api/wishlist/toggle", { bookId });

      setWishlistBooks((prev) =>
        prev.includes(bookId)
          ? prev.filter((id) => id !== bookId)
          : [...prev, bookId]
      );
    } catch (err) {
      toast.error("Failed to update wishlist");
    }
  };

  // Carousel settings
  const carouselSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 2500,
    cssEase: "ease-in-out",
    slidesToShow: 4,
    slidesToScroll: 1,
    swipeToSlide: true,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  // Category card component
  const CategoryCard = ({ cat }) => (
    <div
      className="flex flex-col items-center p-4 rounded-xl bg-white shadow hover:shadow-xl transition cursor-pointer"
      onClick={() => navigate(`/category/${cat.name}`)}
    >
      <img src={cat.image} alt={cat.name} className="w-20 h-20" />
      <h4 className="font-semibold mt-2">{cat.name}</h4>
      <p className="text-gray-500 text-sm">{cat.count} Books</p>
    </div>
  );

  // Book card component
  const BookCard = ({ book }) => (
    <div className="px-3">
      <div className="bg-white rounded-xl p-4 shadow-lg hover:shadow-2xl transition group">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={book.image}
            alt={book.title}
            className="w-full h-52 object-cover group-hover:scale-105 transition"
          />
          <span className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded text-xs">
            {book.category}
          </span>
        </div>

        <div className="mt-3">
          <h4 className="font-semibold">{book.title}</h4>
          <p className="text-sm text-gray-500">{book.author}</p>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <Stars value={book.rating || 4.5} />
              <span className="text-sm text-gray-500">
                ({book.reviews || 120})
              </span>
            </div>
            <div className="text-indigo-600 font-bold">₹ {book.price}</div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => handleAddToCart(book._id)}
              className={`flex-1 py-2 rounded-lg text-white ${
                cartBooks.includes(book._id)
                  ? "bg-indigo-700"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              Add
            </button>

            <button
              onClick={() => handleWishlist(book._id)}
              className={`px-3 py-2 rounded-lg ${
                wishlistBooks.includes(book._id)
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
  );

  if (loading)
    return (
      <div className="text-center py-20 text-xl font-semibold">
        Loading books...
      </div>
    );

  return (
    <div className="px-4 lg:px-12 py-10">

      {/* ====== CATEGORY SECTION ====== */}
      <section className="mb-16">
        <h3 className="text-2xl font-bold mb-6">Browse by Category</h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-5">
          {categories.map((cat) => (
            <CategoryCard key={cat._id} cat={cat} />
          ))}
        </div>
      </section>

      {/* ====== FEATURED BOOKS ====== */}
      <section className="mb-16">
        <h3 className="text-2xl font-bold mb-6">Featured Picks</h3>
        <Slider {...carouselSettings}>
          {featuredBooks.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </Slider>
      </section>

      {/* ====== NEW ARRIVALS ====== */}
      <section className="mb-16">
        <h3 className="text-2xl font-bold mb-6">New Arrivals</h3>
        <Slider {...carouselSettings}>
          {newBooks.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </Slider>
      </section>

      {/* ====== TOP SELLING ====== */}
      <section>
        <h3 className="text-2xl font-bold mb-6">Top Selling Books</h3>
        <Slider {...carouselSettings}>
          {topSelling.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </Slider>
      </section>
    </div>
  );
};

export default Home;
