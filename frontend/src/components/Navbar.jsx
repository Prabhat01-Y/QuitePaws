import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header id="header" className="navbar">
      <Link to="/" className="logo">Quietpaws</Link>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/adopt">Adoption</Link></li>
        <li><Link to="/contact">Contact</Link></li>

        {isAuthenticated ? (
          <>
            <li><Link to="/admin/add-animal" className="admin-nav-link">Admin</Link></li>
            <li>
              <button className="logout-nav-btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <li><Link to="/admin/login" className="admin-nav-link">Admin</Link></li>
        )}
      </ul>
    </header>
  );
};

export default Navbar;