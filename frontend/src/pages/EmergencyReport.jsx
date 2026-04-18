import React, { useState } from 'react';
import MapPicker from '../components/MapPicker';
import './EmergencyReport.css';

const EmergencyReport = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    description: '',
    category: '',
    priority: 'medium',
    photo: null
  });
  const [recentReports, setRecentReports] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch recent reports on mount
  React.useEffect(() => {
    fetch('http://localhost:5000/api/emergency-reports')
      .then(r => r.ok ? r.json() : [])
      .then(data => setRecentReports(Array.isArray(data) ? data.slice(0, 4) : []))
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) setFormData({ ...formData, photo: file });
  };

  const handleLocationSelect = React.useCallback((loc) => {
    setFormData((prev) => {
      if (prev.location?.lat === loc.lat && prev.location?.lng === loc.lng) return prev;
      return { ...prev, location: loc };
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('mobile', formData.mobile);
      submitData.append('address', formData.address);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('priority', formData.priority);
      if (formData.location) {
        submitData.append('lat', formData.location.lat);
        submitData.append('lng', formData.location.lng);
      }
      if (formData.photo) submitData.append('photo', formData.photo);

      const response = await fetch('http://localhost:5000/api/emergency-reports', {
        method: 'POST',
        body: submitData
      });
      const data = await response.json();

      if (response.ok || data.success) {
        setStatus('success');
        setFormData({ name: '', email: '', mobile: '', address: '', description: '', category: '', priority: 'medium', photo: null });
        // Re-fetch recent reports
        fetch('http://localhost:5000/api/emergency-reports')
          .then(r => r.json())
          .then(d => setRecentReports(Array.isArray(d) ? d.slice(0, 4) : []));
        setTimeout(() => setStatus(''), 4000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const categoryLabel = (cat) => {
    const map = { 'injured-animal': 'Injured', 'stray-animal': 'Stray', 'animal-abuse': 'Abuse', 'lost-pet': 'Lost', 'wildlife-issue': 'Wildlife', 'other': 'Other' };
    return map[cat] || cat;
  };

  return (
    <div className="er-page">
      <div className="er-container">

        {/* LEFT: Report Form */}
        <div className="er-form-card">
          <div className="er-form-header">
            <span className="er-badge">🚨 URGENT</span>
            <h2>Report Injured Animal</h2>
            <div className="er-divider"></div>
          </div>

          <form onSubmit={handleSubmit} className="er-form">

            <div className="er-field">
              <label>Animal Type *</label>
              <select name="category" value={formData.category} onChange={handleChange} required>
                <option value="">Select animal type...</option>
                <option value="injured-animal">Injured Animal</option>
                <option value="stray-animal">Stray Animal</option>
                <option value="animal-abuse">Animal Abuse</option>
                <option value="lost-pet">Lost Pet</option>
                <option value="wildlife-issue">Wildlife Issue</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="er-field">
              <label>Description of Injury/Condition *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Please describe the animal's condition in detail..."
                rows={4}
                required
              />
            </div>

            <div className="er-field-row">
              <div className="er-field">
                <label>Your Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full name" required />
              </div>
              <div className="er-field">
                <label>Mobile *</label>
                <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="+91 XXXXX XXXXX" required />
              </div>
            </div>

            <div className="er-field-row">
              <div className="er-field">
                <label>Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" required />
              </div>
              <div className="er-field">
                <label>Priority</label>
                <select name="priority" value={formData.priority} onChange={handleChange}>
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🟠 High</option>
                  <option value="critical">🔴 Critical</option>
                </select>
              </div>
            </div>

            <div className="er-field">
              <label>Location / Address *</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Where did you see the animal?" required />
            </div>

            <MapPicker onLocationSelect={handleLocationSelect} />

            <div className="er-field er-photo-field">
              <label>📸 Upload Photo (Optional)</label>
              <input type="file" id="er-photo" name="photo" onChange={handlePhotoChange} accept="image/*" />
              <label htmlFor="er-photo" className="er-photo-btn">
                {formData.photo ? `✅ ${formData.photo.name}` : 'Choose File'}
              </label>
            </div>

            {status === 'success' && <div className="er-status success">✅ Report submitted! Our volunteers will respond soon.</div>}
            {status === 'error' && <div className="er-status error">❌ Something went wrong. Please try again.</div>}

            <button type="submit" className="er-submit" disabled={loading}>
              {loading ? 'Submitting...' : '🚑 Submit Emergency Report'}
            </button>
          </form>
        </div>

        {/* RIGHT: Recent Reports */}
        <div className="er-sidebar">
          <h3>Recent Reports</h3>
          <div className="er-sidebar-divider"></div>

          {recentReports.length === 0 ? (
            <p className="er-no-reports">No recent reports in your area.</p>
          ) : (
            recentReports.map(report => (
              <div key={report._id} className="er-report-card">
                {report.photo && (
                  <img
                    src={`http://localhost:5000/uploads/emergency-reports/${report.photo}`}
                    alt="Report"
                    className="er-report-img"
                  />
                )}
                <div className="er-report-body">
                  <span className={`er-report-badge priority-${report.priority}`}>{categoryLabel(report.category)}</span>
                  <p className="er-report-desc">{report.description?.slice(0, 100)}...</p>
                  <div className="er-report-meta">
                    <span>🕐 {new Date(report.createdAt).toLocaleDateString()}</span>
                    <span>📍 {report.address?.slice(0, 30)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default EmergencyReport;
