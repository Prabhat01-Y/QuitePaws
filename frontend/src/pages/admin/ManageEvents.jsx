import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AdminStyles.css';
import '../AdminAddAnimal.css'; // Reuse existing polished form styles

const ManageEvents = () => {
  const { token } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '', date: '', location: '', description: '', organizer: '', contact: '', slots: 0
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [token]);

  const fetchEvents = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/events');
      if (res.ok) {
        setEvents(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateSlug = (text) => text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const body = {
        ...formData,
        slug: generateSlug(formData.title) + '-' + Date.now(),
        slots: Number(formData.slots)
      };

      const res = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        const newEvent = await res.json();
        setEvents(prev => [...prev, newEvent]);
        setShowAddForm(false);
        setFormData({ title: '', date: '', location: '', description: '', organizer: '', contact: '', slots: 0 });
      } else {
        const err = await res.json();
        alert(err.message || 'Error creating event');
      }
    } catch (err) {
      alert('Error creating event');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setEvents(events.filter(e => e._id !== id));
      } else {
        const errorData = await res.json();
        alert(`Failed to delete: ${errorData.message || 'Access Denied'}`);
      }
    } catch (err) {
      alert('Error connecting to server for deletion');
    }
  };

  if (loading) return <div className="admin-loading">Loading events...</div>;

  return (
    <div className="admin-page management-view">
      <div className="management-header">
        <div className="header-text">
          <h1>Community <span className="highlight">Events</span></h1>
          <p>You have {events.length} scheduled drives and fundraisers.</p>
        </div>
        <button 
          className="premium-action-btn" 
          style={{ width: 'auto', padding: '12px 24px', background: showAddForm ? '#fca5a5' : '#10b981', color: showAddForm ? '#7f1d1d' : 'white', border: 'none' }} 
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? '✕ Close Form' : '+ Create New Event'}
        </button>
      </div>

      {showAddForm && (
        <div className="admin-add-animal-container" style={{ marginBottom: '30px', maxWidth: '900px', background: 'white', borderRadius: '30px', padding: '40px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
          <h2 style={{fontFamily: 'Outfit', marginBottom: '25px'}}>Configure New Event</h2>
          <form className="admin-form" onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 25px' }}>
              <div className="form-group">
                <label>Event Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Target Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Venue / Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Primary Organizer</label>
                <input type="text" name="organizer" value={formData.organizer} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Contact Details</label>
                <input type="text" name="contact" value={formData.contact} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Max Attendance (0 for unlimited)</label>
                <input type="number" name="slots" value={formData.slots} onChange={handleChange} min="0" required />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: '10px' }}>
              <label>Event Brief / Mission Statement</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="4" required />
            </div>
            <button type="submit" className="confirm-btn" disabled={submitting} style={{marginTop: '20px'}}>
              {submitting ? 'Propagating Event...' : 'Launch Community Event'}
            </button>
          </form>
        </div>
      )}

      <div className="animal-list-container">
        {events.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📅</span>
            <h3>No events found</h3>
            <p>Your scheduled community drives will appear here.</p>
          </div>
        ) : (
          <div className="animal-cards-grid">
            {events.map((event) => (
              <div key={event._id} className="animal-management-card operational-card friendly-mode">
                {/* Column 1: Identity & Description */}
                <div className="card-section info-pane">
                  <div className="animal-details">
                    <div className="reporter-head">
                      <h3 style={{fontSize: '1.4rem'}}>{event.title}</h3>
                      <span className="contact-pill-friendly" style={{background: '#f1f5f9', color: '#475569'}}>👤 {event.organizer}</span>
                    </div>
                    <div className="issue-highlight-box" style={{marginTop: '15px'}}>
                      <span className="issue-label">Mission Brief</span>
                      <p style={{fontSize: '0.95rem', color: '#64748b', lineHeight: '1.5'}}>{event.description}</p>
                    </div>
                  </div>
                </div>

                {/* Column 2: Logistics */}
                <div className="card-section logistics-pane">
                  <div className="audit-field-grid">
                    <div className="log-item">
                      <span className="log-label">DATE & LOCATION</span>
                      <span className="log-value" style={{display: 'block', marginTop: '4px'}}>
                         📅 {new Date(event.date).toLocaleDateString()}
                      </span>
                      <span className="log-value" style={{fontSize: '0.9rem', color: '#64748b', fontWeight: '500'}}>
                         📍 {event.location}
                      </span>
                    </div>
                    <div className="log-item">
                      <span className="log-label">REGISTRATIONS</span>
                      <div className="progress-mini" style={{background: '#f1f5f9', height: '8px', borderRadius: '4px', marginTop: '8px', overflow: 'hidden'}}>
                         <div style={{
                           width: event.slots > 0 ? `${(event.registeredVolunteers?.length / event.slots) * 100}%` : '50%',
                           height: '100%',
                           background: '#aa3bff'
                         }}></div>
                      </div>
                      <span className="log-value" style={{color: '#aa3bff', marginTop: '4px', display: 'block'}}>
                         {event.registeredVolunteers?.length || 0} {event.slots > 0 ? `/ ${event.slots} slots filled` : 'members reserved'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Column 3: Actions */}
                <div className="card-section action-pane" style={{justifyContent: 'center'}}>
                    <div className="log-item">
                       <span className="log-label">MISSION CONTROL</span>
                       <button 
                          onClick={() => handleDelete(event._id)}
                          className="premium-action-btn delete"
                          style={{width: '100%', marginTop: '10px'}}
                       >
                          <span className="icon">🗑️</span>
                          Dissolve Event
                       </button>
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageEvents;
