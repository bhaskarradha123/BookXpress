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


  const handlePlaceOrder = (item) => {
   let user = localStorage.getItem('user');
    user = JSON.parse(user);
    console.log(user);
    
      const totalPrice= item.bookId.price * item.quantity;
   
     const options={
      key:"" ,
      amount:totalPrice*100,
      currency:"INR",
      name:"BookXpress",
      description:"Test Transaction",
      image:"https://example.com/your_logo",
      handler:function(response){
        alert("payment successfully done"+response.razorpay_payment_id);
      },
      prefill:{
        name:user.name, // userName
        email:user.email, // user email
        contact:'8106192071' // user contact
      },
      theme:{color:'#fbbf24'}

     }
     const rzp1=new window.Razorpay(options);
     rzp1.open();
     rzp1.on('payment.failed',function(response){
        alert("payment failed");
     });
  }


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

              <button className="place-order-btn" onClick={()=> handlePlaceOrder(item)}>
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
