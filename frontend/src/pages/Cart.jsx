import { useContext, useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";
import { CartContext } from "../context/CartContext";

function Cart() {
  const [cart, setCart] = useState(null);
const { loadCartCount } = useContext(CartContext);
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

  if (!cart)
    return <p style={{ textAlign: "center", marginTop: "20px" }}>Loading...</p>;

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>

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
