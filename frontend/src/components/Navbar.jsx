import React from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, isAdmin, isVolunteer, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide Navbar when on any admin route, EXCEPT the admin login page
  if (location.pathname.startsWith('/admin') && location.pathname !== '/admin/login') {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <Link to="/" className="logo">
        <span className="logo-icon">🐾</span>
        QuietPaws
      </Link>
      <ul>
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/about">About</NavLink></li>
        <li><NavLink to="/contact">Contact</NavLink></li>
        
        {/* Only show Adoption for public users */}
        {!isAdmin && !isVolunteer && (
          <li><NavLink to="/adopt">Adoption</NavLink></li>
        )}

        <li><NavLink to="/volunteer">Volunteer</NavLink></li>
        <li><NavLink to="/donate">Donation</NavLink></li>

        {isAuthenticated && (
          <>
            {isAdmin && (
              <li><NavLink to="/admin" className="admin-nav-link">Admin Panel</NavLink></li>
            )}
            {isVolunteer && (
              <li><NavLink to="/volunteer-dashboard" className="admin-nav-link">Dashboard</NavLink></li>
            )}
            <li>
              <button className="logout-nav-btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        )}
        {!isAuthenticated && (
          <li><NavLink to="/login" className="logout-nav-btn">SIGN IN</NavLink></li>
        )}
      </ul>
    </header>
  );
};

export default Navbar;