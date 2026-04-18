import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AdminStyles.css';

const ManageVolunteers = () => {
  const { token } = useAuth();
  const [volunteers, setVolunteers] = useState([]);
  const [claimedRescues, setClaimedRescues] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVolunteers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/volunteers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setVolunteers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClaimedRescues = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/rescues', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Show only rescues that have been claimed by a volunteer
        setClaimedRescues(data.filter(r => r.assignedVolunteer));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVolunteers();
    fetchClaimedRescues();
  }, [token]);

  if (loading) return <div className="admin-loading">Loading volunteers...</div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>Volunteer Roster</h2>
        <p>A complete list of registered community volunteers.</p>
      </div>

      {/* 🔔 Claimed Rescue Notifications */}
      {claimedRescues.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🔔 Rescue Claim Notifications
            <span style={{ background: '#6d28d9', color: 'white', fontSize: '11px', padding: '2px 10px', borderRadius: '20px' }}>
              {claimedRescues.length}
            </span>
          </h3>
          {claimedRescues.map(rescue => (
            <div key={rescue._id} style={{
              background: '#faf5ff',
              border: '1px solid #e9d5ff',
              borderRadius: '10px',
              padding: '14px 18px',
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '15px'
            }}>
              <div>
                <p style={{ fontWeight: 600, color: '#1e293b', margin: '0 0 4px' }}>
                  <span style={{ color: '#6d28d9' }}>{rescue.assignedVolunteer?.name || 'A volunteer'}</span> opted in for: <span style={{ color: '#6d28d9' }}>{rescue.category?.replace('-', ' ')}</span>
                </p>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                  📍 {rescue.address} &nbsp;|&nbsp; 🕐 {new Date(rescue.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className={`status-badge status-${rescue.status}`}>{rescue.status}</span>
            </div>
          ))}
        </div>
      )}

      <div className="admin-table-container">
        {volunteers.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty-icon">👥</div>
            <p>No volunteers have registered yet.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Volunteer</th>
                <th>Type</th>
                <th>Contact</th>
                <th>Core Skills</th>
                <th>Availability</th>
                <th>Join Date</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map(vol => (
                <tr key={vol._id}>
                  <td>
                    <div className="admin-user-info">
                      <div className="admin-user-avatar">
                        {vol.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div>
                        <strong>{vol.name}</strong><br/>
                        <small className="admin-email-text">{vol.email}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`type-badge type-${vol.type?.toLowerCase()}`}>
                      {vol.type}
                    </span>
                  </td>
                  <td>
                    <div className="admin-contact-cell">
                      <span>📞 {vol.mobile}</span>
                    </div>
                  </td>
                  <td>
                    <div className="admin-experience-cell" title={vol.experience}>
                      {vol.experience}
                    </div>
                  </td>
                  <td>
                    <span className="admin-pref-text">{vol.rolePref}</span>
                  </td>
                  <td>
                    <span className="admin-date-text">
                      {new Date(vol.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageVolunteers;
