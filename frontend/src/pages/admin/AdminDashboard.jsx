import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminStyles.css';

const AdminDashboard = () => {
  const { token } = useAuth();
  const [metrics, setMetrics] = useState({
    totalAnimals: 0,
    pendingAdoptions: 0,
    activeRescues: 0,
    totalVolunteers: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/metrics', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setMetrics(data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to load metrics. Is the backend running?');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [token]);

  if (loading) return <div className="admin-loading">Loading metrics...</div>;
  if (error) return <div className="admin-error">{error}</div>;

  return (
    <div className="admin-page management-view dashboard-mode">
      {/* High-Impact Hero Header (Home Page Theme) */}
      <div className="dashboard-hero">
        <div className="management-header">
          <div className="header-text">
             <h1>Mission <span className="highlight">Control</span></h1>
             <p>Global system analytics and platform orchestration.</p>
          </div>
          <div className="status-capsule">
             <span className="pulse-emerald"></span>
             SYSTEM LIVE
          </div>
        </div>
      </div>

      {/* Glassmorphic Metrics Overlay */}
      <div className="metrics-overlay">
        <div className="metrics-grid-expansive">
          <div className="glass-metric-card">
            <div className="m-header">
               <span>Animal Census</span>
               <div className="icon-wrap">🐾</div>
            </div>
            <h2>{metrics.totalAnimals}</h2>
          </div>

          <div className="glass-metric-card">
            <div className="m-header">
               <span>Open Adoption</span>
               <div className="icon-wrap">📝</div>
            </div>
            <h2>{metrics.pendingAdoptions}</h2>
          </div>

          <div className="glass-metric-card">
            <div className="m-header">
               <span>Rescue Ops</span>
               <div className="icon-wrap">🚨</div>
            </div>
            <h2>{metrics.activeRescues}</h2>
          </div>

          <div className="glass-metric-card">
            <div className="m-header">
               <span>Hero Force</span>
               <div className="icon-wrap">🤝</div>
            </div>
            <h2>{metrics.totalVolunteers}</h2>
          </div>
        </div>
      </div>

      {/* Premium Dashboard Body */}
      <div className="dashboard-body">
         <div className="quick-nav-container">
            <div className="quick-nav-grid-premium">
              <Link to="/admin/animals" className="premium-nav-card">
                <div className="nav-card-icon">🐕</div>
                <div className="nav-card-info">
                   <h3>Inventory Sync</h3>
                   <p>Curate health records, update biographies, and manage availability status for all rescues.</p>
                </div>
                <span className="nav-card-arrow">→</span>
              </Link>

              <Link to="/admin/adoptions" className="premium-nav-card">
                <div className="nav-card-icon">🏘️</div>
                <div className="nav-card-info">
                   <h3>Placement Review</h3>
                   <p>Oversee applicant lifestyle surveys and coordinate transition plans for finalized adoptions.</p>
                </div>
                <span className="nav-card-arrow">→</span>
              </Link>

              <Link to="/admin/volunteers" className="premium-nav-card">
                <div className="nav-card-icon">👥</div>
                <div className="nav-card-info">
                   <h3>Roster Admin</h3>
                   <p>Manage community credentials, verify mission performance, and coordinate volunteer outreach.</p>
                </div>
                <span className="nav-card-arrow">→</span>
              </Link>

              <Link to="/admin/rescues" className="premium-nav-card">
                <div className="nav-card-icon">🚑</div>
                <div className="nav-card-info">
                   <h3>Incident Response</h3>
                   <p>Deploy emergency missions, track dispatch status, and audit historical incident reporting.</p>
                </div>
                <span className="nav-card-arrow">→</span>
              </Link>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
