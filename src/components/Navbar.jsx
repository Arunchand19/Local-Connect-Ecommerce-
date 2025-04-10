// src/components/Navbar.jsx
import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { CartContext } from './CartContext';
import { FaShoppingCart } from 'react-icons/fa'; // Import the cart icon

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext); // get cart items from context
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/');
  };

  // Function to scroll to workers section
  const scrollToWorkers = (e) => {
    e.preventDefault(); // Prevent default link behavior
    const workersSection = document.getElementById('workers-availability');
    
    if (location.pathname !== '/') {
      // If not on home page, navigate to home first
      navigate('/');
      // Wait for navigation to complete then scroll
      setTimeout(() => {
        const section = document.getElementById('workers-availability');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else if (workersSection) {
      // Already on home page, just scroll
      workersSection.scrollIntoView({ behavior: 'smooth' });
      closeMenu();
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-logo">
          <NavLink to="/" onClick={closeMenu}>
            Service Hub
          </NavLink>
        </div>
        <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
            onClick={closeMenu}
          >
            Home
          </NavLink>

          <a
            href="#workers-availability"
            className="nav-item"
            onClick={scrollToWorkers}
          >
            Workers
          </a>

          <NavLink
            to="/tickets"
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
            onClick={closeMenu}
          >
            Events
          </NavLink>

          {/* New Cart Link with Icon */}
          <NavLink
            to="/cart"
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
            onClick={closeMenu}
          >
            <FaShoppingCart style={{ fontSize: '1.2rem' }} />
            {cartItems.length > 0 && <span className="cart-count">{cartItems.length}</span>}
          </NavLink>

          {isAuthenticated ? (
            <button className="nav-item logoff-btn" onClick={handleLogout}>
              Logoff
            </button>
          ) : (
            <NavLink
              to="/select"
              className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
              onClick={closeMenu}
            >
              Login
            </NavLink>
          )}

          <NavLink
            to="/contact"
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
            onClick={closeMenu}
          >
            Contact
          </NavLink>
        </div>

        <div className={`navbar-toggle ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;