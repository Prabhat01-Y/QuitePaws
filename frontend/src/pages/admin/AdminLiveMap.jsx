import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useAuth } from '../../context/AuthContext';
import './AdminStyles.css';
import 'leaflet/dist/leaflet.css';

// Fix default marker issues in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;

// Custom Icons for different priorities
const createIcon = (color) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const icons = {
  critical: createIcon('red'),
  high: createIcon('orange'),
  medium: createIcon('blue'),
  low: createIcon('grey'),
  resolved: createIcon('green')
};

const AdminLiveMap = () => {
  const { token } = useAuth();
  const [rescues, setRescues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default Map Center (e.g. India)
  const defaultCenter = [20.5937, 78.9629];

  useEffect(() => {
    fetchRescues();
  }, [token]);

  const fetchRescues = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/rescues', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Filter out rescues that don't have location data
        const mappableRescues = data.filter(r => r.location && r.location.lat && r.location.lng);
        setRescues(mappableRescues);
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
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (res.ok) {
        setRescues(rescues.map(r => r._id === id ? { ...r, status: newStatus } : r));
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      alert('Error updating status');
    }
  };

  // As requested, we filter to show only pending and in-progress rescues
  const activeRescues = rescues.filter(r => r.status === 'pending' || r.status === 'in-progress');

  if (loading) return <div className="admin-loading">Loading live map...</div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h2>Live Rescue Operations Map</h2>
          <p>Real-time geospatial tracking of pending and in-progress incidents.</p>
        </div>
      </div>

      <div style={{ height: '70vh', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <MapContainer center={defaultCenter} zoom={5} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {activeRescues.map(rescue => (
            <Marker 
              key={rescue._id} 
              position={[rescue.location.lat, rescue.location.lng]}
              icon={icons[rescue.priority]}
            >
              <Popup>
                <div style={{ minWidth: '200px' }}>
                  <h4 style={{ margin: '0 0 5px 0', color: '#b91c1c' }}>🚨 {rescue.category.replace('-', ' ').toUpperCase()}</h4>
                  {rescue.photo && (
                    <img 
                      src={`http://localhost:5000/uploads/emergency-reports/${rescue.photo}`} 
                      alt="Incident" 
                      style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '4px', marginBottom: '8px' }}
                    />
                  )}
                  <p style={{ margin: '0 0 5px 0', fontSize: '13px' }}><strong>Priority:</strong> <span style={{textTransform: 'capitalize'}}>{rescue.priority}</span></p>
                  <p style={{ margin: '0 0 8px 0', fontSize: '13px' }}><strong>Contact:</strong> {rescue.mobile}</p>
                  <p style={{ margin: '0 0 10px 0', fontSize: '12px', fontStyle: 'italic', color: '#666' }}>{rescue.address}</p>
                  
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <select 
                      className="status-select"
                      value={rescue.status}
                      onChange={(e) => updateStatus(rescue._id, e.target.value)}
                      style={{ width: '100%', padding: '4px', fontSize: '12px' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginTop: '20px', padding: '15px', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <strong>Legend:</strong>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'red' }}></div> Critical
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'orange' }}></div> High
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#2B82CB' }}></div> Medium
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'grey' }}></div> Low
        </div>
      </div>
    </div>
  );
};

export default AdminLiveMap;
