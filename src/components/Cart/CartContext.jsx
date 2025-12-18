/* eslint-disable react-refresh/only-export-components */
// src/components/Cart/CartContext.jsx
import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const raw = localStorage.getItem("cart_items_v1");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Persist cart to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem("cart_items_v1", JSON.stringify(cartItems));
    } catch {
      // ignore write failures
    }
  }, [cartItems]);

  const addToCart = (product) => setCartItems((prev) => [...prev, product]);
  const removeFromCart = (id) =>
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.length;

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, cartCount }}
    >
      {children}
    </CartContext.Provider>
  );
};
