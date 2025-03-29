import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import WorkerDetails from './WorkerDetails';
import { AuthContext } from '../AuthContext';


const sampleWorkers = {
  ac: [
    { name: 'John Doe', location: 'New York', contact: '1234567890' },
    { name: 'Jane Smith', location: 'Los Angeles', contact: '0987654321' }
  ],
  mechanic: [
    { name: 'Mike Johnson', location: 'Chicago', contact: '5551234567' },
    { name: 'Sara Williams', location: 'Houston', contact: '5559876543' }
  ],
  electrical: [
    { name: 'Tom Brown', location: 'Phoenix', contact: '5556781234' }
  ],
  electronics: [
    { name: 'Lucy Green', location: 'Philadelphia', contact: '5553456789' }
  ],
  plumber: [
    { name: 'Robert Black', location: 'San Antonio', contact: '5554567890' }
  ],
  find: [
    { name: 'Worker A', location: 'City X', contact: '5551112222', hourlyRate: '$15/hr' }
  ],
  packers: [
    { name: 'Mover A', location: 'City Y', contact: '5553334444' }
  ]
};

const WorkerDetailsPage = () => {
  const { categoryId } = useParams();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const workers = sampleWorkers[categoryId] || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="section-container enhanced-section-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Workers - {categoryId.toUpperCase()}</h2>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
      <WorkerDetails workers={workers} />
    </div>
  );
};

export default WorkerDetailsPage;
