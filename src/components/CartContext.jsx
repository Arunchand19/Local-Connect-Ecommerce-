// CartContext.jsx
import React, { createContext, useState } from 'react';

// Create the context
export const CartContext = createContext();

// Create a provider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Add a worker to the cart
  const addToCart = (worker) => {
    // Check if worker already exists in cart
    const existingWorkerIndex = cartItems.findIndex(item => item._id === worker._id);
    
    if (existingWorkerIndex >= 0) {
      // If worker exists, just update the quantity
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingWorkerIndex].quantity += 1;
      setCartItems(updatedCartItems);
    } else {
      // Get the worker's price, handling "Not specified" as 0
      let workerPrice = 0;
      if (worker.costPerHour !== undefined && 
          worker.costPerHour !== null && 
          worker.costPerHour !== "" && 
          worker.costPerHour !== "Not specified") {
        workerPrice = parseFloat(worker.costPerHour);
      }
      
      // Format the worker data to ensure all needed fields are available
      const formattedWorker = {
        ...worker,
        price: workerPrice,
        quantity: 1,
        type: worker.workerTypes 
          ? Object.keys(worker.workerTypes)
              .filter(key => worker.workerTypes[key])
              .join(', ')
          : 'Service Provider'
      };
      
      // Add to cart
      setCartItems((prevItems) => [...prevItems, formattedWorker]);
    }
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
