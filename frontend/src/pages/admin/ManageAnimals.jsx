import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  FaPaw, 
  FaTrashAlt, 
  FaSyncAlt, 
  FaCamera
} from 'react-icons/fa';
import './AdminStyles.css';

const ManageAnimals = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewPhoto, setViewPhoto] = useState(null);
  const { token } = useAuth();

  const fetchAnimals = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/animals');
      if (res.ok) {
        setAnimals(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/animals/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setAnimals(animals.filter(a => a._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/animals/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isAvailable: !currentStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setAnimals(animals.map(a => a._id === id ? updated : a));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/600x400?text=No+Photo+Uploaded';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000/uploads/animals/${imagePath}`;
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  if (loading) return <div className="admin-loading">Assembling directory...</div>;

  return (
    <div className="admin-page">
      <div className="management-header-clean">
        <div className="header-info">
          <h1>Animal Directory</h1>
        </div>
      </div>

      <div className="table-container-premium fitted">
        {animals.length === 0 ? (
          <div className="empty-state">
            <FaPaw size={48} color="var(--text-muted)" />
            <h3>No Records Found</h3>
          </div>
        ) : (
          <table className="admin-premium-table">
            <thead>
              <tr>
                <th>Animal Name</th>
                <th>Breed</th>
                <th>Status</th>
                <th>Adoption Fee</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {animals.map((animal) => (
                <tr key={animal._id}>
                  <td>
                    <div 
                      className="clickable-name" 
                      onClick={() => setViewPhoto(animal)}
                      title="Click to view photo"
                    >
                      <FaCamera className="cam-icon" />
                      <span>{animal.name}</span>
                    </div>
                  </td>
                  <td>{animal.breed || '—'}</td>
                  <td>
                    <span className={`status-pill-table ${animal.isAvailable ? 'available' : 'adopted'}`}>
                      {animal.isAvailable ? 'Available' : 'Adopted'}
                    </span>
                  </td>
                  <td className="fee-td">₹{animal.adoptionFee}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="table-actions">
                      <button 
                        className="tbl-action-btn sync" 
                        onClick={() => handleToggleStatus(animal._id, animal.isAvailable)}
                        title="Toggle Adoption Status"
                      >
                        <FaSyncAlt />
                      </button>
                      <button 
                        className="tbl-action-btn del" 
                        onClick={() => handleDelete(animal._id)}
                        title="Delete Record"
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

      {viewPhoto && (
        <div className="admin-modal-overlay" onClick={() => setViewPhoto(null)}>
          <div className="photo-viewer-modal" onClick={e => e.stopPropagation()}>
            <div className="viewer-header">
              <h3>{viewPhoto.name}'s Profile Image</h3>
              <button className="close-x" onClick={() => setViewPhoto(null)}>×</button>
            </div>
            <div className="viewer-body">
              <img 
                src={getImageUrl(viewPhoto.image)} 
                alt={viewPhoto.name} 
              />
            </div>
            <div className="viewer-footer">
               <div className="animal-quick-stats">
                  <span><strong>Breed:</strong> {viewPhoto.breed}</span>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAnimals;