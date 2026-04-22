import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  FaUserFriends, 
  FaUserTag, 
  FaIdCard, 
  FaCalendarCheck, 
  FaEnvelope, 
  FaPhoneAlt,
  FaHistory,
  FaMapMarkerAlt,
  FaCheckCircle
} from 'react-icons/fa';
import './AdminStyles.css';

const ManageVolunteers = () => {
  const { token } = useAuth();
  const [volunteers, setVolunteers] = useState([]);
  const [claimedRescues, setClaimedRescues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);

  const fetchVolunteers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/volunteers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setVolunteers(await res.json());
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

  if (loading) return <div className="admin-loading">Assembling personnel directory...</div>;

  return (
    <div className="admin-page">
      <div className="management-header-clean">
        <div className="header-info">
          <h1>Volunteer Details</h1>
        </div>
      </div>

      {claimedRescues.length > 0 && (
        <div className="table-container-premium activity-table-container">
           <div className="activity-header">
              <FaHistory />
              <span>LIVE FIELD ACTIVITY MANIFEST</span>
           </div>
           <table className="admin-premium-table mini-table">
              <thead>
                <tr>
                  <th>Responsible Personnel</th>
                  <th>Mission Action</th>
                  <th>Incident Location</th>
                  <th style={{ textAlign: 'right' }}>Current Status</th>
                </tr>
              </thead>
              <tbody>
                {claimedRescues.slice(0, 5).map(rescue => (
                  <tr key={rescue._id}>
                    <td>
                      <div className="vol-activity-name">
                        <div className="mini-initials">
                          {rescue.assignedVolunteer?.name?.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span>{rescue.assignedVolunteer?.name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="action-cell">
                        <FaCheckCircle className={`status-icon-mini ${rescue.status}`} />
                        <span>Claimed {rescue.category?.replace('-', ' ')}</span>
                      </div>
                    </td>
                    <td>
                       <div className="loc-cell-mini">
                          <FaMapMarkerAlt />
                          <span>{rescue.address.split(',')[0]}</span>
                       </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                       <span className={`status-pill-table ${rescue.status}`}>
                          {rescue.status.toUpperCase()}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
           </table>
        </div>
      )}

      <div className="table-container-premium fitted mt-large">
        <div className="activity-header">
           <FaUserFriends />
           <span>PERSONNEL REPOSITORY</span>
        </div>
        {volunteers.length === 0 ? (
          <div className="empty-state">
            <FaUserFriends size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
            <h3>No Volunteers Found</h3>
            <p>New personnel registrations will appear here.</p>
          </div>
        ) : (
          <table className="admin-premium-table">
            <thead>
              <tr>
                <th>Volunteer Name</th>
                <th>Working Flexibility</th>
                <th>Member Since</th>
                <th>Contact Details</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((vol) => (
                <tr key={vol._id}>
                  <td>
                    <div className="clickable-name" onClick={() => setSelectedVolunteer(vol)}>
                      <div className="applicant-initials">
                        {vol.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="name-stack">
                        <span className="primary-name">{vol.name}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="role-tag-premium">
                      <FaUserTag />
                      <span>{vol.rolePref || 'General Support'}</span>
                    </div>
                  </td>
                  <td>
                    <div className="submission-date">
                      <FaCalendarCheck />
                      {new Date(vol.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <div className="contact-meta-stack">
                       <div className="meta-row"><FaEnvelope /> {vol.email}</div>
                       <div className="meta-row muted"><FaPhoneAlt /> {vol.mobile}</div>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="table-actions">
                      <button 
                        className="tbl-action-btn sync" 
                        onClick={() => setSelectedVolunteer(vol)}
                        title="View Profile"
                      >
                         <FaIdCard />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedVolunteer && (
        <div className="admin-modal-overlay" onClick={() => setSelectedVolunteer(null)}>
          <div className="review-modal-premium" onClick={e => e.stopPropagation()}>
            <div className="modal-header-premium">
              <div className="header-top">
                <div className="applicant-badge-large">
                  {selectedVolunteer.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="header-titles">
                  <h2>{selectedVolunteer.name}</h2>
                </div>
              </div>
              <button className="close-x" onClick={() => setSelectedVolunteer(null)}>×</button>
            </div>

            <div className="modal-body-scroll">
              <div className="review-section">
                <h3>Identity & Contact</h3>
                <div className="details-grid-premium">
                  <div className="detail-item"><label>Email Address</label><p>{selectedVolunteer.email}</p></div>
                  <div className="detail-item"><label>Phone Number</label><p>{selectedVolunteer.mobile}</p></div>
                </div>
              </div>

              <div className="review-section bg-soft">
                <h3>Working Info</h3>
                <div className="details-grid-premium">
                  <div className="detail-item"><label>Working Flexibility</label><p>{selectedVolunteer.rolePref || 'Not specified'}</p></div>
                  <div className="detail-item"><label>Joined Date</label><p>{new Date(selectedVolunteer.createdAt).toLocaleDateString()}</p></div>
                  <div className="detail-item full"><label>Skills & Interests</label><p>{selectedVolunteer.skills?.join(', ') || 'N/A'}</p></div>
                </div>
              </div>

              <div className="review-section">
                <h3>Work Opted</h3>
                <div className="intent-box">
                  <p>"{selectedVolunteer.experience || 'No experience details provided for this personnel record.'}"</p>
                </div>
              </div>
            </div>

            <div className="modal-footer-premium">
               <button className="add-record-btn-premium active full-width" onClick={() => setSelectedVolunteer(null)}>
                  Close Profile Record
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageVolunteers;