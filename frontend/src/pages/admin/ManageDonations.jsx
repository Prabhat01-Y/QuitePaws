import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  FaHandHoldingHeart,
  FaRegCalendarAlt,
  FaRupeeSign,
  FaReceipt,
  FaEnvelope,
  FaFileInvoiceDollar,
  FaHistory
} from 'react-icons/fa';
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
          setDonations(await res.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, [token]);

  if (loading) return <div className="admin-loading">Assembling financial audit records...</div>;

  const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="admin-page">
      <div className="management-header-clean">
        <div className="header-info">
          <h1>Donation Details</h1>
        </div>
      </div>

      <div className="financial-summary-banner-premium">
        <div className="summary-card-mini">
          <div className="icon-box-mini success"><FaHandHoldingHeart /></div>
          <div className="data-box-mini">
            <label>Total Contributions</label>
            <h3>₹{totalAmount.toLocaleString()}</h3>
          </div>
        </div>
        <div className="summary-card-mini">
          <div className="icon-box-mini info"><FaHistory /></div>
          <div className="data-box-mini">
            <label>Transaction Count</label>
            <h3>{donations.length}</h3>
          </div>
        </div>
      </div>

      <div className="table-container-premium fitted">
        {donations.length === 0 ? (
          <div className="empty-state">
            <FaHandHoldingHeart size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
            <h3>No Contributions Yet</h3>
            <p>Your donor history will be archived here.</p>
          </div>
        ) : (
          <table className="admin-premium-table">
            <thead>
              <tr>
                <th>Donor Information</th>
                <th>Transaction Date</th>
                <th>Donation Amount</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation) => (
                <tr key={donation._id}>
                  <td>
                    <div className="donor-cell-premium" onClick={() => setSelectedDonation(donation)}>
                      <div className="applicant-initials">
                        {donation.donorName?.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="name-stack">
                        <span className="primary-name">{donation.donorName}</span>
                        <span className="meta-row"><FaEnvelope size={10} /> {donation.donorEmail}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="submission-date">
                      <FaRegCalendarAlt />
                      {new Date(donation.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </td>
                  <td>
                    <div className="currency-pill large">
                      <FaRupeeSign />
                      <span>{donation.amount.toLocaleString()}</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="table-actions">
                      <button
                        className="tbl-action-btn sync"
                        onClick={() => setSelectedDonation(donation)}
                        title="View Financial Receipt"
                      >
                        <FaFileInvoiceDollar />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedDonation && (
        <div className="admin-modal-overlay" onClick={() => setSelectedDonation(null)}>
          <div className="review-modal-premium" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header-premium">
              <div className="header-top">
                <div className="icon-box-modal"><FaReceipt /></div>
                <div className="header-titles">
                  <h2>Transaction Receipt</h2>
                  <p>Internal Financial Audit Copy</p>
                </div>
              </div>
              <button className="close-x" onClick={() => setSelectedDonation(null)}>×</button>
            </div>

            <div className="receipt-container-premium">
              <div className="receipt-watermark">QUIETPAWS FINANCIALS</div>

              <div className="receipt-section">
                <div className="receipt-row-premium">
                  <label>DONOR IDENTITY</label>
                  <p>{selectedDonation.donorName}</p>
                </div>
                <div className="receipt-row-premium">
                  <label>EMAIL ADDRESS</label>
                  <p>{selectedDonation.donorEmail}</p>
                </div>
                <div className="receipt-row-premium">
                  <label>TRANSACTION DATE</label>
                  <p>{new Date(selectedDonation.createdAt).toLocaleString()}</p>
                </div>
                <div className="receipt-row-premium">
                  <label>INTERNAL REFERENCE ID</label>
                  <p className="mono">{selectedDonation._id}</p>
                </div>
              </div>

              <div className="receipt-total-section">
                <span className="total-label">FUNDS ALLOCATED</span>
                <div className="total-amount-box">
                  <FaRupeeSign />
                  <span>{selectedDonation.amount.toLocaleString()}</span>
                </div>
              </div>

              <div className="receipt-footer-text">
                This record confirms successful procurement of community contribution funds.
              </div>
            </div>

            <div className="modal-footer-premium">
              <button className="add-record-btn-premium active full-width" onClick={() => setSelectedDonation(null)}>
                Close Audit Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDonations;