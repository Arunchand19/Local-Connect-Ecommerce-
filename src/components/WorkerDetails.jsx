import React from 'react';

const WorkerDetails = ({ workers }) => {
  if (!workers || workers.length === 0) {
    return <p>No workers available in this category.</p>;
  }

  return (
    <div>
      {workers.map((worker, index) => (
        <div
          key={index}
          style={{
            background: '#fff',
            margin: '10px',
            padding: '10px',
            borderRadius: '5px',
            textAlign: 'left'
          }}
        >
          <h4>{worker.name}</h4>
          <p>Location: {worker.location}</p>
          <p>Contact: {worker.contact}</p>
          {worker.hourlyRate && <p>Rate: {worker.hourlyRate}</p>}
        </div>
      ))}
    </div>
  );
};

export default WorkerDetails;
