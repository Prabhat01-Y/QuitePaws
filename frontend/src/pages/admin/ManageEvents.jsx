import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaUsers, 
  FaTrashAlt, 
  FaPlusCircle,
  FaCalendarDay,
  FaInfoCircle,
  FaEnvelope,
  FaPhoneAlt
} from 'react-icons/fa';
import './AdminStyles.css';

const ManageEvents = () => {
  const { token } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewDetails, setViewDetails] = useState(null);
  const [viewVolunteers, setViewVolunteers] = useState(null);
  const [formData, setFormData] = useState({
    title: '', date: '', location: '', description: '', organizer: '', contact: '', slots: 0
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEvents();
    
    const openModal = () => setShowAddModal(true);
    window.addEventListener('open-add-event-modal', openModal);
    return () => window.removeEventListener('open-add-event-modal', openModal);
  }, [token]);

  const fetchEvents = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/events');
      if (res.ok) setEvents(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const generateSlug = (text) => text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const body = { ...formData, slug: generateSlug(formData.title) + '-' + Date.now(), slots: Number(formData.slots) };
      const res = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        const newEvent = await res.json();
        setEvents(prev => [...prev, newEvent]);
        setShowAddModal(false);
        setFormData({ title: '', date: '', location: '', description: '', organizer: '', contact: '', slots: 0 });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setEvents(events.filter(e => e._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="admin-loading">Preparing event schedule...</div>;

  return (
    <div className="admin-page">
      <div className="management-header-clean">
        <div className="header-info">
          <h1>Community Events</h1>
        </div>
      </div>

      <div className="table-container-premium fitted">
        {events.length === 0 ? (
          <div className="empty-state">
            <FaCalendarAlt size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
            <h3>No Scheduled Events</h3>
            <p>Ready to organize your first health camp or drive?</p>
          </div>
        ) : (
          <table className="admin-premium-table">
            <thead>
              <tr>
                <th>Event Title</th>
                <th>Date & Location</th>
                <th>Engagement</th>
                <th>Organizer</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id}>
                  <td>
                    <div className="event-title-cell interactive" onClick={() => setViewDetails(event)}>
                      <FaCalendarDay className="event-icon" />
                      <div className="title-desc">
                        <span className="main-title">{event.title}</span>
                        <span className="desc-preview">{event.description.substring(0, 50)}...</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="meta-stack">
                      <div className="meta-row"><FaCalendarAlt /> {new Date(event.date).toLocaleDateString()}</div>
                      <div className="meta-row muted"><FaMapMarkerAlt /> {event.location}</div>
                    </div>
                  </td>
                  <td>
                    <div className="engagement-pill interactive" onClick={() => setViewVolunteers(event)}>
                      <FaUsers />
                      <span>{event.registeredVolunteers?.length || 0} / {event.slots > 0 ? event.slots : '∞'}</span>
                    </div>
                  </td>
                  <td>
                    <span className="organizer-text">{event.organizer || 'QuietPaws'}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="table-actions">
                      <button 
                        className="tbl-action-btn sync" 
                        onClick={() => setViewDetails(event)}
                        title="Event Details"
                      >
                        <FaInfoCircle />
                      </button>
                      <button 
                        className="tbl-action-btn del" 
                        onClick={() => handleDelete(event._id)}
                        title="Delete Event"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="admin-modal-overlay" onClick={() => setShowAddModal(null)}>
          <div className="admin-config-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header-premium">
              <div className="header-titles">
                <h2>Add New Event</h2>
              </div>
              <button className="close-x" onClick={() => setShowAddModal(null)}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body-scroll">
                <div className="form-grid-premium">
                  <div className="form-group-premium full">
                    <label>Event Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                  </div>
                  <div className="form-group-premium">
                    <label>Date</label>
                    <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                  </div>
                  <div className="form-group-premium">
                    <label>Max Slots</label>
                    <input type="number" name="slots" value={formData.slots} onChange={handleChange} min="0" required />
                  </div>
                  <div className="form-group-premium full">
                    <label>Location</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} required />
                  </div>
                  <div className="form-group-premium">
                    <label>Organizer</label>
                    <input type="text" name="organizer" value={formData.organizer} onChange={handleChange} required />
                  </div>
                  <div className="form-group-premium">
                    <label>Contact Info</label>
                    <input type="text" name="contact" value={formData.contact} onChange={handleChange} required />
                  </div>
                  <div className="form-group-premium full">
                    <label>Mission Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows="4" required />
                  </div>
                </div>
              </div>

              <div className="modal-footer-premium">
                <button type="submit" className="add-record-btn-premium active full-width" disabled={submitting}>
                  <FaPlusCircle /> {submitting ? 'Adding...' : 'Add Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {viewDetails && (
        <div className="admin-modal-overlay" onClick={() => setViewDetails(null)}>
          <div className="photo-viewer-modal" onClick={e => e.stopPropagation()}>
            <div className="viewer-header">
              <div className="header-titles">
                <h2>{viewDetails.title}</h2>
                <p>Event Brief & Strategy</p>
              </div>
              <button className="close-x" onClick={() => setViewDetails(null)}>×</button>
            </div>
            <div className="modal-body-scroll" style={{ padding: '32px' }}>
              <div className="review-section" style={{ padding: 0, border: 'none', marginBottom: '32px' }}>
                <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
                  <div className="detail-item">
                    <label>Date</label>
                    <p>{new Date(viewDetails.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div className="detail-item">
                    <label>Location</label>
                    <p>{viewDetails.location}</p>
                  </div>
                  <div className="detail-item">
                    <label>Capacity</label>
                    <p>{viewDetails.slots > 0 ? `${viewDetails.slots} Persons` : 'Unlimited'}</p>
                  </div>
                </div>

                <div className="intent-box" style={{ background: '#f8fafc' }}>
                   <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>Mission Description</label>
                   <p style={{ margin: 0, fontSize: '15px' }}>{viewDetails.description}</p>
                </div>
              </div>

              <div className="review-section" style={{ padding: '24px', background: '#f0fdfa', borderRadius: '16px', border: 'none' }}>
                <h3 style={{ marginTop: 0 }}>Logistics Contact</h3>
                <div style={{ display: 'flex', gap: '40px' }}>
                   <div><label style={{ fontSize: '10px', color: 'var(--text-muted)' }}>ORGANIZER</label><p style={{ margin: 0, fontWeight: '700' }}>{viewDetails.organizer}</p></div>
                   <div><label style={{ fontSize: '10px', color: 'var(--text-muted)' }}>HQ CONTACT</label><p style={{ margin: 0, fontWeight: '700' }}>{viewDetails.contact}</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registered Persons Modal */}
      {viewVolunteers && (
        <div className="admin-modal-overlay" onClick={() => setViewVolunteers(null)}>
          <div className="admin-config-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header-premium">
              <div className="header-titles">
                <h2>Personnel Deployment</h2>
                <p>{viewVolunteers.registeredVolunteers?.length || 0} individuals registered for {viewVolunteers.title}</p>
              </div>
              <button className="close-x" onClick={() => setViewVolunteers(null)}>×</button>
            </div>
            <div className="modal-body-scroll" style={{ padding: '0' }}>
               {(!viewVolunteers.registeredVolunteers || viewVolunteers.registeredVolunteers.length === 0) ? (
                 <div style={{ padding: '60px', textAlign: 'center' }}>
                    <FaUsers size={40} color="#e2e8f0" />
                    <p style={{ color: 'var(--text-muted)', marginTop: '16px' }}>No registrations yet for this mission.</p>
                 </div>
               ) : (
                 <table className="admin-premium-table" style={{ border: 'none' }}>
                    <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                       <tr>
                          <th style={{ paddingLeft: '32px' }}>Volunteer Name</th>
                          <th>Contact Details</th>
                       </tr>
                    </thead>
                    <tbody>
                       {viewVolunteers.registeredVolunteers.map((vol, idx) => {
                         const isPopulated = vol && typeof vol === 'object' && vol.name;
                         return (
                           <tr key={vol._id || idx}>
                              <td style={{ paddingLeft: '32px' }}>
                                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div className="applicant-initials">
                                      {isPopulated ? vol.name?.split(' ').map(n => n[0]).join('') : '?'}
                                    </div>
                                    <span style={{ fontWeight: '700' }}>
                                      {isPopulated ? vol.name : `Volunteer (ID: ${vol.toString().slice(-6)})`}
                                    </span>
                                 </div>
                              </td>
                              <td>
                                 <div className="meta-stack">
                                    <div className="meta-row">
                                      <FaEnvelope size={12} /> 
                                      {isPopulated ? vol.email : 'Email hidden/unavailable'}
                                    </div>
                                    {isPopulated && vol.mobile && (
                                      <div className="meta-row muted">
                                        <FaPhoneAlt size={10} /> {vol.mobile}
                                      </div>
                                    )}
                                 </div>
                              </td>
                           </tr>
                         );
                       })}
                    </tbody>
                 </table>
               )}
            </div>
            <div className="modal-footer-premium" style={{ textAlign: 'right' }}>
               <button className="add-record-btn-premium active" onClick={() => setViewVolunteers(null)} style={{ border: 'none', cursor: 'pointer' }}>
                  Close Manifest
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEvents;