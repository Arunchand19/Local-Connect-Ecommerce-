// CartContext.jsx
import React, { createContext, useState } from 'react';

// Create the context
export const CartContext = createContext();

// Create a provider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

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

  // Add an event ticket to the cart
  const addTicketToCart = (ticket) => {
    try {
      // Check if ticket already exists in cart
      const existingTicketIndex = cartItems.findIndex(item => 
        item._id === ticket._id && item.itemType === 'ticket');
      
      if (existingTicketIndex >= 0) {
        // Check if we can add more of this ticket
        const currentQuantity = cartItems[existingTicketIndex].quantity;
        const availableTickets = ticket.availableTickets;
        
        if (currentQuantity >= availableTickets) {
          showNotification('Maximum available tickets reached', 'error');
          return false;
        }
        
        // If ticket exists and we can add more, update the quantity
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingTicketIndex].quantity += 1;
        setCartItems(updatedCartItems);
      } else {
        // Format the ticket data
        const ticketPrice = parseFloat(ticket.ticketPrice);
        const fees = ticket.additionalFees ? parseFloat(ticket.additionalFees) : 0;
        
        const formattedTicket = {
          ...ticket,
          itemType: 'ticket',
          price: ticketPrice,
          fees: fees,
          quantity: 1,
          type: 'Event Ticket',
          availableTickets: ticket.availableTickets // Store available tickets count
        };
        
        // Add to cart
        setCartItems((prevItems) => [...prevItems, formattedTicket]);
      }
      
      // Show success notification
      showNotification('Ticket added successfully to Cart', 'success');
      return true;
    } catch (error) {
      // Show error notification
      showNotification('Failed to add the ticket', 'error');
      console.error("Error adding ticket to cart:", error);
      return false;
    }
  };

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Remove an item from the cart by id
  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
  };

  // Update cart item quantity
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => {
        if (item._id === itemId) {
          // Check if it's a ticket and if we're not exceeding available tickets
          if (item.itemType === 'ticket' && newQuantity > item.availableTickets) {
            showNotification('Maximum available tickets reached', 'error');
            return item;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
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
        addTicketToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        notification
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
