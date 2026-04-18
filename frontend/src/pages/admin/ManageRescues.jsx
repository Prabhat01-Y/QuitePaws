import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AdminStyles.css';

const ManageRescues = () => {
  const { token } = useAuth();
  const [rescues, setRescues] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRescues = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/rescues', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
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
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>Emergency Rescues</h2>
        <p>Track and update active animal rescue reports.</p>
      </div>

      <div className="admin-table-container">
        {rescues.length === 0 ? (
          <div className="admin-empty">No emergency reports found.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Reporter</th>
                <th>Category</th>
                <th>Location</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rescues.map(rescue => (
                <tr key={rescue._id}>
                  <td>
                    <strong>{rescue.name}</strong><br/>
                    <small>{rescue.mobile}</small>
                  </td>
                  <td style={{textTransform: 'capitalize'}}>{rescue.category.replace('-', ' ')}</td>
                  <td>{rescue.address}</td>
                  <td>
                    <span style={{ 
                      color: rescue.priority === 'critical' ? 'red' : 
                             rescue.priority === 'high' ? 'orange' : 'inherit',
                      fontWeight: 'bold',
                      textTransform: 'capitalize'
                    }}>
                      {rescue.priority}
                    </span>
                  </td>
                  <td>
                    <select 
                      className={`status-select status-${rescue.status}`}
                      value={rescue.status}
                      onChange={(e) => updateStatus(rescue._id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                    
                    {rescue.status === 'resolved' && (rescue.completionNote || (rescue.completionPhotos && rescue.completionPhotos.length > 0)) && (
                      <div className="completion-proof-box">
                        <small><strong>Proof of Rescue:</strong></small>
                        {rescue.completionNote && <p className="admin-rescue-note">"{rescue.completionNote}"</p>}
                        {rescue.completionPhotos && rescue.completionPhotos.length > 0 && (
                          <div className="admin-proof-photos">
                            {rescue.completionPhotos.map((photo, index) => (
                              <img 
                                key={index} 
                                src={`http://localhost:5000/uploads/emergency-reports/${photo}`} 
                                alt="Completion proof" 
                                className="admin-proof-img"
                                onClick={() => window.open(`http://localhost:5000/uploads/emergency-reports/${photo}`, '_blank')}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
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

export default ManageRescues;
