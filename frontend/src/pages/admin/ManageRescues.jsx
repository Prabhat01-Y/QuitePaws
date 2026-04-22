import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  FaMapMarkerAlt, 
  FaPhoneAlt, 
  FaClock, 
  FaCheckCircle, 
  FaFileImage
} from 'react-icons/fa';
import './AdminStyles.css';

const ManageRescues = () => {
  const { token } = useAuth();
  const [rescues, setRescues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRescueProof, setSelectedRescueProof] = useState(null);

  const fetchRescues = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/rescues', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setRescues(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRescues();

    // Listen for global refresh events from the Topbar
    const handleGlobalRefresh = () => fetchRescues();
    window.addEventListener('refresh-rescues', handleGlobalRefresh);
    
    return () => {
      window.removeEventListener('refresh-rescues', handleGlobalRefresh);
    };
  }, [fetchRescues]);

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/rescues/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setRescues(rescues.map(r => r._id === id ? { ...r, status: newStatus } : r));
        // Also dispatch a refresh event back to the topbar so the count updates
        window.dispatchEvent(new CustomEvent('refresh-rescues'));
      }
    } catch (err) {
      alert('Error updating status');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return 'status-rejected';
      case 'high': return 'status-rejected';
      case 'medium': return 'status-pending';
      default: return 'status-approved';
    }
  };

  if (loading) return <div className="admin-loading">Initializing dispatch system...</div>;

  return (
    <div className="admin-page">
      {/* Simplified header: Title only, buttons moved to global topbar */}
      <div className="management-header-clean">
        <div className="header-info">
          <div className="title-row">
            <h1>Rescue Cases</h1>
          </div>
          <p>Real-time monitoring and coordination of emergency response incidents</p>
        </div>
      </div>

      <div className="rescue-operations-container">
        {rescues.length === 0 ? (
          <div className="empty-state">
            <FaCheckCircle size={48} style={{ color: 'var(--success)', marginBottom: '16px' }} />
            <h3>All Incidents Resolved</h3>
            <p>There are no pending emergency reports at this time.</p>
          </div>
        ) : (
          <div className="rescue-grid">
            {rescues.map((rescue) => (
              <div key={rescue._id} className={`rescue-card status-border-${rescue.status}`}>
                <div className="rescue-card-top">
                  <div className="priority-badge-container">
                    <span className={`rescue-priority-tag ${getPriorityColor(rescue.priority)}`}>
                      {rescue.priority}
                    </span>
                  </div>
                  <div className="report-id">
                    #{(rescue._id || '').slice(-6).toUpperCase()}
                  </div>
                </div>

                <div className="rescue-card-body">
                  <h3 className="reporter-name">{rescue.name}</h3>
                  <div className="incident-description">
                    <p>{rescue.description}</p>
                  </div>

                  <div className="info-item-list">
                    <div className="info-item">
                      <FaMapMarkerAlt className="mini-icon" />
                      <span>{rescue.address}</span>
                    </div>
                    <div className="info-item">
                      <FaPhoneAlt className="mini-icon" />
                      <span>{rescue.mobile}</span>
                    </div>
                    <div className="info-item">
                      <FaClock className="mini-icon" />
                      <span>{new Date(rescue.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="rescue-card-footer">
                  <div className="status-control">
                    <label>Status</label>
                    <select
                      className={`status-dropdown dropdown-${rescue.status}`}
                      value={rescue.status}
                      onChange={(e) => updateStatus(rescue._id, e.target.value)}
                    >
                      <option value="pending">Pending Dispatch</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Case Resolved</option>
                    </select>
                  </div>
                  
                  <div className="footer-actions">
                    {rescue.status === 'resolved' && (rescue.completionNote || (rescue.completionPhotos?.length > 0)) && (
                      <button className="proof-btn" onClick={() => setSelectedRescueProof(rescue)}>
                        <FaFileImage /> Proof
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedRescueProof && (
        <div className="admin-modal-overlay" onClick={() => setSelectedRescueProof(null)}>
          <div className="resolution-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Resolution Evidence</h3>
              <button className="close-x" onClick={() => setSelectedRescueProof(null)}>×</button>
            </div>

            <div className="modal-body-scroll">
              {selectedRescueProof.completionPhotos?.length > 0 && (
                <div className="evidence-image-container">
                  <img
                    src={`http://localhost:5000/uploads/emergency-reports/${selectedRescueProof.completionPhotos[0].replace(/\\/g, '/')}`}
                    alt="Rescue Success Proof"
                  />
                </div>
              )}
              <div className="log-section">
                <label>Resolution Log</label>
                <div className="log-content">
                  {selectedRescueProof.completionNote || "Official resolution note not provided."}
                </div>
              </div>
            </div>
            <div className="modal-footer">
                <button className="close-btn-full" onClick={() => setSelectedRescueProof(null)}>Close Review</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRescues;