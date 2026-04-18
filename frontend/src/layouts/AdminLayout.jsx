import React from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminLayout.css';

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <Link to="/">QuietPaws <span>Admin</span></Link>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <span className="nav-icon">📊</span> Dashboard
          </NavLink>
          <NavLink to="/admin/rescues" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <span className="nav-icon">🚨</span> Rescues
          </NavLink>
          <NavLink to="/admin/map" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <span className="nav-icon">🗺️</span> Live Maps
          </NavLink>
          <NavLink to="/admin/animals" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <span className="nav-icon">🐾</span> Animals
          </NavLink>
          <NavLink to="/admin/adoptions" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <span className="nav-icon">📝</span> Adoptions
          </NavLink>
          <NavLink to="/admin/events" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <span className="nav-icon">📅</span> Events
          </NavLink>
          <NavLink to="/admin/volunteers" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <span className="nav-icon">🤝</span> Volunteers
          </NavLink>
          <NavLink to="/admin/donations" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <span className="nav-icon">💰</span> Donations
          </NavLink>
        </nav>

        <div className="admin-bottom-actions">
          <button className="admin-logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-greeting">
            <h3>Hello, {user?.name || 'Admin'}</h3>
            <p>Welcome to your control panel</p>
          </div>
          <div className="admin-quick-actions">
            <Link to="/" className="back-website-btn">🌍 View Website</Link>
          </div>
        </header>

        <div className="admin-content">
          {/* This renders the nested route (Dashboard, Rescues, etc) */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
