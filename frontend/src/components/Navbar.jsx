import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, isAdmin, isVolunteer, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header id="header" className="navbar">
      <Link to="/" className="logo">
        <span className="logo-icon">🐾</span>
        <div className="logo-text-col">
          <span className="logo-title">QUIETPAWS</span>
          <span className="logo-sub">COMPASSION. PROTECTION. PRESERVATION.</span>
        </div>
      </Link>
      <ul>
        <li><Link to="/" className="active">Home</Link></li>
        <li><Link to="/about">About</Link></li>

        {/* Only show Adoption & Volunteer for public / non-role users */}
        {!isAdmin && !isVolunteer && (
          <li><Link to="/adopt">Adoption</Link></li>
        )}

        <li><Link to="/donate">Donate</Link></li>
        <li><Link to="/contact">Contact</Link></li>

        {isAuthenticated ? (
          <>
            {isAdmin && (
              <li><Link to="/admin" className="admin-nav-link">Admin Panel</Link></li>
            )}
            {isVolunteer && (
              <li><Link to="/volunteer-dashboard" className="admin-nav-link">My Dashboard</Link></li>
            )}
            <li>
              <button className="logout-nav-btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/volunteer">Volunteer</Link></li>
            <li><Link to="/login" className="admin-nav-link">Sign In</Link></li>
          </>
        )}
      </ul>
    </header>
  );
};

export default Navbar;