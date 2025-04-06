// Cart.jsx
import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from './CartContext';
//import OrderPageSection from './OrderPageSection';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
  const [timeSlot, setTimeSlot] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [mapUrl, setMapUrl] = useState('');
  const [subtotal, setSubtotal] = useState(0);
  const [deliveryFee] = useState(35);
  const [platformFee] = useState(10);
  const [taxRate] = useState(0.13); // 13% tax
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // Calculate total whenever cart changes
  useEffect(() => {
    const calculatedSubtotal = cartItems.reduce((total, item) => total + (item.price || 100), 0);
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
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude}, ${longitude}`);
          setMapUrl(`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Could not get your location. Please enter it manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handlePayment = () => {
    if (!timeSlot || !date || !location) {
      alert('Please fill all booking details before proceeding to payment.');
      return;
    }
    alert(`Payment processed.\nTime Slot: ${timeSlot}\nDate: ${date}\nLocation: ${location}`);
  };

  const handleApplyPromoCode = (code) => {
    setPromoCode(code);
    
    // Retrieve offers from localStorage
    const offers = JSON.parse(localStorage.getItem('offers') || '[]');
    
    // Find matching offer
    const matchingOffer = offers.find(offer => offer.code === code);
    
    if (matchingOffer) {
      // Calculate discount amount
      const discountAmount = (subtotal * matchingOffer.discountPercentage) / 100;
      setDiscount(discountAmount);
      alert(`Promo code "${code}" applied! You saved $${discountAmount.toFixed(2)}`);
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
          <div className="cart-summary">
            <h2>Cart summary ({cartItems.length} items)</h2>
            <div className="cart-items-list">
              {cartItems.map((worker, index) => (
                <div key={index} className="cart-item">
                  <div className="item-info">
                    <h3>{worker.fullName}</h3>
                    <p className="item-role">
                      {worker.workerTypes
                        ? Object.keys(worker.workerTypes)
                            .filter((key) => worker.workerTypes[key])
                            .join(', ')
                        : 'Service Provider'}
                    </p>
                  </div>
                  <div className="item-price">${worker.price || 100}.00</div>
                  <button 
                    className="remove-item-btn" 
                    onClick={() => removeFromCart(worker._id)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

      {/*<div className="promotion-section">
              <h3>Promotion</h3>
              <OrderPageSection onSelectPromo={handleApplyPromoCode} />
              {discount > 0 && (
                <div className="applied-promo">
                  <span>Applied code: {promoCode}</span>
                  <span className="discount-amount">-${discount.toFixed(2)}</span>
                </div>
              )}
            </div> */}
          </div>  



          <div className="order-details">
            <div className="order-summary">
              <h2>Order total</h2>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="summary-row discount-row">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Platform Fee</span>
                <span>${platformFee.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>GST & Charges</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="summary-row total-row">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="pickup-time">
              <h2>Pickup Time</h2>
              <div className="time-options">
                <div 
                  className={`time-option ${!showTimeSlots ? 'selected' : ''}`}
                  onClick={() => setShowTimeSlots(false)}
                >
                  <span>Standard 30 Mins</span>
                </div>
                <div 
                  className={`time-option ${showTimeSlots ? 'selected' : ''}`}
                  onClick={() => setShowTimeSlots(true)}
                >
                  <span>Schedule</span>
                </div>
              </div>

              {showTimeSlots && (
                <div className="time-slots">
                  <h3>Select a Time Slot</h3>
                  <div className="slot-grid">
                    {timeSlots.map((slot, index) => (
                      <div 
                        key={index}
                        className={`time-slot ${timeSlot === slot ? 'selected' : ''}`}
                        onClick={() => setTimeSlot(slot)}
                      >
                        {slot}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="location-section">
              <h2>Location</h2>
              <div className="location-input">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter your address"
                />
                <button className="get-location-btn" onClick={handleGetLocation}>
                  Get Location
                </button>
              </div>
              {mapUrl && (
                <div className="map-preview">
                  <iframe
                    title="Location Map"
                    width="100%"
                    height="200"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight="0"
                    marginWidth="0"
                    src={mapUrl}
                  ></iframe>
                </div>
              )}
            </div>

            <div className="date-section">
              <h2>Date</h2>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <button className="payment-btn" onClick={handlePayment}>
              Proceed to Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;