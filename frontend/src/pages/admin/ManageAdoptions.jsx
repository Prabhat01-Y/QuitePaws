import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AdminStyles.css';

const ManageAdoptions = () => {
  const { token } = useAuth();
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedAdoption, setSelectedAdoption] = useState(null);

  const fetchAdoptions = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/adoptions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAdoptions(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdoptions();
  }, [token]);

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/adoptions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (res.ok) {
        setAdoptions(adoptions.map(ad => ad._id === id ? { ...ad, status: newStatus } : ad));
        setSelectedAdoption(null);
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      alert('Error updating status');
    }
  };

  if (loading) return <div className="admin-loading">Loading adoptions...</div>;

  return (
    <div className="admin-page management-view">
      {/* Premium Dashboard Header */}
      <div className="management-header">
        <div className="header-text">
          <h1>Adoption <span className="highlight">Requests</span></h1>
          <p>You have {adoptions.length} pending and processed applications.</p>
        </div>
      </div>

      <div className="animal-list-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Syncing applications...</p>
          </div>
        ) : adoptions.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📂</span>
            <h3>No applications found</h3>
            <p>Incoming adoption requests will appear here for review.</p>
          </div>
        ) : (
          <div className="animal-cards-grid">
            {adoptions.map((adoption) => (
              <div key={adoption._id} className="animal-management-card">
                <div className="card-main-info no-image">
                  <div className="animal-details">
                    <h3>{adoption.name}</h3>
                    <p className="breed-tag">Interested in: <b>{adoption.animal?.name || 'Unknown Animal'}</b></p>
                    <div className="meta-info">
                      <span className="meta-item">📅 {new Date(adoption.createdAt).toLocaleDateString()}</span>
                      <span className="separator">•</span>
                      <span className="meta-item">📍 {adoption.location || 'Not provided'}</span>
                    </div>
                  </div>
                </div>

                <div className="status-and-fee">
                   <div className={`status-label status-${adoption.status}`}>
                     ● {adoption.status.toUpperCase()}
                   </div>
                   <div className="fee-tag">{adoption.email}</div>
                </div>

                <div className="card-actions-group">
                  <button className="premium-action-btn edit" onClick={() => setSelectedAdoption(adoption)}>
                    <span className="icon">📋</span>
                    Review Application
                  </button>
                  {adoption.status === 'pending' && (
                    <button className="premium-action-btn delete" style={{background: '#ecfdf5', color: '#059669', borderColor: '#d1fae5'}} onClick={() => updateStatus(adoption._id, 'approved')}>
                      <span className="icon">✅</span>
                      Quick Approve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Premium Review Modal */}
      {selectedAdoption && (
        <div className="modal-overlay" onClick={() => setSelectedAdoption(null)}>
          <div className="modal-content review-modal" onClick={e => e.stopPropagation()}>
            <div className="review-header">
              <div className="applicant-id">
                <span className="badge">REQUEST ID: {selectedAdoption._id.slice(-6).toUpperCase()}</span>
                <h2>{selectedAdoption.name}</h2>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedAdoption(null)}>&times;</button>
            </div>

            <div className="review-body">
              <div className="review-section contact-info-premium">
                <h4><span className="icon">👤</span> Applicant Identity & Reach</h4>
                <div className="stylish-contact-list">
                  <div className="contact-row">
                    <span className="label-bold">Mail:</span>
                    <span className="value-prominent">{selectedAdoption.email}</span>
                  </div>
                  <div className="contact-row">
                    <span className="label-bold">contact:</span>
                    <span className="value-prominent">{selectedAdoption.mobile}</span>
                  </div>
                  <div className="contact-row">
                    <span className="label-bold">Address:</span>
                    <span className="value-prominent">{selectedAdoption.address}</span>
                  </div>
                </div>
              </div>

              <div className="review-section survey-info">
                <h4><span className="icon">🏡</span> Home & Lifestyle Survey</h4>
                <div className="survey-tags">
                  <div className="survey-pill"><span>Home Type:</span> {selectedAdoption.homeType || 'N/A'}</div>
                  <div className="survey-pill"><span>Ownership:</span> {selectedAdoption.rentOrOwn || 'N/A'}</div>
                  <div className="survey-pill"><span>Children:</span> {selectedAdoption.hasChildren || 'N/A'}</div>
                  <div className="survey-pill"><span>Existing Pets:</span> {selectedAdoption.petsCount || 'N/A'}</div>
                  <div className="survey-pill"><span>Daily Separation:</span> {selectedAdoption.hoursAlone || '0'} hrs</div>
                  <div className="survey-pill"><span>Garden/Yard:</span> {selectedAdoption.hasYard || 'N/A'}</div>
                </div>
                
                <div className="intent-box">
                  <h5>Statement of Intent:</h5>
                  <p>"{selectedAdoption.intent || 'No statement provided.'}"</p>
                </div>
              </div>

              <div className="animal-preview-section">
                <span>Application for:</span>
                <div className="animal-mini-card">
                  <span className="icon">🐾</span>
                  <div>
                    <strong>{selectedAdoption.animal?.name || 'Unknown'}</strong>
                    <small>{selectedAdoption.animal?.breed || 'N/A'}</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="review-footer">
              {selectedAdoption.status === 'pending' ? (
                <div className="decision-bar">
                  <button className="reject-btn" onClick={() => updateStatus(selectedAdoption._id, 'rejected')}>Reject Application</button>
                  <button className="approve-btn" onClick={() => updateStatus(selectedAdoption._id, 'approved')}>Approve Application</button>
                </div>
              ) : (
                <div className="finalized-status">
                   Application has been <b>{selectedAdoption.status}</b>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAdoptions;
