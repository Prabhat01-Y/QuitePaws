import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './UserProfile.css';

const UserProfile = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchMyAdoptions = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/adoptions/my-requests', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setAdoptions(data);
        }
      } catch (err) {
        console.error("Error fetching adoptions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyAdoptions();
  }, [token, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved': return <span className="status-badge approved">Approved</span>;
      case 'rejected': return <span className="status-badge rejected">Rejected</span>;
      default: return <span className="status-badge pending">Pending Review</span>;
    }
  };

  if (loading) return <div className="profile-loading">Loading your profile...</div>;

  return (
    <div className="profile-page-wrapper">
      <div className="profile-container">
        
        {/* Sidebar */}
        <aside className="profile-sidebar">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <h3>{user?.name || 'User'}</h3>
            <p>{user?.email}</p>
            <span className="role-tag">Community Member</span>
          </div>
          
          <nav className="profile-nav">
            <button className="nav-btn active">📝 My Adoptions</button>
            <button className="nav-btn" onClick={handleLogout} style={{color: '#dc2626'}}>🚪 Logout</button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="profile-content">
          <div className="content-header">
            <h2>Your Adoption Journey</h2>
            <p>Track the status of your adoption applications in real-time.</p>
          </div>

          <div className="adoptions-list">
            {adoptions.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">🐾</span>
                <h4>No adoption requests yet</h4>
                <p>Ready to give an animal a loving home?</p>
                <button onClick={() => navigate('/adopt')} className="primary-btn">View Animals</button>
              </div>
            ) : (
              adoptions.map(req => (
                <div key={req._id} className="adoption-card">
                  <div className="pet-info">
                    {req.animal?.image ? (
                      <img src={`http://localhost:5000/uploads/animals/${req.animal.image}`} alt={req.animal.name} className="pet-thumbnail" />
                    ) : (
                      <div className="pet-placeholder">🐾</div>
                    )}
                    <div>
                      <h4 className="pet-name">{req.animal?.name || 'Unknown Pet'}</h4>
                      <p className="pet-breed">{req.animal?.breed || 'Unknown Breed'}</p>
                      <small className="app-date">Applied on {new Date(req.createdAt).toLocaleDateString()}</small>
                    </div>
                  </div>
                  
                  <div className="status-container">
                    {getStatusBadge(req.status)}
                    {req.status === 'approved' && (
                      <p className="approval-text">Check your email for next steps!</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </main>

      </div>
    </div>
  );
};

export default UserProfile;
