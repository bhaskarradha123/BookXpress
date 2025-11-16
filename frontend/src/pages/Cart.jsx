import { useContext, useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
function Cart() {
  const [cart, setCart] = useState(null);
  const { loadCartCount } = useContext(CartContext);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
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
    let user = localStorage.getItem("user");
    if (!user) {
      toast.warn("Please login to place order");
      return;
    } user = JSON.parse(user);

    console.log(user);
    const totalPrice = item.bookId.price * item.quantity;
    const options = {
      key: "rzp_live_Rg3lnhOnx2uW4p",
      amount: totalPrice * 100,
      currency: "INR",
      name: "BookXpress",
      description: "Payment for " + item.bookId.title,
      image: "https://example.com/your_logo",
      handler: function (response) {
        alert("payment successfully done" + response.razorpay_payment_id);
        console.log(response);

      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.phone
      },
      theme: { color: '#2424fbff' }

    }
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
    rzp1.on('payment.failed', function (response) {
      alert("payment failed");
    });
  }


  if (!cart)
    return <p style={{ textAlign: "center", marginTop: "20px" }}>Loading...</p>;

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>


      {showCheckout && selectedItem && (
        <div className="checkout-modal">
          <div className="checkout-content">
            <h2>Confirm Your Order</h2>

            {/* Book Details */}
            <div className="item-details flex gap-4">
              <img
                src={selectedItem.bookId.image}
                alt={selectedItem.bookId.title}
                className="w-24 h-32 object-cover rounded"
              />
              <div>
                <h3>{selectedItem.bookId.title}</h3>
                <p>Price: ₹ {selectedItem.bookId.price}</p>
                <p>Quantity: {selectedItem.quantity}</p>
                <p>Total: ₹ {selectedItem.bookId.price * selectedItem.quantity}</p>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="delivery-address mt-4">
              <h3>Delivery Address</h3>
              {(() => {
                const user = JSON.parse(localStorage.getItem("user"));

                if (!user.address || !user.address.doorNo) {
                  return (
                    <p style={{ color: "red" }}>
                      Address not found. Please update your address in profile.
                    </p>
                    
                  );
                }
                return (
                  <>
                    <p>{user.name}</p>
                    <p>{user.address.doorNo}, {user.address.street}</p>
                    <p>{user.address.city}, {user.address.state} - {user.address.pincode}</p>
                    <p>{user.phone}</p>
                  </>
                );
                
              })()}
            </div>
             <button
                      className="px-4 py-2 bg-yellow-500 text-white rounded"
                      onClick={() => {
                        setShowCheckout(false);
                        navigate("/profile"); // if you are using react-router
                      }}
                    >
                      Update Address
                    </button>

            {/* Actions */}
            <div className="checkout-actions mt-4 flex justify-between">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowCheckout(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={() => {
                  const user = JSON.parse(localStorage.getItem("user"));
                  if (!user.address || !user.address.doorNo) {
                    toast.error("Please update your address before payment");
                   
                    return;
                  }
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



      {cart.items.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        cart.items.map((item) => (
          <div className="cart-item" key={item.bookId._id}>
            <img src={item.bookId.image} alt="" className="cart-img" />

            <div className="cart-info">
              <h3>{item.bookId.title}</h3>
              <p>₹ {item.bookId.price}</p>

              <div className="quantity-box">
                <button
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
                  onClick={() =>
                    updateQuantity(item.bookId._id, item.quantity + 1)
                  }
                >
                  +
                </button>
              </div>

              <button
                className="remove-btn"
                onClick={() => removeItem(item.bookId._id)}
              >
                Remove
              </button>

              <button className="place-order-btn" onClick={() => handleCheckout(item)}>
                Place Order
              </button>
            </div>
          </div>
        ))
      )}

      {cart.items.length > 0 && (
        <button className="clear-btn" onClick={clearCart}>
          Clear Cart
        </button>
      )}
    </div>
  );
}

export default Cart;
