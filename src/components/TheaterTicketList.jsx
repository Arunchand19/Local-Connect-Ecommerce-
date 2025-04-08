import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TicketList.css';

const TheaterTicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5001/api/tickets/theater');
        setTickets(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching theater tickets:', err);
        setError('Failed to load tickets. Please try again later.');
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

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

  if (loading) {
    return <div className="loading-container">Loading available tickets...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (tickets.length === 0) {
    return <div className="no-tickets-container">No theater tickets available at the moment.</div>;
  }

  return (
    <div className="ticket-list-container">
      <h2>Available Theater Tickets</h2>
      <div className="ticket-grid">
        {tickets.map((ticket) => (
          <div key={ticket._id} className="ticket-card">
            {ticket.ticketImage && ticket.ticketImage.data && (
              <div className="ticket-image-container">
                <img
                  src={`data:${ticket.ticketImage.contentType};base64,${arrayBufferToBase64(ticket.ticketImage.data.data)}`}
                  alt={`Ticket for ${ticket.performanceName}`}
                  className="ticket-image"
                />
              </div>
            )}
            <div className="ticket-info">
              <h3>{ticket.performanceName}</h3>
              <div className="ticket-details">
                <p><strong>Date:</strong> {formatDate(ticket.eventDate)}</p>
                <p><strong>Time:</strong> {ticket.eventTime}</p>
                <p><strong>Venue:</strong> {ticket.venue}</p>
                <p><strong>Seat:</strong> {ticket.seatNumber}</p>
                <p className="ticket-price"><strong>Price:</strong> ${ticket.ticketPrice}
                  {ticket.additionalFees > 0 && ` + $${ticket.additionalFees} fees`}
                </p>
                <p className="tickets-available"><strong>Available:</strong> {ticket.availableTickets} tickets</p>
              </div>
              <button className="buy-ticket-btn">Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TheaterTicketList; 