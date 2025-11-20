import { useContext, useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState(null);
  const [user, setUser] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const { loadCartCount } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const fetchCart = async () => {
    try {
      const res = await API.get("/cart");
      setCart(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateQuantity = async (bookId, quantity) => {
    try {
      await API.put("/cart/update", { bookId, quantity });
      toast.success("Quantity updated");
      fetchCart();
    } catch (error) {
      console.log(error);
    }
  };

  const removeItem = async (bookId) => {
    try {
      await API.delete(`/cart/remove/${bookId}`);
      toast.error("Item removed from cart");
      fetchCart();
      loadCartCount();
    } catch (error) {
      console.log(error);
    }
  };

  const clearCart = async () => {
    try {
      await API.delete("/cart/clear");
      toast.error("Cart cleared");
      fetchCart();
      loadCartCount();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckout = (item) => {
    setSelectedItem(item);
    setShowCheckout(true);
  };

  const handlePlaceOrder = (item) => {
    if (!user) {
      toast.warn("Please login to place order");
      return;
    }

    if (!user.address || !user.address.street) {
      toast.error("Please update your address before payment");
      return;
    }

    const totalPrice = item.bookId.price * item.quantity;

    const options = {
      key: "rzp_live_RhucuzQQKT7p5u",
      amount: totalPrice * 100,
      currency: "INR",
      name: "BookXpress",
      description: "Payment for " + item.bookId.title,
      image: "https://example.com/your_logo",
      handler: function (response) {
        toast.success("Payment successful! ID: " + response.razorpay_payment_id);
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.phone,
      },
      theme: { color: "#2424fbff" },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
    rzp1.on("payment.failed", function () {
      toast.error("Payment failed");
    });
  };

  if (!cart)
    return (
      <p className="text-center text-lg font-medium mt-30">Loading...</p>
    );

  return (
    <div className="container mx-auto pt-24 pb-10 px-4">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Your Cart</h2>

        {cart.items.length > 0 && (
          <button
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow"
            onClick={clearCart}
          >
            Clear Cart
          </button>
        )}
      </div>

      {/* Checkout Modal */}
      {showCheckout && selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-11/12 max-w-md animate-scaleIn">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              Confirm Your Order
            </h2>

            <div className="flex gap-4 mb-4">
              <img
                src={selectedItem.bookId.image}
                alt={selectedItem.bookId.title}
                className="w-24 h-32 object-cover rounded-lg shadow"
              />
              <div>
                <h3 className="font-semibold text-lg">
                  {selectedItem.bookId.title}
                </h3>
                <p className="text-gray-700">
                  Price: ₹ {selectedItem.bookId.price}
                </p>
                <p className="text-gray-700">Qty: {selectedItem.quantity}</p>
                <p className="font-bold text-xl text-green-700">
                  Total: ₹ {selectedItem.bookId.price * selectedItem.quantity}
                </p>
              </div>
            </div>

            {/* Address Block */}
            <div className="bg-gray-100 p-4 rounded-lg shadow-inner mb-4">
              <h3 className="font-semibold mb-2 flex justify-between">
                Delivery Address
                <button
                  className="text-blue-600 underline"
                  onClick={() => navigate("/profile")}
                >
                  Update
                </button>
              </h3>

              {!user?.address?.street ? (
                <p className="text-red-500">
                  No address found. Please update your address.
                </p>
              ) : (
                <>
                  <p className="font-medium">{user.name}</p>
                  <p>{user.address.doorNo}, {user.address.street}</p>
                  <p>
                    {user.address.city}, {user.address.state} -{" "}
                    {user.address.pinCode}
                  </p>
                  <p>Phone: {user.phone}</p>
                </>
              )}
            </div>

            <div className="flex justify-between mt-6">
              <button
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
                onClick={() => setShowCheckout(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md"
                onClick={() => {
                  if (!user?.address?.street) return;
                  handlePlaceOrder(selectedItem);
                  setShowCheckout(false);
                }}
              >
                Confirm & Pay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Items */}
      {cart.items.length === 0 ? (
        <p className="text-lg">No items in cart</p>
      ) : (
        cart.items.map((item) => (
          <div className="flex justify-center w-full">
  <div
    key={item.bookId._id}
    className="
      flex items-center gap-4 bg-white border-gray-200 rounded-xl shadow-xl hover:shadow-lg 
      transition p-4 mb-4 animate-fadeIn 
      w-full sm:w-4/5 lg:w-3/4 max-w-3xl
    "
  >


              <img
                src={item.bookId.image}
                alt={item.bookId.title}
                className="w-24 h-32 object-cover rounded-lg shadow"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{item.bookId.title}</h3>
                <p className="text-gray-700">₹ {item.bookId.price}</p>

                <div className="flex items-center gap-2 mt-3">
                  <button
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                    onClick={() =>
                      updateQuantity(
                        item.bookId._id,
                        item.quantity > 1 ? item.quantity - 1 : 1
                      )
                    }
                  >
                    -
                  </button>
                  <span className="font-semibold">{item.quantity}</span>
                  <button
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                    onClick={() =>
                      updateQuantity(item.bookId._id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow"
                    onClick={() => removeItem(item.bookId._id)}
                  >
                    Remove
                  </button>
                  <button
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow"
                    onClick={() => handleCheckout(item)}
                  >
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}


    </div>
  );
}

export default Cart;
