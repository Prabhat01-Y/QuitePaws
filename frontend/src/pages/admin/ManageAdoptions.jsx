import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  FaUser, 
  FaPaw, 
  FaCalendarCheck, 
  FaEnvelope, 
  FaEye,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
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
        setAdoptions(await res.json());
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

  if (loading) return <div className="admin-loading">Assembling application queue...</div>;

  return (
    <div className="admin-page">
      <div className="management-header-clean">
        <div className="header-info">
          <h1>Adoption Requests</h1>
        </div>
      </div>

      <div className="table-container-premium fitted">
        {adoptions.length === 0 ? (
          <div className="empty-state">
            <FaUser size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
            <h3>Applications Clear</h3>
            <p>New adoption requests will appear here as they arrive.</p>
          </div>
        ) : (
          <table className="admin-premium-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Interested In</th>
                <th>Submitted</th>
                <th>Status</th>
                <th>Email Contact</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {adoptions.map((adoption) => (
                <tr key={adoption._id}>
                  <td>
                    <div className="clickable-name" onClick={() => setSelectedAdoption(adoption)}>
                      <span className="applicant-initials">
                        {adoption.name.split(' ').map(n => n[0]).join('')}
                      </span>
                      <span>{adoption.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="animal-interest-tag">
                      <FaPaw className="mini-icon" />
                      <span>{adoption.animal?.name || 'Inquiry'}</span>
                    </div>
                  </td>
                  <td>
                    <div className="submission-date">
                      <FaCalendarCheck className="mini-icon" />
                      {new Date(adoption.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <span className={`status-pill-table ${adoption.status}`}>
                      {adoption.status}
                    </span>
                  </td>
                  <td>
                    <div className="email-meta">
                      <FaEnvelope className="mini-icon" />
                      {adoption.email}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="table-actions">
                      <button 
                        className="tbl-action-btn sync" 
                        onClick={() => setSelectedAdoption(adoption)}
                        title="Review Details"
                      >
                        <FaEye />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedAdoption && (
        <div className="admin-modal-overlay" onClick={() => setSelectedAdoption(null)}>
          <div className="review-modal-premium" onClick={e => e.stopPropagation()}>
            <div className="modal-header-premium">
              <div className="header-top">
                <div className="applicant-badge-large">
                  {selectedAdoption.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="header-titles">
                  <h2>{selectedAdoption.name}</h2>
                  <p>Application Review • {new Date(selectedAdoption.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <button className="close-x" onClick={() => setSelectedAdoption(null)}>×</button>
            </div>

            <div className="modal-body-scroll">
              <div className="review-section">
                <h3>Contact & Location</h3>
                <div className="details-grid-premium">
                  <div className="detail-item">
                    <label>Email Address</label>
                    <p>{selectedAdoption.email}</p>
                  </div>
                  <div className="detail-item">
                    <label>Phone Number</label>
                    <p>{selectedAdoption.mobile}</p>
                  </div>
                  <div className="detail-item full">
                    <label>Physical Address</label>
                    <p>{selectedAdoption.address}</p>
                  </div>
                </div>
              </div>

              <div className="review-section bg-soft">
                <h3>Environmental Check</h3>
                <div className="details-grid-premium">
                  <div className="detail-item"><label>Home Type</label><p>{selectedAdoption.homeType}</p></div>
                  <div className="detail-item"><label>Ownership</label><p>{selectedAdoption.rentOrOwn}</p></div>
                  <div className="detail-item"><label>Has Children</label><p>{selectedAdoption.hasChildren}</p></div>
                  <div className="detail-item"><label>Existing Pets</label><p>{selectedAdoption.petsCount}</p></div>
                  <div className="detail-item"><label>Yard Access</label><p>{selectedAdoption.hasYard}</p></div>
                  <div className="detail-item"><label>Home Alone (hrs)</label><p>{selectedAdoption.hoursAlone}</p></div>
                </div>
              </div>

              <div className="review-section">
                <h3>Vetting Statement</h3>
                <div className="intent-box">
                  <p>"{selectedAdoption.intent || 'No statement provided.'}"</p>
                </div>
              </div>
            </div>

            <div className="modal-footer-premium">
              {selectedAdoption.status === 'pending' ? (
                <div className="decision-actions">
                  <button className="action-pill-btn danger" onClick={() => updateStatus(selectedAdoption._id, 'rejected')}>
                    <FaTimesCircle /> Reject Application
                  </button>
                  <button className="add-record-btn-premium active" onClick={() => updateStatus(selectedAdoption._id, 'approved')}>
                    <FaCheckCircle /> Approve Adoption
                  </button>
                </div>
              ) : (
                <div className="finalized-status">
                   Current Status: <span className={`status-pill-table ${selectedAdoption.status}`}>{selectedAdoption.status.toUpperCase()}</span>
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