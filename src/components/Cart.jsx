// Cart.jsx
import React, { useContext, useState, useEffect, useRef } from 'react';
import { CartContext } from './CartContext';
//import OrderPageSection from './OrderPageSection';
import './Cart.css';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { FaShoppingCart, FaTrashAlt, FaMapMarkerAlt, FaPlus, FaMinus } from 'react-icons/fa';

// Your Stripe publishable key
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51RBkJNPPVB7AxTVkj61Y1mqxRDes8mukjMTfKkqQRad7ycBldQQRe7QT7FmnOzDdmG0OsaFwTMpK2tbbHal5m3vP00VbSmzNhM';

// Initialize Stripe promise
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const Cart = () => {
  const { cartItems, removeFromCart, clearCart, updateQuantity } = useContext(CartContext);
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
  const [userCoordinates, setUserCoordinates] = useState(null);
  const [showCartItems, setShowCartItems] = useState(true);
  const [showOrderTotal, setShowOrderTotal] = useState(true);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // Calculate total whenever cart changes
  useEffect(() => {
    const calculatedSubtotal = cartItems.reduce((total, item) => {
      // Handle ticket items with fees
      if (item.itemType === 'ticket') {
        const itemPrice = item.price + (item.fees || 0);
        return total + (itemPrice * item.quantity);
      }
      // Handle service worker items
      return total + (item.price * item.quantity);
    }, 0);
    
    setSubtotal(calculatedSubtotal);
  }, [cartItems]);

  // Initialize map if userCoordinates are set
  useEffect(() => {
    if (userCoordinates && window.L) {
      initializeMap();
    }
  }, [userCoordinates]);

  // Load OpenStreetMap resources
  useEffect(() => {
    // Check if Leaflet is already loaded
    if (!window.L) {
      // Load Leaflet CSS
      const linkElement = document.createElement('link');
      linkElement.rel = 'stylesheet';
      linkElement.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      linkElement.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      linkElement.crossOrigin = '';
      document.head.appendChild(linkElement);

      // Load Leaflet JS
      const scriptElement = document.createElement('script');
      scriptElement.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      scriptElement.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      scriptElement.crossOrigin = '';
      scriptElement.onload = () => {
        // If coordinates already exist, initialize map
        if (userCoordinates) {
          initializeMap();
        }
      };
      document.head.appendChild(scriptElement);
    }
  }, []);

  const initializeMap = () => {
    if (!window.L || !userCoordinates || !mapContainerRef.current) return;

    // If map already exists, remove it to recreate
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const { latitude, longitude } = userCoordinates;
    
    // Create map with higher zoom level for better accuracy
    const map = window.L.map(mapContainerRef.current, {
      center: [latitude, longitude],
      zoom: 18, // Higher zoom for better precision
      zoomControl: true,
      attributionControl: true
    });
    
    // Use detailed map tiles for better visibility
    window.L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    // Create a prominent red marker for the user's location
    const redIcon = window.L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    
    // Add marker at the exact coordinates
    const marker = window.L.marker([latitude, longitude], {
      icon: redIcon,
      title: 'Your current location'
    }).addTo(map);
    
    // Add popup with location info
    if (location) {
      marker.bindPopup(`<b>Your Current Location:</b><br>${location}`).openPopup();
    }
    
    // Save references
    mapInstanceRef.current = map;
    markerRef.current = marker;

    // Add a small accuracy circle (helpful for understanding location precision)
    window.L.circle([latitude, longitude], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.15,
      radius: 25 // Small radius for precise location
    }).addTo(map);
    
    // Add scale to help with distances
    window.L.control.scale({
      metric: true,
      imperial: false,
      position: 'bottomleft'
    }).addTo(map);
  };

  const handleGetLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          
          // Log accuracy for debugging
          console.log(`Location accuracy: ${accuracy} meters`);
          
          // Save coordinates for map initialization
          setUserCoordinates({ latitude, longitude });
          
          // Set Google Maps static map URL with improved marker and styling
          setStaticMapUrl(`https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=18&size=800x400&scale=2&maptype=roadmap&markers=color:red%7Csize:mid%7C${latitude},${longitude}&key=AIzaSyBVvrihS0LY0_AQd3ky5JsGaUsHzc-xVfo`);
          
          // Fetch and display the address from coordinates
          fetchAddressFromCoordinates(latitude, longitude);
          
          // Update existing map if it exists
          if (mapInstanceRef.current && window.L) {
            mapInstanceRef.current.setView([latitude, longitude], 18);
            if (markerRef.current) {
              markerRef.current.setLatLng([latitude, longitude]);
              // Update popup if it exists
              if (location) {
                markerRef.current.getPopup().setContent(`<b>Your Current Location:</b><br>${location}`);
              }
            }
          }
          
          setIsLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          let errorMessage = 'Could not get your location. ';
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += 'Location permission was denied. Please enable location services in your browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage += 'The request to get user location timed out.';
              break;
            default:
              errorMessage += 'Please enter your location manually.';
          }
          
          alert(errorMessage);
          setIsLoading(false);
        },
        { 
          enableHighAccuracy: true, // Request highest possible accuracy
          timeout: 10000, // 10 second timeout (shorter for faster response)
          maximumAge: 0 // Always get a fresh position
        }
      );
    } else {
      alert('Geolocation is not supported by your browser. Please enter your location manually.');
      setIsLoading(false);
    }
  };

  const fetchAddressFromCoordinates = async (latitude, longitude) => {
    try {
      setIsLoading(true);
      // Use detailed reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&namedetails=1&extratags=1`
      );
      const data = await response.json();
      
      if (data && data.display_name) {
        // Format the address in a more user-friendly way
        let formattedAddress = '';
        
        if (data.address) {
          const address = data.address;
          const components = [];
          
          // Add place name if available
          if (address.amenity) components.push(address.amenity);
          else if (address.building) components.push(address.building);
          
          // Add building/house number and road
          if (address.house_number) components.push(address.house_number);
          if (address.road) components.push(address.road);
          
          // Add neighborhood/suburb
          if (address.suburb) components.push(address.suburb);
          else if (address.neighbourhood) components.push(address.neighbourhood);
          
          // Add city/town
          if (address.city) components.push(address.city);
          else if (address.town) components.push(address.town);
          else if (address.village) components.push(address.village);
          
          // Add state and postcode
          if (address.state) components.push(address.state);
          if (address.postcode) components.push(address.postcode);
          
          formattedAddress = components.join(', ');
        }
        
        // If we couldn't format the address properly, use the display_name
        if (!formattedAddress) {
          formattedAddress = data.display_name;
        }
        
        setLocation(formattedAddress);
        
        // Update the popup content if map and marker exist
        if (markerRef.current) {
          markerRef.current.setPopupContent(`<b>Your Current Location:</b><br>${formattedAddress}`);
          if (!markerRef.current.isPopupOpen()) {
            markerRef.current.openPopup();
          }
        }
      } else {
        // Fallback to coordinate-based location string if address lookup fails
        const locationStr = `Coordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        setLocation(locationStr);
        
        // Update popup with coordinates
        if (markerRef.current) {
          markerRef.current.setPopupContent(`<b>Your Current Location:</b><br>${locationStr}`);
          if (!markerRef.current.isPopupOpen()) {
            markerRef.current.openPopup();
          }
        }
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      // Set coordinates as location in case of error
      const locationStr = `Coordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      setLocation(locationStr);
      
      // Update popup with coordinates on error
      if (markerRef.current) {
        markerRef.current.setPopupContent(`<b>Your Current Location:</b><br>${locationStr}`);
        if (!markerRef.current.isPopupOpen()) {
          markerRef.current.openPopup();
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

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

  // Render cart items with type-specific displays
  const renderCartItems = () => {
    if (cartItems.length === 0) {
      return <div className="empty-cart">Your cart is empty</div>;
    }

    return (
      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item._id} className={`cart-item ${item.itemType === 'ticket' ? 'ticket-item' : 'worker-item'}`}>
            {/* Item image */}
            <div className="cart-item-image">
              {item.itemType === 'ticket' && item.ticketImage && item.ticketImage.data ? (
                <img 
                  src={`data:${item.ticketImage.contentType};base64,${arrayBufferToBase64(item.ticketImage.data.data)}`} 
                  alt={item.performerName || 'Ticket'} 
                />
              ) : item.profileImage ? (
                <img src={item.profileImage} alt={item.name || 'Service'} />
              ) : (
                <div className="placeholder-image">{item.name?.charAt(0) || 'S'}</div>
              )}
            </div>

            {/* Item details - Different for tickets and workers */}
            {item.itemType === 'ticket' ? (
              <div className="cart-item-details">
                <h4>{item.performerName || item.eventName || item.festivalName || 'Event Ticket'}</h4>
                <div className="price-info">
                  <p>
                    ${item.price.toFixed(2)}
                    {item.fees > 0 && ` + $${item.fees.toFixed(2)} fees`}
                  </p>
                  {item.availableTickets && (
                    <p className="tickets-available">
                      Available: {item.availableTickets} tickets
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="cart-item-details">
                <h4>{item.fullName || item.name || 'Worker'}</h4>
              </div>
            )}

            {/* For tickets: Quantity controls, for workers: just quantity value */}
            {item.itemType === 'ticket' ? (
              <div className="cart-item-quantity">
                <button 
                  className="quantity-btn decrease"
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                >
                  <FaMinus />
                </button>
                <span className="quantity">{item.quantity}</span>
                <button 
                  className="quantity-btn increase"
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  disabled={item.quantity >= item.availableTickets}
                  style={{ 
                    opacity: item.quantity >= item.availableTickets ? 0.5 : 1,
                    cursor: item.quantity >= item.availableTickets ? 'not-allowed' : 'pointer'
                  }}
                >
                  <FaPlus />
                </button>
              </div>
            ) : null}

            {/* Subtotal for this item */}
            <div className="cart-item-subtotal">
              ${calculateItemTotal(item).toFixed(2)}
            </div>

            {/* Delete button: only for workers */}
            {item.itemType !== 'ticket' && (
              <button 
                className="remove-item" 
                onClick={() => removeFromCart(item._id)}
              >
                <FaTrashAlt />
              </button>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Calculate total for a single item including any fees
  const calculateItemTotal = (item) => {
    if (item.itemType === 'ticket') {
      return (item.price + (item.fees || 0)) * item.quantity;
    }
    return item.price * item.quantity;
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to convert Buffer data to base64 for image display
  const arrayBufferToBase64 = (buffer) => {
    if (!buffer) return '';
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
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
                {window.L && userCoordinates ? (
                  // OpenStreetMap with Leaflet
                  <div className="interactive-map">
                    <div 
                      id="osm-map" 
                      ref={mapContainerRef} 
                      className="leaflet-container"
                    ></div>
                    <div className="map-controls">
                      <button 
                        className="recenter-map-btn" 
                        onClick={handleGetLocation}
                        title="Get your exact location"
                      >
                        <span>Update Location</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  // Default state or static map fallback
                  <div className="default-map-image">
                    {staticMapUrl ? (
                      <img 
                        src={staticMapUrl} 
                        alt="Your Location Map"
                        className="location-map" 
                      />
                    ) : (
                      <img 
                        src="/images/location-image.png" 
                        alt="Default Map Location"
                        className="default-map" 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://maps.googleapis.com/maps/api/staticmap?center=17.385044,78.486671&zoom=13&size=600x350&maptype=roadmap&markers=color:red%7C17.385044,78.486671&key=AIzaSyBVvrihS0LY0_AQd3ky5JsGaUsHzc-xVfo";
                        }}
                      />
                    )}
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
                min={new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]}
                required
                className="date-field"
              />
              <p className="date-hint">Please select a date starting from tomorrow</p>
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
              <div className="cart-summary-header">
                <h2>Cart Summary ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</h2>
                <button 
                  className="cart-toggle-btn" 
                  onClick={() => setShowCartItems(!showCartItems)}
                  aria-label={showCartItems ? "Collapse cart items" : "Expand cart items"}
                >
                  {showCartItems ? '▲' : '▼'}
                </button>
              </div>
              {showCartItems && renderCartItems()}
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
                <button className="apply-btn" onClick={handleApplyPromoCode} >
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
            <div className="cart-summary">
              <div className="cart-summary-header">
                <h2>Order Total</h2>
              </div>
              
              <div className="order-details">
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
