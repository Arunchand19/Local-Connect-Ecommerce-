import React from 'react';


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: support@example.com</p>
          <p>Phone: +1 (555) 123-4567</p>
        </div>
        <div className="footer-section">
          <h3>Our Location</h3>
          <p>123 Main Street</p>
          <p>City, Country</p>
        </div>
        <div className="footer-section">
          <h3>Working Hours</h3>
          <p>Mon - Fri: 9am - 6pm</p>
          <p>Sat: 10am - 4pm</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Service Hub. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
