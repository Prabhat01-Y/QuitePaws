import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useAuth } from '../../context/AuthContext';
import './AdminStyles.css';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;

const createIcon = (color) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const icons = {
  critical: createIcon('red'), high: createIcon('orange'), medium: createIcon('blue'), low: createIcon('grey'), resolved: createIcon('green')
};

const AdminLiveMap = () => {
  const { token } = useAuth();
  const [rescues, setRescues] = useState([]);
  const [loading, setLoading] = useState(true);
  const defaultCenter = [20.5937, 78.9629];

  useEffect(() => { fetchRescues(); }, [token]);

  const fetchRescues = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/rescues', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRescues(data.filter(r => r.location && r.location.lat && r.location.lng));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/rescues/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) setRescues(rescues.map(r => r._id === id ? { ...r, status: newStatus } : r));
    } catch (err) {
      alert('Error updating status');
    }
  };

  const activeRescues = rescues.filter(r => r.status === 'pending' || r.status === 'in-progress');

  if (loading) return <div className="admin-loading">Loading live tracking system...</div>;

  return (
    <div className="admin-page">
      <div className="management-header" style={{ padding: '0 0 24px 0', borderBottom: 'none' }}>
        <div className="header-text">
          <h1 style={{ textAlign: 'left' }}>Live Tactical Map</h1>
          <p style={{ textAlign: 'left' }}>Real-time geospatial tracking and field coordination.</p>
        </div>
      </div>

      <div>
        <div style={{ 
          height: '75vh', 
          width: '100%', 
          borderRadius: 'var(--radius-lg)', 
          overflow: 'hidden', 
          border: '1px solid var(--border-light)', 
          boxShadow: 'var(--shadow-lg)',
          position: 'relative'
        }}>
          <MapContainer center={defaultCenter} zoom={5} style={{ height: '100%', width: '100%' }}>
            <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {activeRescues.map(rescue => (
              <Marker key={rescue._id} position={[rescue.location.lat, rescue.location.lng]} icon={icons[rescue.priority]}>
                <Popup>
                  <div style={{ minWidth: '220px', fontFamily: 'Inter, sans-serif' }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: 'var(--primary)', borderBottom: '1px solid var(--border-light)', paddingBottom: '6px' }}>
                      {rescue.category.replace('-', ' ').toUpperCase()}
                    </h4>
                    {rescue.photo && (
                      <img 
                        src={`http://localhost:5000/uploads/emergency-reports/${rescue.photo}`} 
                        alt="Incident" 
                        style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '10px' }} 
                      />
                    )}
                    <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
                      <p style={{ margin: 0 }}><strong>Priority:</strong> {rescue.priority.toUpperCase()}</p>
                      <p style={{ margin: 0 }}><strong>Contact:</strong> {rescue.mobile}</p>
                      <p style={{ margin: 0, color: 'var(--text-muted)' }}><strong>Reporter:</strong> {rescue.name}</p>
                    </div>
                    <select 
                      className="status-select" 
                      value={rescue.status} 
                      onChange={(e) => updateStatus(rescue._id, e.target.value)} 
                      style={{ width: '100%', padding: '6px' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          gap: '32px', 
          marginTop: '24px', 
          padding: '20px', 
          background: 'white', 
          borderRadius: 'var(--radius-lg)', 
          border: '1px solid var(--border-light)', 
          boxShadow: 'var(--shadow-sm)',
          fontSize: '0.9rem',
          fontWeight: '600'
        }}>
          <span style={{ color: 'var(--text-muted)' }}>DISPATCH LEGEND:</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{ width: '14px', height: '14px', borderRadius: '50%', background: 'red' }}></div> Critical</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{ width: '14px', height: '14px', borderRadius: '50%', background: 'orange' }}></div> High</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#2B82CB' }}></div> Medium</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{ width: '14px', height: '14px', borderRadius: '50%', background: 'grey' }}></div> Low</div>
        </div>
      </div>
    </div>
  );
};

export default AdminLiveMap;