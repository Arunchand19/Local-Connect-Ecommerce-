import React from 'react';
import { Link } from 'react-router-dom';

const ticketSectors = [
  { id: 'concert', name: 'Concerts', icon: '🎵', description: 'Book tickets for popular concerts' },
  { id: 'sports', name: 'Sports', icon: '⚽', description: 'Don\'t miss exciting sports events' },
  { id: 'theater', name: 'Theater', icon: '🎭', description: 'Enjoy amazing theatrical performances' },
  { id: 'festival', name: 'Festivals', icon: '🎪', description: 'Experience cultural festivals' }
];

const TicketSection = () => {
  return (
    <div className="tickets-page">
      <div className="enhanced-section-container" id="ticket-section">
        <h2>Sell and Buy Tickets</h2>
        <div className="ticket-grid">
          {ticketSectors.map((sector) => (
            <Link key={sector.id} to={`/tickets/sellbuy/${sector.id}`} className="logo-card">
              <div className="worker-logo">{sector.icon}</div>
              <h3>{sector.name}</h3>
              <p className="category-description">{sector.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TicketSection;
