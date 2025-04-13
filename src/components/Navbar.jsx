// src/components/Navbar.jsx
import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { CartContext } from './CartContext';
import { FaShoppingCart } from 'react-icons/fa'; // Import the cart icon

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext); // get cart items from context
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

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

          <NavLink
            to="/workers"
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
            onClick={closeMenu}
          >
            Workers
          </NavLink>

          <NavLink
            to="/tickets"
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
            onClick={closeMenu}
          >
            Events
          </NavLink>

          {/* Reviews button - visible to all users */}
          <div className="nav-dropdown">
            <NavLink
              to="/reviews"
              className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
              onClick={closeMenu}
            >
              Reviews
            </NavLink>
            <div className="dropdown-content">
              <NavLink to="/reviews" onClick={closeMenu}>View Reviews</NavLink>
              <NavLink to="/add-review" onClick={closeMenu}>Write a Review</NavLink>
            </div>
          </div>

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