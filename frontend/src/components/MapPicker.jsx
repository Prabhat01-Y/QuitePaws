import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icon loading issues in Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    }
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
};

const MapPicker = ({ onLocationSelect }) => {
  const [position, setPosition] = useState(null);

  // Default to a central location (e.g., center of India)
  const defaultCenter = [20.5937, 78.9629];

  useEffect(() => {
    if (position) {
      onLocationSelect(position);
    }
  }, [position, onLocationSelect]);

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (loc) => {
          const latlng = { lat: loc.coords.latitude, lng: loc.coords.longitude };
          setPosition(latlng);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not get your location. Please click on the map to drop a pin.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
      <label style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#333' }}>
        📍 Pinpoint Location (Click on Map)
      </label>
      
      <div style={{ height: '250px', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid #d0d0d0' }}>
        <MapContainer 
          center={position || defaultCenter} 
          zoom={5} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={setPosition} />
        </MapContainer>
      </div>

      <button 
        type="button" 
        onClick={useCurrentLocation}
        style={{
          padding: '8px 12px',
          background: '#f0f2f5',
          border: '1px solid #d0d0d0',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '0.85rem',
          fontWeight: 'bold',
          color: '#333'
        }}
      >
        🎯 Use My Current Location
      </button>

      {position && (
        <span style={{ fontSize: '0.8rem', color: '#01e37f', fontWeight: 'bold' }}>
          ✓ Location pinned
        </span>
      )}
    </div>
  );
};

export default MapPicker;
