import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './VolunteerDashboard.css';

// Fix default leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});



const VolunteerDashboard = () => {
  const { user, token, logout, isVolunteer, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [rescues, setRescues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('rescues');
  const [claimLoading, setClaimLoading] = useState(null);

  // Completion modal state
  const [completionModal, setCompletionModal] = useState(null); // holds rescue object
  const [completionNote, setCompletionNote] = useState('');
  const [completionPhotos, setCompletionPhotos] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [completionSuccess, setCompletionSuccess] = useState('');

  // Map expand
  const [mapExpanded, setMapExpanded] = useState(null);

  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!token || (!isVolunteer && !isAdmin)) {
      navigate('/login');
      return;
    }
    fetchRescues();
    fetchEvents();
  }, [token]);

  const fetchEvents = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/events');
      if (res.ok) {
        const fetchedEvents = await res.json();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcomingEvents = fetchedEvents.filter(e => {
          const eventDate = new Date(e.date);
          // If the date format is completely invalid, we keep it to be safe.
          // Otherwise, only show events on or after today.
          if (isNaN(eventDate)) return true;
          return eventDate >= today;
        });
        setEvents(upcomingEvents);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEventRegister = async (eventId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/events/${eventId}/register`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        alert('🎉 Registered interest! We will contact you with more details.');
        setEvents(prev => prev.map(e => e._id === eventId ? { ...e, registeredVolunteers: [...(e.registeredVolunteers || []), user._id] } : e));
      } else {
        const data = await res.json();
        alert(data.message || 'Could not register');
      }
    } catch (err) {
      alert('Error registering for event');
    }
  };

  const fetchRescues = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/emergency-reports/volunteer/available', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setRescues(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (id) => {
    setClaimLoading(id);
    try {
      const res = await fetch(`http://localhost:5000/api/emergency-reports/${id}/claim`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRescues(prev => prev.map(r => r._id === id ? data.report : r));
        setActiveTab('my'); // switch to my tab automatically
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to claim rescue.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setClaimLoading(null);
    }
  };

  const handleCompleteSubmit = async () => {
    if (!completionModal) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('note', completionNote);
      completionPhotos.forEach(f => fd.append('photos', f));

      const res = await fetch(`http://localhost:5000/api/emergency-reports/${completionModal._id}/complete`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd
      });

      if (res.ok) {
        const data = await res.json();
        setRescues(prev => prev.filter(r => r._id !== completionModal._id));
        setCompletionSuccess('✅ Rescue marked as completed! Admin has been notified.');
        setTimeout(() => {
          setCompletionModal(null);
          setCompletionNote('');
          setCompletionPhotos([]);
          setCompletionSuccess('');
        }, 2500);
      } else {
        const e = await res.json();
        alert(e.message || 'Failed to complete rescue.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const myRescues = rescues.filter(r =>
    r.assignedVolunteer && (r.assignedVolunteer === user?._id || String(r.assignedVolunteer) === String(user?._id))
  );
  const availableRescues = rescues.filter(r => !r.assignedVolunteer);

  const priorityColor = { critical: '#dc2626', high: '#ea580c', medium: '#d97706', low: '#16a34a' };
  const priorityBg   = { critical: '#fee2e2', high: '#fff7ed', medium: '#fefce8', low: '#f0fdf4' };

  if (loading) return (
    <div className="vd-loading">
      <div className="vd-spinner"></div>
      <p>Loading your dispatch center...</p>
    </div>
  );

  // ---- Rescue Card ----
  const RescueCard = ({ rescue, isMine }) => {
    const hasMap = rescue.location?.lat && rescue.location?.lng;
    const isMapOpen = mapExpanded === rescue._id;

    return (
      <div className={`vd-rescue-card ${isMine ? 'claimed' : ''}`}>
        {rescue.photo && (
          <img
            src={`http://localhost:5000/uploads/emergency-reports/${rescue.photo}`}
            alt="Rescue"
            className="vd-rescue-img"
          />
        )}
        <div className="vd-rescue-body">
          <div className="vd-rescue-top">
            {isMine ? (
              <span className="vd-claimed-badge">✅ You're on this!</span>
            ) : (
              <span
                className="vd-priority-badge"
                style={{ background: priorityBg[rescue.priority], color: priorityColor[rescue.priority] }}
              >
                {rescue.priority?.toUpperCase()}
              </span>
            )}
            <span className="vd-category">{rescue.category?.replace('-', ' ')}</span>
          </div>

          <p className="vd-rescue-desc">{rescue.description}</p>

          <div className="vd-rescue-meta">
            <span>📍 {rescue.address}</span>
            <span>👤 {rescue.name} — {rescue.mobile}</span>
            <span>🕐 {new Date(rescue.createdAt).toLocaleDateString()}</span>
          </div>

          {/* Map Section - Always show for claimed rescues, toggle for available ones */}
          {hasMap && (isMine || isMapOpen) && (
            <div className="vd-mini-map">
              <div className="vd-map-label">📍 Incident Location Pinpointed</div>
              <MapContainer
                center={[rescue.location.lat, rescue.location.lng]}
                zoom={15}
                style={{ height: '220px', width: '100%', borderRadius: '10px' }}
                scrollWheelZoom={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[rescue.location.lat, rescue.location.lng]}>
                  <Popup>
                    <strong>{rescue.category}</strong><br />
                    {rescue.address}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          )}

          {/* Toggle for available rescues if map not open */}
          {hasMap && !isMine && !isMapOpen && (
            <button className="vd-map-toggle" onClick={() => setMapExpanded(rescue._id)}>
              📌 View Incident Location on Map
            </button>
          )}
          {hasMap && !isMine && isMapOpen && (
            <button className="vd-map-toggle" onClick={() => setMapExpanded(null)}>
              🗺️ Hide Map
            </button>
          )}

          {/* Action buttons */}
          {!isMine ? (
            <button
              className="vd-claim-btn"
              onClick={() => handleClaim(rescue._id)}
              disabled={claimLoading === rescue._id}
            >
              {claimLoading === rescue._id ? 'Claiming...' : '🙋 Claim This Rescue'}
            </button>
          ) : (
            <div className="vd-mine-actions">
              <button className="vd-complete-btn" onClick={() => setCompletionModal(rescue)}>
                🏁 Mark as Completed
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="vd-page">

      {/* ---- Completion Modal ---- */}
      {completionModal && (
        <div className="vd-modal-overlay" onClick={() => !submitting && setCompletionModal(null)}>
          <div className="vd-modal" onClick={e => e.stopPropagation()}>
            {completionSuccess ? (
              <div className="vd-modal-success">
                <span className="vd-success-icon">🎉</span>
                <p>{completionSuccess}</p>
              </div>
            ) : (
              <>
                <div className="vd-modal-header">
                  <h3>🏁 Mark Rescue as Completed</h3>
                  <button className="vd-modal-close" onClick={() => setCompletionModal(null)}>✕</button>
                </div>
                <p className="vd-modal-sub">
                  Upload proof photos and add a note. The admin will be notified and this record will be resolved.
                </p>

                <div className="vd-modal-rescue-info">
                  <strong>{completionModal.category?.replace('-', ' ')}</strong>
                  <span>📍 {completionModal.address}</span>
                </div>

                <label className="vd-modal-label">Completion Note</label>
                <textarea
                  className="vd-modal-input"
                  rows={3}
                  placeholder="Describe what happened — e.g. Animal rescued and taken to shelter..."
                  value={completionNote}
                  onChange={e => setCompletionNote(e.target.value)}
                />

                <label className="vd-modal-label">Upload Proof Photos (up to 5)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  id="completion-photos"
                  style={{ display: 'none' }}
                  onChange={e => setCompletionPhotos(Array.from(e.target.files))}
                />
                <label htmlFor="completion-photos" className="vd-photo-upload-btn">
                  📸 {completionPhotos.length > 0 ? `${completionPhotos.length} photo(s) selected` : 'Choose Photos'}
                </label>

                {completionPhotos.length > 0 && (
                  <div className="vd-photo-preview">
                    {completionPhotos.map((f, i) => (
                      <img key={i} src={URL.createObjectURL(f)} alt={`proof-${i}`} className="vd-preview-thumb" />
                    ))}
                  </div>
                )}

                <div className="vd-modal-actions">
                  <button className="vd-modal-cancel" onClick={() => setCompletionModal(null)} disabled={submitting}>
                    Cancel
                  </button>
                  <button className="vd-modal-submit" onClick={handleCompleteSubmit} disabled={submitting}>
                    {submitting ? 'Submitting...' : '✅ Confirm Completion'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ---- Sidebar ---- */}
      <aside className="vd-sidebar">
        <div className="vd-avatar-block">
          <div className="vd-avatar">{user?.name?.charAt(0).toUpperCase() || 'V'}</div>
          <h3>{user?.name}</h3>
          <p>{user?.email}</p>
          <span className="vd-role-tag">🐾 Official Volunteer</span>
        </div>

        <nav className="vd-nav">
          <button className={`vd-nav-btn ${activeTab === 'rescues' ? 'active' : ''}`} onClick={() => setActiveTab('rescues')}>
            🚨 Available Rescues
            {availableRescues.length > 0 && <span className="vd-badge">{availableRescues.length}</span>}
          </button>
          <button className={`vd-nav-btn ${activeTab === 'my' ? 'active' : ''}`} onClick={() => setActiveTab('my')}>
            ✅ My Claimed
            {myRescues.length > 0 && <span className="vd-badge">{myRescues.length}</span>}
          </button>
          <button className={`vd-nav-btn ${activeTab === 'events' ? 'active' : ''}`} onClick={() => setActiveTab('events')}>
            📅 Events
          </button>
          <button className="vd-nav-btn vd-logout" onClick={() => { logout(); navigate('/'); }}>
            🚪 Logout
          </button>
        </nav>
      </aside>

      {/* ---- Main Content ---- */}
      <main className="vd-main">

        {activeTab === 'rescues' && (
          <div>
            <div className="vd-section-header">
              <h2>🚨 Available Rescue Missions</h2>
              <p>Review open emergency reports and claim one to respond. Click "Show Incident Location" to see where it happened.</p>
            </div>
            {availableRescues.length === 0 ? (
              <div className="vd-empty">
                <span>🎉</span>
                <h4>All clear! No pending rescues right now.</h4>
                <p>Check back later — you'll be notified when new reports come in.</p>
              </div>
            ) : (
              <div className="vd-cards">
                {availableRescues.map(r => <RescueCard key={r._id} rescue={r} isMine={false} />)}
              </div>
            )}
          </div>
        )}

        {activeTab === 'my' && (
          <div>
            <div className="vd-section-header">
              <h2>✅ My Claimed Rescues</h2>
              <p>These are the missions you are responsible for. Mark as complete once you've rescued the animal.</p>
            </div>
            {myRescues.length === 0 ? (
              <div className="vd-empty">
                <span>📋</span>
                <h4>You haven't claimed any rescues yet.</h4>
                <p>Go to "Available Rescues" and claim one to get started.</p>
              </div>
            ) : (
              <div className="vd-cards">
                {myRescues.map(r => <RescueCard key={r._id} rescue={r} isMine={true} />)}
              </div>
            )}
          </div>
        )}

        {activeTab === 'events' && (
          <div>
            <div className="vd-section-header">
              <h2>📅 Upcoming Volunteer Events</h2>
              <p>Community events and drives you can participate in.</p>
            </div>
            <div className="vd-events-grid">
              {events.length === 0 ? (
                <div className="vd-empty" style={{ gridColumn: '1 / -1' }}>No events available at the moment.</div>
              ) : (
                events.map(event => {
                  const isRegistered = event.registeredVolunteers?.includes(user?._id);
                  const isFull = event.slots > 0 && (event.registeredVolunteers?.length || 0) >= event.slots;
                  const availableSlots = event.slots > 0 ? event.slots - (event.registeredVolunteers?.length || 0) : 'Unlimited';
                  
                  return (
                    <div key={event._id} className="vd-event-card">
                      <div className="vd-event-icon">📢</div>
                      <div className="vd-event-info">
                        <h4>{event.title}</h4>
                        <p>📅 {event.date}</p>
                        <p>📍 {event.location}</p>
                        <p>👥 {availableSlots} slots available</p>
                      </div>
                      <button 
                        className={`vd-register-btn ${isRegistered ? 'registered' : ''}`}
                        onClick={() => handleEventRegister(event._id)}
                        disabled={isRegistered || isFull}
                      >
                        {isRegistered ? '✅ Interested' : (isFull ? 'Sold Out' : 'Register Interest')}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default VolunteerDashboard;
