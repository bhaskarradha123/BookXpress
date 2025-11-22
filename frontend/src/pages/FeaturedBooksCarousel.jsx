import React from "react";
import Slider from "react-slick";
import Stars from "./Stars"; // your stars component

const FeaturedBooksCarousel = ({
  featuredBooks,
  cartBooks,
  wishlistBooks,
  handleAddToCart,
  handleWishlist,
}) => {
  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 2500,
    slidesToShow: 4,
    slidesToScroll: 1,
    swipeToSlide: true,

    responsive: [
      {
        breakpoint: 1024, // laptop
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768, // tablet
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480, // mobile
        settings: { slidesToShow: 2 },
      },
    ],
  };

  return (
    <section className="mb-12 w-full">
      <h3 className="text-2xl font-bold mb-6">Featured Picks</h3>

      <Slider {...settings}>
        {featuredBooks.map((book) => (
          <div key={book._id} className="px-2">
            <div className="bg-white rounded-xl p-4 shadow-lg hover:shadow-2xl transition transform group">
              {/* Book Image */}
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-52 object-cover rounded-lg group-hover:scale-105 transition"
                />

                <div className="absolute top-3 right-3 bg-white/80 px-2 py-1 rounded text-xs">
                  {book.category}
                </div>
              </div>

              {/* Book Details */}
              <div className="mt-3">
                <h4 className="font-semibold truncate">{book.title}</h4>
                <p className="text-sm text-gray-500 truncate">{book.author}</p>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <Stars value={book.rating || 4.5} />
                    <span className="text-sm text-gray-500">
                      ({book.reviews || 120})
                    </span>
                  </div>
                  <div className="text-indigo-600 font-bold">
                    ₹ {book.price}
                  </div>
                </div>

                {/* Buttons */}
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
        ))}
      </Slider>
    </section>
  );
};

export default FeaturedBooksCarousel;
