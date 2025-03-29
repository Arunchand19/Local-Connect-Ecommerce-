import React from 'react';
import { Link } from 'react-router-dom';

const images = [
  {
    url: 'https://media.istockphoto.com/id/921346102/photo/plumber-fixing-sink-pipe-with-adjustable-wrench.jpg?s=2048x2048&w=is&k=20&c=wh-yvOsmJLXTguGTM9j6xijl6FwE2iPKPB4Yhv0PqHo=',
    title: 'Professional Plumbing Services',
    description: 'Our certified plumbers are ready to tackle any plumbing issue with prompt and reliable service.',
    link: '/workers/plumber'
  },
  {
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCsNzTgq3hzLPu-L1Ra5-QlrpJGMjkLqDagw&s',
    title: 'Expert Mechanical Repairs',
    description: 'Trust our skilled mechanics to diagnose and fix your mechanical problems efficiently.',
    link: '/workers/mechanic'
  },
  {
    url: 'https://media.istockphoto.com/id/1437896577/photo/air-conditioner-technician-repairing-central-air-conditioning-system-with-outdoor-tools.jpg?s=2048x2048&w=is&k=20&c=u78JHE8xIxjLyCG_yV9Ffjuldr5MFzU_u_04f-JWfTs=',
    title: 'AC Repair & Maintenance',
    description: 'Stay cool with our comprehensive AC repair and maintenance services by certified technicians.',
    link: '/workers/ac'
  }
];

const ImageSlider = () => {
  return (
    <div className="slider-container">
      <div className="slider-wrapper">
        {images.map((image, index) => (
          <div key={index} className="slider-item">
            <img src={image.url} alt={`Slide ${index}`} />
            <div className="slider-overlay"></div>
            <div className="slider-content">
              <h2>{image.title}</h2>
              <p>{image.description}</p>
              <Link to={image.link} className="slider-btn">Learn More</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;