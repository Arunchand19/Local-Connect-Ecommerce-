import React from 'react';

const TicketDetails = ({ tickets }) => {
  if (!tickets || tickets.length === 0) {
    return <p>No tickets available in this sector.</p>;
  }

  const handleBookTicket = (ticket) => {
    alert(
      `Ticket booked for ${ticket.event} at ${ticket.place} for ${ticket.price}`
    );
  };

  return (
    <div>
      {tickets.map((ticket) => (
        <div
          key={ticket.id}
          style={{
            background: '#fff',
            margin: '10px',
            padding: '10px',
            borderRadius: '5px',
            textAlign: 'left'
          }}
        >
          <h4>{ticket.event}</h4>
          <p>Place: {ticket.place}</p>
          <p>Price: {ticket.price}</p>
          <button onClick={() => handleBookTicket(ticket)}>Book Ticket</button>
        </div>
      ))}
    </div>
  );
};

export default TicketDetails;
