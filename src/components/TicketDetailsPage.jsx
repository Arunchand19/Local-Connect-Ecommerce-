import React from 'react';
import { useParams } from 'react-router-dom';
import TicketDetails from './TicketDetails';

const sampleTickets = {
  concert: [
    { id: 1, place: 'Madison Square Garden', event: 'Rock Concert', price: '$100' },
    { id: 2, place: 'Staples Center', event: 'Pop Concert', price: '$120' }
  ],
  sports: [
    { id: 3, place: 'Yankee Stadium', event: 'Baseball Game', price: '$80' }
  ],
  theater: [
    { id: 4, place: 'Broadway', event: 'Musical', price: '$150' }
  ],
  festival: [
    { id: 5, place: 'Central Park', event: 'Food Festival', price: '$50' }
  ]
};

const TicketDetailsPage = () => {
  const { sectorId } = useParams();
  const tickets = sampleTickets[sectorId] || [];
  const heading =
    sectorId.charAt(0).toUpperCase() + sectorId.slice(1) + ' Tickets';
  return (
    <div className="section-container enhanced-section-container">
      <h2>{heading}</h2>
      <TicketDetails tickets={tickets} />
    </div>
  );
};

export default TicketDetailsPage;
