import { createContext, useState, useEffect } from "react";
import { getBookCart } from "../api/axios";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) loadCartCount();
  }, [token]);

  const loadCartCount = async () => {
    try {
      const res = await getBookCart();
      const items = res.data?.items || [];
      setCartCount(items.length);
    } catch (err) {
      console.log("Error loading cart count", err);
    }
  };

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, loadCartCount }}>
      {children}
    </CartContext.Provider>
  );
}
