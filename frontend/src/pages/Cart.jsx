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

  // Open checkout modal for single item
  const handleCheckout = (item) => {
    setSelectedItem(item);
    setShowCheckout(true);
  };

  // Razorpay single-item payment
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
      key: "rzp_live_Rg3lnhOnx2uW4p",
      amount: totalPrice * 100,
      currency: "INR",
      name: "BookXpress",
      description: "Payment for " + item.bookId.title,
      image: "https://example.com/your_logo",
      handler: function (response) {
        toast.success("Payment successful! ID: " + response.razorpay_payment_id);
        console.log(response);
        // Optionally: call API to mark order as paid
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.phone
      },
      theme: { color: "#2424fbff" }
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
    rzp1.on("payment.failed", function (response) {
      toast.error("Payment failed");
      console.log(response);
    });
  };

  if (!cart)
    return <p style={{ textAlign: "center", marginTop: "20px" }}>Loading...</p>;

  return (
    <div className="cart-container p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>

      {/* Checkout Modal */}
      {showCheckout && selectedItem && (
        <div className="checkout-modal fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="checkout-content bg-white p-6 rounded-lg w-11/12 max-w-md">
            <h2 className="text-xl font-semibold mb-4">Confirm Your Order</h2>

            {/* Book Details */}
            <div className="item-details flex gap-4 mb-4">
              <img
                src={selectedItem.bookId.image}
                alt={selectedItem.bookId.title}
                className="w-24 h-32 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold">{selectedItem.bookId.title}</h3>
                <p>Price: ₹ {selectedItem.bookId.price}</p>
                <p>Quantity: {selectedItem.quantity}</p>
                <p className="font-bold">
                  Total: ₹ {selectedItem.bookId.price * selectedItem.quantity}
                </p>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="delivery-address mb-4">
              <h3 className="font-semibold mb-2">Delivery Address 
                  <button onClick={
                    ()=>{
                      navigate("/profile")
                    }
                  } >
              Update Address
              </button>
              </h3>
              {!user?.address?.street ? (
                <p className="text-red-500">
                  Address not found. Please update your address in profile.
                </p>
              ) : (
                <>
                  <p>UserName: {user.name}</p>
                  <p>Address :{user.address.doorNo}, {user.address.street}</p>
                  <p>
                    {user.address.city}, {user.address.state} - {user.address.pinCode}
                  </p>
                  <p>Phone :{user.phone}</p>
                </>
              )}
              {!user?.address?.street && (
                <button
                  className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded"
                  onClick={() => {
                    setShowCheckout(false);
                    navigate("/profile");
                  }}
                >
                  Update Address
                </button>
              )}
            </div>
          

            {/* Actions */}
            <div className="checkout-actions flex justify-between">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowCheckout(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
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
        <p>No items in cart</p>
      ) : (
        cart.items.map((item) => (
          <div
            className="cart-item flex items-center gap-4 border-b py-4"
            key={item.bookId._id}
          >
            <img
              src={item.bookId.image}
              alt={item.bookId.title}
              className="w-24 h-32 object-cover rounded"
            />
            <div className="cart-info flex-1">
              <h3 className="font-semibold">{item.bookId.title}</h3>
              <p>₹ {item.bookId.price}</p>

              <div className="quantity-box flex items-center gap-2 my-2">
                <button
                  className="px-2 py-1 bg-gray-200 rounded"
                  onClick={() =>
                    updateQuantity(
                      item.bookId._id,
                      item.quantity > 1 ? item.quantity - 1 : 1
                    )
                  }
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  className="px-2 py-1 bg-gray-200 rounded"
                  onClick={() => updateQuantity(item.bookId._id, item.quantity + 1)}
                >
                  +
                </button>
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  className="remove-btn px-3 py-1 bg-red-500 text-white rounded"
                  onClick={() => removeItem(item.bookId._id)}
                >
                  Remove
                </button>
                <button
                  className="place-order-btn px-3 py-1 bg-green-500 text-white rounded"
                  onClick={() => handleCheckout(item)}
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Clear Cart */}
      {cart.items.length > 0 && (
        <button
          className="clear-btn mt-4 px-4 py-2 bg-red-600 text-white rounded"
          onClick={clearCart}
        >
          Clear Cart
        </button>
      )}
    </div>
  );
}

export default Cart;
