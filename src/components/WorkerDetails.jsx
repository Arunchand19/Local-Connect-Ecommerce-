// WorkerDetails.jsx
import React, { useContext } from 'react';
import './WorkerDetails.css';
import { CartContext } from "./CartContext";
// <-- new

const WorkerDetails = ({ workers }) => {
  const { addToCart } = useContext(CartContext); // <-- get addToCart function

  if (!workers || workers.length === 0) {
    return <p>No workers available in this category.</p>;
  }

  // Helper function to convert buffer to image URL
  const bufferToImageUrl = (profileData) => {
    try {
      if (!profileData || !profileData.data) return null;
      
      // Check if data is already a string (base64)
      if (typeof profileData.data === 'string') {
        return `data:${profileData.contentType || 'image/jpeg'};base64,${profileData.data}`;
      }
      
      // Handle Buffer or ArrayBuffer
      let base64String;
      if (profileData.data.data) {
        // Handle case when data is in MongoDB BSON format
        const buffer = Buffer.from(profileData.data.data);
        base64String = buffer.toString('base64');
      } else if (Array.isArray(profileData.data)) {
        // Handle case when data is a plain array
        const buffer = Buffer.from(profileData.data);
        base64String = buffer.toString('base64');
      } else {
        // Fallback
        return null;
      }
      
      const contentType = profileData.contentType || 'image/jpeg';
      return `data:${contentType};base64,${base64String}`;
    } catch (error) {
      console.error('Error converting image buffer:', error);
      return null;
    }
  };

  // Determine worker role based on workerTypes
  const getWorkerRole = (workerTypes) => {
    if (!workerTypes) return 'Service Provider';
    
    const roles = [];
    if (workerTypes.acRepair) roles.push('AC Repair Technician');
    if (workerTypes.mechanicRepair) roles.push('Mechanic');
    if (workerTypes.electricalRepair) roles.push('Electrician');
    if (workerTypes.electronicRepair) roles.push('Electronics Repair Technician');
    if (workerTypes.plumber) roles.push('Plumber');
    if (workerTypes.packersMovers) roles.push('Packers & Movers');
    
    return roles.length > 0 ? roles.join(', ') : 'Service Provider';
  };

  return (
    <div className="workers-grid">
      {workers.map((worker, index) => {
        const imageUrl = worker.profilePhoto ? bufferToImageUrl(worker.profilePhoto) : null;

        // Handler to add worker to cart
        const handleBookNow = () => {
          const workerToAdd = {
            ...worker,
            price: worker.costPerHour || 1000, // Default price if not set
            quantity: 1
          };
          addToCart(workerToAdd);
          // Show a success message or notification here
          alert('Worker added to cart successfully!');
        };

        
        return (
          <div key={index} className="worker-card">
            <div className="worker-header">
              <div className="worker-photo">
                {imageUrl ? (
                  <img src={imageUrl} alt={`${worker.fullName}`} />
                ) : (
                  <div className="placeholder-photo">
                    {worker.fullName ? worker.fullName.charAt(0).toUpperCase() : '?'}
                  </div>
                )}
              </div>
              <div className="worker-basic-info">
                <h3 className="worker-name">{worker.fullName}</h3>
                <div className="worker-role">{getWorkerRole(worker.workerTypes)}</div>
                <div className="worker-rating">
                  <span className="stars">★★★★☆</span> 
                  <span className="rating-value">4.0</span>
                </div>
              </div>
            </div>

            
            <div className="worker-details">
              <div className="detail-item">
                <span className="detail-label">Contact:</span>
                <span className="detail-value">{worker.phoneNumber}</span>
              </div>

              
              <div className="detail-item">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{worker.email}</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Location:</span>
                <span className="detail-value">{worker.city}, {worker.state}</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Address:</span>
                <span className="detail-value">{worker.address}</span>
              </div>

              
              <div className="detail-item">
                <span className="detail-label">Age:</span>
                <span className="detail-value">{worker.age}</span>
              </div>

              
              <div className="detail-item">
                <span className="detail-label">Gender:</span>
                <span className="detail-value">{worker.gender}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Cost per hour:</span>
                <span className="detail-value">
                  {(worker.costPerHour !== undefined && worker.costPerHour !== null && worker.costPerHour !== "") 
                    ? `₹${worker.costPerHour}` 
                    : "Not specified"}
                </span>
              </div>
              
              <div className="detail-item emergency-contact">
                <span className="detail-label">Emergency Contact:</span>
                <span className="detail-value">{worker.phoneNumber}</span>
              </div>

              
              <div className="detail-item employment-status">
                <span className="detail-label">Status:</span>
                <span className="detail-value">Independent Contractor</span>
              </div>

              
              <div className="detail-item service-schedule">
                <span className="detail-label">Availability:</span>
                <span className="detail-value">Mon-Sat, 9 AM - 6 PM</span>
              </div>
            </div>

            <div className="worker-actions">
              <button className="action-btn book-btn" onClick={handleBookNow}>
                Book Now
              </button>
              <button className="action-btn contact-btn">Contact</button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WorkerDetails;
