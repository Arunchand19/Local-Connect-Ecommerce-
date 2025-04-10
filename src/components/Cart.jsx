// Cart.jsx
import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from './CartContext';
//import OrderPageSection from './OrderPageSection';
import './Cart.css';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { FaShoppingCart, FaTrashAlt, FaMapMarkerAlt } from 'react-icons/fa';

// Your Stripe publishable key
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51RBkJNPPVB7AxTVkj61Y1mqxRDes8mukjMTfKkqQRad7ycBldQQRe7QT7FmnOzDdmG0OsaFwTMpK2tbbHal5m3vP00VbSmzNhM';

// Initialize Stripe promise
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [showTimeSlots, setShowTimeSlots] = useState(true);
  const [mapUrl, setMapUrl] = useState('');
  const [subtotal, setSubtotal] = useState(0);
  const [deliveryFee] = useState(35);
  const [platformFee] = useState(10);
  const [taxRate] = useState(0.13); // 13% tax
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [staticMapUrl, setStaticMapUrl] = useState('');

  // Calculate total whenever cart changes
  useEffect(() => {
    const calculatedSubtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    setSubtotal(calculatedSubtotal);
  }, [cartItems]);

  const tax = (subtotal - discount + deliveryFee + platformFee) * taxRate;
  const total = subtotal - discount + deliveryFee + platformFee + tax;

  const timeSlots = [
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '12:00 PM - 1:00 PM',
    '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM',
    '5:00 PM - 6:00 PM'
  ];

  const handleGetLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Set interactive map URL
          setMapUrl(`https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.01}%2C${latitude-0.01}%2C${longitude+0.01}%2C${latitude+0.01}&layer=mapnik&marker=${latitude}%2C${longitude}`);
          
          // Set static map URL (Google Maps) with enhanced markers and zoom
          setStaticMapUrl(`https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=16&size=800x400&scale=2&maptype=roadmap&markers=color:red%7Csize:mid%7Clabel:Y%7C${latitude},${longitude}&key=AIzaSyBVvrihS0LY0_AQd3ky5JsGaUsHzc-xVfo`);
          
          fetchAddressFromCoordinates(latitude, longitude);
          setIsLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Could not get your location. Please enter it manually.');
          setIsLoading(false);
        },
        { 
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
      setIsLoading(false);
    }
  };

  const fetchAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      if (data && data.display_name) {
        setLocation(data.display_name);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  // Handle multiple time slot selection
  const handleTimeSlotSelection = (slot) => {
    setSelectedTimeSlots(prev => {
      // If already selected, remove it
      if (prev.includes(slot)) {
        return prev.filter(s => s !== slot);
      } 
      // Otherwise add it
      return [...prev, slot];
    });
  };

  // Stripe payment processing
  const handlePayment = async () => {
    if (selectedTimeSlots.length === 0 || !date || !location) {
      alert('Please fill all booking details before proceeding to payment.');
      return;
    }
    
    if (cartItems.length === 0) {
      alert('Your cart is empty. Add some items before proceeding to payment.');
      return;
    }
    
    try {
      setIsProcessingPayment(true);
      
      // Create a formatted array of line items for Stripe
      const lineItems = cartItems.map(item => ({
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.fullName || item.name || 'Service',
            description: item.type || 'Service',
          },
          unit_amount: Math.round((item.price || 0) * 100), // Stripe expects amount in smallest currency unit (paise)
        },
        quantity: item.quantity || 1,
      }));
      
      // Add additional fees as line items
      if (deliveryFee > 0) {
        lineItems.push({
          price_data: {
            currency: 'inr',
            product_data: {
              name: 'Delivery Fee',
            },
            unit_amount: Math.round(deliveryFee * 100),
          },
          quantity: 1,
        });
      }
      
      if (platformFee > 0) {
        lineItems.push({
          price_data: {
            currency: 'inr',
            product_data: {
              name: 'Platform Fee',
            },
            unit_amount: Math.round(platformFee * 100),
          },
          quantity: 1,
        });
      }
      
      // Add tax as a line item
      if (tax > 0) {
        lineItems.push({
          price_data: {
            currency: 'inr',
            product_data: {
              name: 'GST & Charges',
            },
            unit_amount: Math.round(tax * 100),
          },
          quantity: 1,
        });
      }
      
      // Prepare metadata with order details
      const metadata = {
        delivery_address: location,
        delivery_date: date,
        time_slots: selectedTimeSlots.join(', '),
        promo_code: promoCode || 'None'
      };
      
      console.log('Sending payment request with line items:', lineItems);
      
      // Call backend server to create a Stripe checkout session
      console.log('Attempting to connect to payment server...');
      
      const serverUrl = 'http://localhost:5000/api/create-checkout-session';
      console.log('Sending request to:', serverUrl);
      
      // First ping the server to check if it's responsive
      try {
        await axios.get('http://localhost:5000/', { timeout: 5000 });
        console.log('Payment server is responsive');
      } catch (pingError) {
        console.warn('Could not ping payment server:', pingError);
        // Continue anyway as the POST request might still work
      }
      
      const response = await axios.post(serverUrl, {
        line_items: lineItems,
        metadata: metadata,
        success_url: `${window.location.origin}/payment-success`,
        cancel_url: `${window.location.origin}/cart`
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 15000, // 15 second timeout
        withCredentials: true
      });
      
      console.log('Checkout session created:', response.data);
      
      if (!response.data || !response.data.id) {
        throw new Error('Invalid response from payment server');
      }
      
      // Redirect to Stripe checkout
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: response.data.id
      });
      
      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Payment error:', error);
      
      // Enhanced error handling with more specific messages
      let errorMessage = 'An error occurred during payment processing. Please try again.';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // outside the range of 2xx
        console.error('Error response status:', error.response.status);
        console.error('Error response data:', error.response.data);
        errorMessage = error.response.data?.error || `Server returned error ${error.response.status}`;
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        
        // Check if server is running on port 5000
        errorMessage = 'No response from payment server. Please make sure the server is running (npm run server).';
        
        // Attempt to show a more helpful message
        if (error.code === 'ECONNABORTED') {
          errorMessage = 'Payment server connection timed out. Please try again or check server status.';
        } else if (error.code === 'ECONNREFUSED') {
          errorMessage = 'Could not connect to payment server. Please start the server with "npm run server".';
        }
      } else {
        // Something happened in setting up the request
        console.error('Error message:', error.message);
        errorMessage = error.message || errorMessage;
      }
      
      alert(errorMessage);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleApplyPromoCode = () => {
    if (!promoCode) {
      alert('Please enter a promo code.');
      return;
    }
    
    // Retrieve offers from localStorage or mock some offers
    const offers = [
      { code: 'FIRST10', discountPercentage: 10 },
      { code: 'WELCOME20', discountPercentage: 20 },
      { code: 'super', discountPercentage: 10 }
    ];
    
    // Find matching offer
    const matchingOffer = offers.find(offer => offer.code.toLowerCase() === promoCode.toLowerCase());
    
    if (matchingOffer) {
      // Calculate discount amount
      const discountAmount = (subtotal * matchingOffer.discountPercentage) / 100;
      setDiscount(discountAmount);
      alert(`Promo code "${promoCode}" applied! You saved ₹${discountAmount.toFixed(2)}`);
    } else {
      setDiscount(0);
      alert('Invalid promo code. Please try again.');
    }
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Your Cart</h1>
        {cartItems.length > 0 && (
          <button className="clear-cart-btn" onClick={clearCart}>
            Clear Cart
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
        </div>
      ) : (
        <div className="cart-content">
          <div className="left-column">
            {/* Location Section */}
            <div className="location-section-container">
              <h2><FaMapMarkerAlt className="section-icon" /> Location</h2>
              <div className="map-container">
                {staticMapUrl ? (
                  <div className="map-with-overlay">
                    <img 
                      src={staticMapUrl} 
                      alt="Your Location Map"
                      className="location-map" 
                    />
                    <div className="map-location-marker">
                      <FaMapMarkerAlt className="map-marker-icon" />
                      <div className="location-pulse"></div>
                    </div>
                    <div className="location-info-tooltip">
                      <span>Your current location</span>
                    </div>
                  </div>
                ) : (
                  <div className="default-map-image">
                    <img 
                      src="/images/location-image.png" 
                      alt="Default Map Location"
                      className="default-map" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://maps.googleapis.com/maps/api/staticmap?center=17.385044,78.486671&zoom=13&size=600x350&maptype=roadmap&markers=color:red%7C17.385044,78.486671&key=AIzaSyBVvrihS0LY0_AQd3ky5JsGaUsHzc-xVfo";
                      }}
                    />
                    <div className="map-placeholder-text">
                      Click "Get Location" to see your current location on the map
            </div>
                </div>
              )}
              </div>
              <div className="location-input">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter your address"
                  required
                  className="location-field"
                />
                <button 
                  className="get-location-btn" 
                  onClick={handleGetLocation}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="loading-spinner-container">
                      <div className="loading-spinner"></div>
                      <span>Loading...</span>
                </div>
                  ) : (
                    <>
                      <FaMapMarkerAlt /> Get Location
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Date Section */}
            <div className="date-section">
              <h2>Date</h2>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                min={new Date().toISOString().split('T')[0]}
                required
                className="date-field"
              />
            </div>

            {/* Service Time Section */}
            <div className="pickup-time">
              <h2>Service Time</h2>
              <div className="time-options">
                <div 
                  className={`time-option ${!showTimeSlots ? 'selected' : ''}`}
                  onClick={() => setShowTimeSlots(false)}
                >
                  <span>Standard Time</span>
                </div>
                <div 
                  className={`time-option ${showTimeSlots ? 'selected' : ''}`}
                  onClick={() => setShowTimeSlots(true)}
                >
                  <span>Choose Time Slot</span>
                </div>
              </div>

              {showTimeSlots && (
                <div className="time-slots">
                  <h3>Select Time Slots (Multiple Available)</h3>
                  <div className="slot-grid">
                    {timeSlots.map((slot, index) => (
                      <div 
                        key={index}
                        className={`time-slot ${selectedTimeSlots.includes(slot) ? 'selected' : ''}`}
                        onClick={() => handleTimeSlotSelection(slot)}
                      >
                        {slot}
                        {selectedTimeSlots.includes(slot) && (
                          <span className="checkmark">✓</span>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {selectedTimeSlots.length > 0 && (
                    <div className="selected-time-slots">
                      <h4>Selected Slots:</h4>
                      <div className="selected-slots-chips">
                        {selectedTimeSlots.map((slot, index) => (
                          <div key={index} className="time-slot-chip">
                            <span>{slot}</span>
                            <button 
                              className="remove-slot-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTimeSlotSelection(slot);
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="right-column">
            {/* Cart Summary Section */}
            <div className="cart-summary">
              <h2>Cart Summary ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</h2>
              <div className="cart-items-list">
                {cartItems.map((worker, index) => (
                  <div key={index} className="cart-item">
                    <div className="item-info">
                      <h3>{worker.fullName}</h3>
                      <p className="item-role">{worker.type}</p>
                    </div>
                    <div className="item-price">₹{worker.price.toFixed(2)}</div>
                    <button 
                      className="remove-item-btn" 
                      onClick={() => removeFromCart(worker._id)}
                      aria-label="Remove item"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Promotion Section */}
            <div className="promotion-section">
              <h2>Promotion</h2>
              <div className="promo-input">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter promo code"
                  className="promo-field"
                />
                <button className="apply-btn" onClick={handleApplyPromoCode}>
                  Apply
                </button>
              </div>
              {discount > 0 && (
                <div className="applied-promo">
                  <span>Applied code: {promoCode}</span>
                  <span className="discount-amount">-₹{discount.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Order Total Section */}
            <div className="order-summary">
              <h2>Order Total</h2>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="summary-row discount-row">
                  <span>Discount</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Platform Fee</span>
                <span>₹{platformFee.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>GST & Charges</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="summary-row total-row">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button 
              className="payment-btn" 
              onClick={handlePayment}
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? 'Processing...' : (
                <>
                  <FaShoppingCart size={20} />
              Proceed to Payment
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
