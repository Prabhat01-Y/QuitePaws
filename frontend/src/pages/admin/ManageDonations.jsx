import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AdminStyles.css';

const ManageDonations = () => {
  const { token } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>Donation History</h2>
        <p>Monitor all financial contributions from the community.</p>
      </div>

      <div className="admin-stats-strip">
        <div className="stat-card">
          <small>Total Contributions</small>
          <h3>₹{totalAmount.toLocaleString()}</h3>
        </div>
        <div className="stat-card">
          <small>Donation Count</small>
          <h3>{donations.length}</h3>
        </div>
      </div>

      <div className="admin-table-container">
        {donations.length === 0 ? (
          <div className="admin-empty">No donations recorded yet.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Donor</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation) => (
                <tr key={donation._id}>
                  <td>
                    <strong>{donation.donorName}</strong><br/>
                    <small style={{ color: '#64748b' }}>{donation.donorEmail}</small>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#059669' }}>
                      ₹{donation.amount.toLocaleString()}
                    </span>
                  </td>
                  <td>{donation.paymentMethod}</td>
                  <td>{new Date(donation.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className="status-badge status-resolved">
                      {donation.status || 'Completed'}
                    </span>
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

export default ManageDonations;
