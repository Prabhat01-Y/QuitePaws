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
        alert('Failed to delete event');
      }
    } catch (err) {
      alert('Error deleting event');
    }
  };

  if (loading) return <div className="admin-loading">Loading events...</div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h2>Manage Events & Drives</h2>
          <p>Create and manage community volunteer events.</p>
        </div>
        <button 
          className="admin-submit-btn" 
          style={{ width: 'auto', padding: '10px 20px', marginTop: '0', background: showAddForm ? '#ef4444' : '' }} 
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : '+ Create New Event'}
        </button>
      </div>

      {showAddForm && (
        <div className="admin-add-animal-container" style={{ marginBottom: '30px', maxWidth: '800px' }}>
          <h2>Create New Event</h2>
          <form className="admin-form" onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
              <div className="form-group">
                <label>Event Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Organizer</label>
                <input type="text" name="organizer" value={formData.organizer} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Contact Info</label>
                <input type="text" name="contact" value={formData.contact} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Max Slots (0 for unlimited)</label>
                <input type="number" name="slots" value={formData.slots} onChange={handleChange} min="0" required />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: '10px' }}>
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3" required />
            </div>
            <button type="submit" className="admin-submit-btn" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Event'}
            </button>
          </form>
        </div>
      )}

      <div className="admin-table-container">
        {events.length === 0 ? (
          <div className="admin-empty">No events scheduled.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date & Location</th>
                <th>Registrations</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event._id}>
                  <td><strong>{event.title}</strong><br /><small>{event.organizer}</small></td>
                  <td>{event.date}<br /><small>📍 {event.location}</small></td>
                  <td>
                    <span style={{ fontWeight: 'bold', color: '#aa3bff' }}>
                      {event.registeredVolunteers?.length || 0}
                    </span>
                    {event.slots > 0 ? ` / ${event.slots}` : ' reserved'}
                  </td>
                  <td>
                    <button 
                      onClick={() => handleDelete(event._id)}
                      className="admin-btn-delete"
                      style={{ padding: '6px 10px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
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

export default ManageEvents;
