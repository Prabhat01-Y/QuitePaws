import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AdminStyles.css';

const ManageDonations = () => {
  const { token } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDonation, setSelectedDonation] = useState(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/donations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setDonations(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [token]);

  if (loading) return <div className="admin-loading">Loading donations...</div>;

  const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <>
      <div className="admin-page management-view">
        {/* Premium Dashboard Header */}
        <div className="management-header">
          <div className="header-text">
            <h1>Donation <span className="highlight">History</span></h1>
            <p>Monitor and audit all financial contributions from the community.</p>
          </div>
        </div>

        <div className="metrics-hub" style={{marginTop: '20px'}}>
          <div className="metrics-grid-expansive">
            <div className="glass-metric-card">
              <div className="m-header">
                 <span>Total Contributions</span>
                 <div className="icon-wrap">💰</div>
              </div>
              <h2>₹{totalAmount.toLocaleString()}</h2>
              <p className="metric-subtext" style={{color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600}}>Lifetime platform impact</p>
            </div>

            <div className="glass-metric-card">
              <div className="m-header">
                 <span>Donation Count</span>
                 <div className="icon-wrap">📈</div>
              </div>
              <h2>{donations.length}</h2>
              <p className="metric-subtext" style={{color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600}}>Individual community gifts</p>
            </div>
          </div>
        </div>

        <div className="animal-list-container">
          {donations.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">💸</span>
              <h3>No donations yet</h3>
              <p>Once supporters contribute, their gift history will appear here.</p>
            </div>
          ) : (
            <div className="animal-cards-grid" style={{marginTop: '40px'}}>
            {donations.map((donation) => (
              <div key={donation._id} className="animal-management-card operational-card friendly-mode donation-audit-row">
                {/* Column 1: Member Identity */}
                <div className="card-section info-pane">
                  <div className="animal-details">
                    <div className="reporter-head">
                       <h3>{donation.donorName}</h3>
                       <span className="contact-pill-friendly">📧 {donation.donorEmail}</span>
                    </div>
                  </div>
                </div>

                {/* Column 2: Audit Logistics */}
                <div className="card-section logistics-pane">
                   <div className="audit-field-grid">
                      <div className="field-row">
                         <span className="log-label">DONATION DATE</span>
                         <span className="log-value">{new Date(donation.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="field-row">
                         <span className="log-label">TRANSACTION STATUS</span>
                         <div className="status-label" style={{background: '#ecfdf5', color: '#059669', border: 'none', width: 'fit-content', padding: '6px 15px', borderRadius: '50px', fontWeight: '800', fontSize: '0.75rem', marginLeft: '-8px'}}>
                            ● COMPLETED
                         </div>
                      </div>
                   </div>
                </div>

                {/* Column 3: Financial Record & Actions */}
                <div className="card-section action-pane">
                   <div className="financial-focus">
                      <span className="log-label">TOTAL CONTRIBUTION</span>
                      <h3 style={{fontSize: '2.2rem', color: '#059669', margin: '5px 0 20px 0'}}>₹{donation.amount.toLocaleString()}</h3>
                   </div>

                   <button className="premium-action-btn edit" onClick={() => setSelectedDonation(donation)} style={{width: '100%', justifyContent: 'center'}}>
                      <span className="icon">📄</span>
                      Review Receipt
                   </button>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </div>

      {/* Donation Receipt Modal */}
      {selectedDonation && (
        <div className="admin-modal-overlay" onClick={() => setSelectedDonation(null)}>
           <div className="admin-modal-content digital-receipt" onClick={e => e.stopPropagation()}>
              <div className="modal-close-btn" onClick={() => setSelectedDonation(null)}>×</div>
              
              <div className="receipt-header">
                 <span className="receipt-logo">QuietPaws</span>
                 <span className="receipt-status-badge">TRANSACTION SUCCESSFUL</span>
              </div>

              <div className="receipt-body">
                 <div className="receipt-line">
                    <span>DONOR NAME</span>
                    <span>{selectedDonation.donorName}</span>
                 </div>
                 <div className="receipt-line">
                    <span>EMAIL ADDRESS</span>
                    <span>{selectedDonation.donorEmail}</span>
                 </div>
                 <div className="receipt-line">
                    <span>PAYMENT METHOD</span>
                    <span>{selectedDonation.paymentMethod || 'Online Transaction'}</span>
                 </div>
                 <div className="receipt-line">
                    <span>TRANSACTION DATE</span>
                    <span>{new Date(selectedDonation.createdAt).toLocaleString()}</span>
                 </div>
                 <div className="receipt-line">
                    <span>TRANSACTION ID</span>
                    <span style={{fontSize: '0.8rem', color: '#64748b'}}>{selectedDonation._id}</span>
                 </div>
              </div>

              <div className="receipt-total">
                 <span>TOTAL CONTRIBUTION</span>
                 <h3>₹{selectedDonation.amount.toLocaleString()}</h3>
              </div>

              <div className="receipt-footer">
                 <p>Tax saving receipt generated for audit purposes.</p>
                 <p style={{fontSize: '0.7rem', marginTop: '10px'}}>Questpaws Animal Welfare Foundation • Reg No: AF-2024-QPW</p>
              </div>
           </div>
        </div>
      )}
    </>
  );
};

export default ManageDonations;
