import React from "react";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// ---------------- STARS COMPONENT ----------------
const Stars = ({ value }) => {
  const items = [];
  for (let i = 1; i <= 5; i++) {
    if (value >= i) items.push(<span key={i}>⭐</span>);
    else if (value >= i - 0.5) items.push(<span key={i}>✩</span>);
    else items.push(<span key={i}>☆</span>);
  }
  return <div className="flex gap-1 text-yellow-500 text-sm">{items}</div>;
};

// ---------------- BOOK CARD ----------------
const BookCard = ({ book, cartBooks, wishlistBooks, handleAddToCart, handleWishlist }) => (
  <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition group h-full flex flex-col">

    {/* IMAGE */}
    <div className="relative overflow-hidden rounded-lg">
      <img
        src={book.image}
        alt={book.title}
        className="w-full h-44 sm:h-52 object-cover rounded-lg group-hover:scale-105 transition duration-300"
      />

      <span className="absolute top-2 right-2 bg-white/80 text-xs px-2 py-1 rounded">
        {book.category}
      </span>
    </div>

    {/* CONTENT */}
    <div className="mt-3 flex flex-col flex-1">
      <h4 className="font-semibold text-sm sm:text-base line-clamp-1">
        {book.title}
      </h4>

      <p className="text-xs sm:text-sm text-gray-500 line-clamp-1">
        {book.author}
      </p>

      {/* RATING + PRICE */}
      <div className="flex justify-between items-center mt-3">
        <div className="flex items-center gap-2">
          <Stars value={book.rating || 4.5} />
          <span className="text-xs text-gray-500">({book.reviews || 120})</span>
        </div>

        <span className="text-indigo-600 font-bold text-sm sm:text-base">
          ₹ {book.price}
        </span>
      </div>

      {/* ACTION BUTTONS */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => handleAddToCart(book._id)}
          className={`flex-1 py-2 rounded-lg text-white text-sm ${
            cartBooks.includes(book._id)
              ? "bg-indigo-700"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          Add
        </button>

        <button
          onClick={() => handleWishlist(book._id)}
          className={`px-3 py-2 rounded-lg text-sm ${
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
);

// ---------------- CAROUSEL ----------------
const FeaturedCarousel = ({
  featuredBooks,
  cartBooks,
  wishlistBooks,
  handleAddToCart,
  handleWishlist,
}) => {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2400,
    speed: 600,
    arrows: false,

    slidesToShow: 4, // DESKTOP
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 1024, // TABLET
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768, // MOBILE
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  return (
    <section className="mb-12 w-full">
      <h3 className="text-2xl font-bold mb-6">Featured Picks</h3>

      <Slider {...settings}>
        {featuredBooks.map((book) => (
          <div key={book._id} className="px-2 sm:px-3 h-full">
            <BookCard
              book={book}
              cartBooks={cartBooks}
              wishlistBooks={wishlistBooks}
              handleAddToCart={handleAddToCart}
              handleWishlist={handleWishlist}
            />
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default FeaturedCarousel;
