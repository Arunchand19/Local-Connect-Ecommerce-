import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
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
    setMenuOpen(prev => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/");
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
            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
            onClick={closeMenu}
          >
            Home
          </NavLink>
          <NavLink
            to="/workers"
            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
            onClick={closeMenu}
          >
            Workers
          </NavLink>
          <NavLink
            to="/tickets"
            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
            onClick={closeMenu}
          >
            Events
          </NavLink>
          {isAuthenticated ? (
            <button className="nav-item logoff-btn" onClick={handleLogout}>
              Logoff
            </button>
          ) : (
            <NavLink
              to="/select"
              className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
              onClick={closeMenu}
            >
              Login
            </NavLink>
          )}
          <NavLink
            to="/contact"
            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
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
