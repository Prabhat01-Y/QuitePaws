import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaPaw, 
  FaHeartbeat, 
  FaHome, 
  FaCompass, 
  FaCalendarAlt, 
  FaHandsHelping, 
  FaDonate,
  FaSignOutAlt,
  FaSync,
  FaExclamationTriangle,
  FaCheckCircle,
  FaPlus,
  FaCalendarPlus
} from "react-icons/fa";
import { LayoutDashboard } from "lucide-react";
import '../pages/admin/AdminStyles.css';

const AdminLayout = () => {
  const { logout, user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeRescues, setActiveRescues] = useState(0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const fetchActiveCount = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/metrics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setActiveRescues(data.activeRescues || 0);
      }
    } catch (err) {
      console.error("Topbar counter fetch failed", err);
    }
  };

  useEffect(() => {
    if (location.pathname === '/admin/rescues' && token) {
      fetchActiveCount();
      const interval = setInterval(fetchActiveCount, 30000);
      return () => clearInterval(interval);
    }
  }, [location.pathname, token]);

  const handleGlobalRefresh = () => {
    fetchActiveCount();
    window.dispatchEvent(new CustomEvent('refresh-rescues'));
  };

  const handleAddEventClick = () => {
    window.dispatchEvent(new CustomEvent('open-add-event-modal'));
  };

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">🐾</div>
          <span className="logo-text">QuietPaws</span>
        </div>

        <nav className="nav-menu">
          <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/admin/rescues" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <FaHeartbeat size={20} />
            <span>Rescues</span>
          </NavLink>
          <NavLink to="/admin/map" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <FaCompass size={20} />
            <span>Live Map</span>
          </NavLink>
          <NavLink to="/admin/animals" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <FaPaw size={20} />
            <span>Animals</span>
          </NavLink>
          <NavLink to="/admin/adoptions" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <FaHome size={20} />
            <span>Adoptions</span>
          </NavLink>
          <NavLink to="/admin/events" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <FaCalendarAlt size={20} />
            <span>Events</span>
          </NavLink>
          <NavLink to="/admin/volunteers" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <FaHandsHelping size={20} />
            <span>Volunteers</span>
          </NavLink>
          <NavLink to="/admin/donations" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <FaDonate size={20} />
            <span>Donations</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="welcome-section">
            <h1>Hello, {user?.name || 'Prabhat'} 👋</h1>
          </div>

          <div className="topbar-actions">
            {location.pathname === '/admin/rescues' && (
              <div className="topbar-rescue-controls">
                {activeRescues > 0 ? (
                  <div className="active-dispatch-pill topbar-pill-extra-large">
                    <FaExclamationTriangle className="pulse-icon" />
                    <span>{activeRescues} ACTIVE DISPATCHES</span>
                  </div>
                ) : (
                  <div className="active-dispatch-pill sleep topbar-pill-extra-large">
                    <FaCheckCircle />
                    <span>ALL INCIDENTS RESOLVED</span>
                  </div>
                )}
                <button className="icon-refresh-btn" onClick={handleGlobalRefresh} title="Refresh Feed">
                  <FaSync />
                </button>
              </div>
            )}

            {location.pathname === '/admin/animals' && (
              <Link to="/admin/add-animal" className="add-record-btn-premium">
                <div className="btn-glow"></div>
                <FaPlus className="plus-icon" />
                <span>Add New Resident</span>
              </Link>
            )}

            {location.pathname === '/admin/events' && (
              <button className="add-record-btn-premium active" onClick={handleAddEventClick}>
                <div className="btn-glow"></div>
                <FaCalendarPlus className="plus-icon" />
                <span>Add Event</span>
              </button>
            )}
          </div>
        </header>

        <div className="admin-outlet">
           <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
