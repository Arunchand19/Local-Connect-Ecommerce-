import React from 'react';
import { Link } from 'react-router-dom';


const workerCategories = [
  { id: 'ac', name: 'AC Repair', logo: '❄️', description: 'Professional AC installation, repair & maintenance' },
  { id: 'mechanic', name: 'Mechanic Repair', logo: '🚗', description: 'Expert auto repairs with quality parts' },
  { id: 'electrical', name: 'Electrical Repair', logo: '💡', description: 'Licensed electricians for all electrical needs' },
  { id: 'electronics', name: 'Electronics Repair', logo: '📺', description: 'Fix your gadgets & electronic devices' },
  { id: 'plumber', name: 'Plumber', logo: '🚰', description: 'Reliable plumbing services & repairs' },
  { id: 'find', name: 'Find Workers', logo: '👷', description: 'Hire skilled workers for your project' },
  { id: 'packers', name: 'Packers & Movers', logo: '📦', description: 'Professional moving & packing services' }
];

const WorkerSection = () => {
  return (
    <div className="enhanced-section-container" id="workers-availability">
      <h2>Workers Availability</h2>
      <div className="worker-grid">
        {workerCategories.map((category) => (
          <Link key={category.id} to={`/workers/${category.id}`} className="logo-card">
            <div className="worker-logo">{category.logo}</div>
            <h3>{category.name}</h3>
            <p className="category-description">{category.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default WorkerSection;
