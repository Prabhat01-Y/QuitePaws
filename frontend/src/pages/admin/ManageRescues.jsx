import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AdminStyles.css';

const ManageRescues = () => {
  const { token } = useAuth();
  const [rescues, setRescues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRescueProof, setSelectedRescueProof] = useState(null);

  const fetchRescues = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/rescues', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        console.log("DEBUG: Rescues Data", data);
        setRescues(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRescues();
  }, [token]);

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/rescues/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setRescues(rescues.map(r => r._id === id ? { ...r, status: newStatus } : r));
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      alert('Error updating status');
    }
  };

  if (loading) return <div className="admin-loading">Loading rescues...</div>;

  return (
    <div className="admin-page management-view">
      {/* Premium Dashboard Header */}
      <div className="management-header">
        <div className="header-text">
          <h1>Emergency <span className="highlight">Rescues</span></h1>
          <p>Track and update active animal rescue reports.</p>
        </div>
      </div>

      <div className="animal-list-container">
        {rescues.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🚑</span>
            <h3>No rescue reports found</h3>
            <p>Active emergency missions will appear here for coordination.</p>
          </div>
        ) : (
          <div className="animal-cards-grid">
            {rescues.map((rescue) => (
              <div key={rescue._id} className="animal-management-card operational-card friendly-mode">
                {/* Column 1: Identity & Issue Highlight */}
                <div className="card-section info-pane highlight-focus">
                  <div className="animal-details">
                    <div className="reporter-head">
                      <h3>{rescue.name}</h3>
                      <span className="contact-pill-friendly">📞 {rescue.mobile}</span>
                    </div>

                    <div className="issue-highlight-box">
                      <span className="issue-label">Incident Description</span>
                      <p className="issue-text-large">{rescue.description}</p>
                    </div>
                  </div>
                </div>

                {/* Column 2: Mission Logistics */}
                <div className="card-section logistics-pane">
                  <div className="logistics-grid">
                    <div className="log-item">
                      <span className="log-label">PRIORITY LEVEL</span>
                      <span className={`log-value priority-tag-${rescue.priority}`} style={{ color: rescue.priority === 'critical' ? '#e11d48' : '#f59e0b', fontWeight: '800' }}>
                        ⚡ {rescue.priority.toUpperCase()}
                      </span>
                    </div>
                    <div className="log-item">
                      <span className="log-label">REPORT DATE</span>
                      <span className="log-value">{new Date(rescue.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="address-banner">
                    <span className="log-label" style={{ marginBottom: '4px', display: 'block' }}>INCIDENT LOCATION</span>
                    📍 {rescue.address}
                  </div>
                </div>

                {/* Column 3: Operation Status & Unified Actions */}
                <div className="card-section action-pane" style={{background: '#fcfdfe'}}>
                   <div className="audit-field-grid">
                      <div className="log-item">
                         <span className="log-label">CURRENT STATUS</span>
                         <div className={`status-label status-${rescue.status}`} style={{width: 'fit-content', marginTop: '5px'}}>
                            ● {rescue.status.toUpperCase()}
                         </div>
                      </div>

                      <div className="log-item">
                         <span className="log-label">UPDATE MISSION</span>
                         <select
                           className={`status-select premium-status-select status-${rescue.status}`}
                           value={rescue.status}
                           onChange={(e) => updateStatus(rescue._id, e.target.value)}
                           style={{ width: '100%', padding: '15px', borderRadius: '15px', border: '1px solid #e2e8f0', fontWeight: '800', background: 'white', color: '#0f172a', fontSize: '0.9rem', cursor: 'pointer', marginTop: '5px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
                         >
                           <option value="pending">Mark Pending</option>
                           <option value="in-progress">In Progress</option>
                           <option value="resolved">Mark Resolved</option>
                         </select>
                      </div>

                      {rescue.status === 'resolved' && (rescue.completionNote || (rescue.completionPhotos && rescue.completionPhotos.length > 0)) && (
                        <div className="log-item">
                           <span className="log-label">RESOLUTION PROOF</span>
                           <button className="premium-action-btn edit" onClick={() => setSelectedRescueProof(rescue)} style={{width: '100%', justifyContent: 'center', background: '#f1f5f9', color: '#475569', marginTop: '5px'}}>
                              <span className="icon">🖼️</span>
                              View Mission Proof
                           </button>
                        </div>
                      )}
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Proof Modal */}
      {selectedRescueProof && (
        <div className="admin-modal-overlay" onClick={() => setSelectedRescueProof(null)}>
          <div className="admin-modal-content proof-modal-wide" onClick={e => e.stopPropagation()}>
             <div className="modal-close-btn" onClick={() => setSelectedRescueProof(null)}>×</div>
             
             <div className="proof-header">
                <span className="receipt-status-badge">MISSION PROOF</span>
                <h2 style={{color: '#0f172a', fontWeight: '900', marginTop: '10px'}}>Resolution Details</h2>
                <p>Report ID: {selectedRescueProof._id.slice(-6).toUpperCase()}</p>
             </div>

             <div className="proof-body" style={{display: 'grid', gridTemplateColumns: selectedRescueProof.completionPhotos?.length > 0 ? '1fr 1fr' : '1fr', gap: '30px', marginTop: '30px'}}>
                {selectedRescueProof.completionPhotos?.length > 0 && (
                   <div className="proof-image-container">
                      <img 
                        src={`http://localhost:5000/uploads/emergency-reports/${selectedRescueProof.completionPhotos[0].replace(/\\/g, '/')}`} 
                        alt="Resolution Evidence" 
                        style={{width: '100%', borderRadius: '20px', boxShadow: '0 15px 30px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9'}}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400?text=Evidence+Image+Not+Found'; }}
                      />
                   </div>
                )}
                <div className="proof-note-container">
                   <h4 className="log-label">COMPLETION NOTE</h4>
                   <div className="issue-highlight-box" style={{background: '#f8fafc', padding: '20px'}}>
                      <p style={{fontSize: '1.1rem', color: '#334155', lineHeight: '1.6'}}>
                        {selectedRescueProof.completionNote || "No text description provided for this resolution."}
                      </p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRescues;
