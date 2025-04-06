// CartContext.jsx
import React, { createContext, useState } from 'react';

// Create the context
export const CartContext = createContext();

// Create a provider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Add a worker to the cart
  const addToCart = (worker) => {
    // If you want to avoid duplicates, check here before adding
    // For now, just push it in:
    setCartItems((prevItems) => [...prevItems, worker]);
  };

  // Remove a worker from the cart by id
  const removeFromCart = (workerId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== workerId));
  };

  // Clear all items from the cart
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
