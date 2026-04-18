import React, { useEffect, useState } from 'react';
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
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>System Overview</h2>
        <p>At-a-glance metrics for the QuietPaws platform.</p>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon animal">🐾</div>
          <div className="metric-info">
            <h4>Total Animals</h4>
            <h2>{metrics.totalAnimals}</h2>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon adoption">📝</div>
          <div className="metric-info">
            <h4>Pending Adoptions</h4>
            <h2>{metrics.pendingAdoptions}</h2>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon rescue">🚨</div>
          <div className="metric-info">
            <h4>Active Rescues</h4>
            <h2>{metrics.activeRescues}</h2>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon volunteer">🤝</div>
          <div className="metric-info">
            <h4>Total Volunteers</h4>
            <h2>{metrics.totalVolunteers}</h2>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon user">👤</div>
          <div className="metric-info">
            <h4>Registered Users</h4>
            <h2>{metrics.totalUsers}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
