import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
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
    <>
      <div className="admin-page management-view">
        {/* Premium Dashboard Header */}
        <div className="management-header">
          <div className="header-text">
            <h1>Volunteer <span className="highlight">Roster</span></h1>
            <p>A complete list of registered community heroes.</p>
          </div>
        </div>

        {/* Premium Rescue Activity Notifications */}
        {claimedRescues.length > 0 && (
          <div className="activity-feed">
            <h3 className="section-title">🔔 Recent Field Activity</h3>
            <div className="activity-grid">
              {claimedRescues.map(rescue => (
                <div key={rescue._id} className="activity-card">
                  <div className="activity-main">
                    <span className="activity-badge">MISSION CLAIMED</span>
                    <p>
                      <b>{rescue.assignedVolunteer?.name || 'A volunteer'}</b> has opted in for the <b>{rescue.category?.replace('-', ' ')}</b> rescue in <b>{rescue.address.split(',')[0]}</b>.
                    </p>
                  </div>
                  <div className={`status-label status-${rescue.status}`}>
                     ● {rescue.status.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="animal-list-container">
          {volunteers.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">👥</span>
              <h3>Waiting for heroes</h3>
              <p>New volunteer registrations will appear here for verification.</p>
            </div>
          ) : (
            <div className="animal-cards-grid">
              {volunteers.map((vol) => (
                <div key={vol._id} className="animal-management-card">
                  <div className="card-main-info no-image">
                    <div className="animal-details">
                      <h3>{vol.name}</h3>
                      <p className="breed-tag"><b>{vol.type || 'Community'}</b> Volunteer • Joined {new Date(vol.createdAt).toLocaleDateString()}</p>
                      <div className="meta-info">
                        <span className="meta-item">📞 {vol.mobile}</span>
                        <span className="separator">•</span>
                        <span className="meta-item">📧 {vol.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="status-and-fee">
                     <div className="status-label available" style={{background: '#f1f5f9', color: '#1e293b'}}>
                        {vol.rolePref || 'General'}
                     </div>
                     <div className="fee-tag">{vol.experience?.length > 40 ? vol.experience.substring(0, 40) + '...' : vol.experience}</div>
                  </div>

                  <div className="card-actions-group">
                     <button className="premium-action-btn edit" onClick={() => setSelectedVolunteer(vol)}>
                        <span className="icon">👤</span>
                        View Profile
                     </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Volunteer Profile Modal */}
      {selectedVolunteer && (
        <div className="admin-modal-overlay" onClick={() => setSelectedVolunteer(null)}>
           <div className="admin-modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-close-btn" onClick={() => setSelectedVolunteer(null)}>×</div>
              
              <div className="profile-modal-head">
                 <div className="profile-avatar-large">👤</div>
                 <div className="profile-title-area">
                    <h2>{selectedVolunteer.name}</h2>
                    <p>{selectedVolunteer.type?.toUpperCase()} VOLUNTEER</p>
                 </div>
              </div>

              <div className="profile-detail-grid">
                 <div className="detail-block">
                    <h4>CONTACT NUMBER</h4>
                    <p>{selectedVolunteer.mobile}</p>
                 </div>
                 <div className="detail-block">
                    <h4>EMAIL ADDRESS</h4>
                    <p>{selectedVolunteer.email}</p>
                 </div>
                 <div className="detail-block">
                    <h4>PREFERRED ROLE</h4>
                    <p>{selectedVolunteer.rolePref || 'General Support'}</p>
                 </div>
                 <div className="detail-block">
                    <h4>MEMBER SINCE</h4>
                    <p>{new Date(selectedVolunteer.createdAt).toLocaleDateString()}</p>
                 </div>
              </div>

              <div className="profile-bio">
                 <h4 className="log-label" style={{color: '#94a3b8', fontSize: '0.7rem', marginBottom: '10px'}}>EXPERIENCE & BACKGROUND</h4>
                 <p>{selectedVolunteer.experience || 'No experience details provided.'}</p>
              </div>


           </div>
        </div>
      )}
    </>
  );
};

export default ManageVolunteers;
