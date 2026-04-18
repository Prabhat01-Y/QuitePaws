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
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>Adoption Requests</h2>
        <p>Review and approve incoming adoption applications.</p>
      </div>

      <div className="admin-table-container">
        {adoptions.length === 0 ? (
          <div className="admin-empty">No adoption requests found.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Animal</th>
                <th>Date Requested</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {adoptions.map(adoption => (
                <tr key={adoption._id}>
                  <td>
                    <strong>{adoption.name}</strong><br/>
                    <small>{adoption.email || adoption.user?.email || 'No email'}</small>
                  </td>
                  <td>
                     {adoption.animal?.name || 'Unknown Animal'} <br/>
                     <small>{adoption.animal?.breed || ''}</small>
                  </td>
                  <td>{new Date(adoption.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge status-${adoption.status}`}>
                      {adoption.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="action-btn"
                      style={{background: '#f1f5f9', color: '#475569', marginRight: '8px'}}
                      onClick={() => setSelectedAdoption(adoption)}
                    >
                      Review
                    </button>
                    {adoption.status === 'pending' && (
                      <button 
                        className="action-btn btn-approve"
                        onClick={() => updateStatus(adoption._id, 'approved')}
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Details Modal */}
      {selectedAdoption && (
        <div className="modal-overlay" onClick={() => setSelectedAdoption(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Application Review: {selectedAdoption.name}</h2>
              <button className="close-btn" onClick={() => setSelectedAdoption(null)}>&times;</button>
            </div>
            
            <div className="modal-body" style={{padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px'}}>
              
              <div style={{background: '#f8fafc', padding: '15px', borderRadius: '8px'}}>
                <h4 style={{marginBottom: '10px', color: '#1e293b'}}>Applicant Contact</h4>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px'}}>
                  <p><strong>Email:</strong> {selectedAdoption.email}</p>
                  <p><strong>Phone:</strong> {selectedAdoption.mobile}</p>
                  <p style={{gridColumn: '1 / -1'}}><strong>Address:</strong> {selectedAdoption.address}</p>
                </div>
              </div>

              <div style={{background: '#f0fdf4', padding: '15px', borderRadius: '8px', border: '1px solid #bbf7d0'}}>
                <h4 style={{marginBottom: '10px', color: '#166534'}}>Home & Lifestyle Survey</h4>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '14px', color: '#15803d'}}>
                  <p><strong>Home Type:</strong> {selectedAdoption.homeType || 'N/A'}</p>
                  <p><strong>Rent/Own:</strong> {selectedAdoption.rentOrOwn || 'N/A'}</p>
                  <p><strong>Children:</strong> {selectedAdoption.hasChildren || 'N/A'}</p>
                  <p><strong>Existing Pets:</strong> {selectedAdoption.petsCount || 'N/A'}</p>
                  <p><strong>Hours Alone:</strong> {selectedAdoption.hoursAlone ? `${selectedAdoption.hoursAlone} hours` : 'N/A'}</p>
                  <p><strong>Has Yard:</strong> {selectedAdoption.hasYard || 'N/A'}</p>
                  <div style={{gridColumn: '1 / -1', background: 'white', padding: '15px', borderRadius: '8px', marginTop: '5px'}}>
                    <strong style={{display: 'block', marginBottom: '5px'}}>Why they want to adopt:</strong>
                    <p style={{fontStyle: 'italic'}}>{selectedAdoption.intent || 'No answer provided.'}</p>
                  </div>
                </div>
              </div>

            </div>

            <div className="modal-footer" style={{padding: '20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '10px'}}>
              {selectedAdoption.status === 'pending' && (
                <>
                  <button className="action-btn btn-reject" onClick={() => updateStatus(selectedAdoption._id, 'rejected')}>Reject Application</button>
                  <button className="action-btn btn-approve" onClick={() => updateStatus(selectedAdoption._id, 'approved')}>Approve Application</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAdoptions;
