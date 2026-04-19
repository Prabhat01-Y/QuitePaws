import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminStyles.css';

const ManageAnimals = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const fetchAnimals = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/animals');
      if (res.ok) {
        const data = await res.json();
        setAnimals(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this animal record? This action cannot be undone.')) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/animals/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setAnimals(animals.filter(a => a._id !== id));
      } else {
        alert('Failed to delete animal. Please try again.');
      }
    } catch (err) {
      console.error('Delete error:', err);
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
        const updatedAnimal = await res.json();
        setAnimals(animals.map(a => a._id === id ? updatedAnimal : a));
      }
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  if (loading) return <div className="admin-loading">Loading animals...</div>;

  return (
    <div className="admin-page management-view">
      {/* Premium Dashboard Header */}
      <div className="management-header">
        <div className="header-text">
          <h1>Animal <span className="highlight">Management</span></h1>
          <p>You have {animals.length} animals currently in the directory.</p>
        </div>
        <Link to="/admin/add-animal" className="add-animal-btn-large">
          <span className="plus-icon">+</span>
          Add New Animal
        </Link>
      </div>

      {/* Removed Search & Filter Controls as per request */}

      <div className="animal-list-container">
        {animals.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🐾</span>
            <h3>No animals found</h3>
            <p>Ready to save a life? Start by adding a new rescue record.</p>
          </div>
        ) : (
          <div className="animal-cards-grid">
            {animals.map((animal) => (
              <div key={animal._id} className="animal-management-card">
                <div className="card-main-info no-image">
                  <div className="animal-details">
                    <h3>{animal.name}</h3>
                    <p className="breed-tag">{animal.breed || 'Mixed Breed'}</p>
                    <div className="meta-info">
                      <span className="meta-item">🎂 {animal.age || '—'} Yrs</span>
                      <span className="separator">•</span>
                      <span className="meta-item">✨ {animal.gender || 'Not specified'}</span>
                    </div>
                  </div>
                </div>

                <div className="status-and-fee">
                   <div className={`status-label ${animal.isAvailable ? 'available' : 'adopted'}`}>
                     {animal.isAvailable ? 'Available' : 'Adopted'}
                   </div>
                   <div className="fee-tag">₹{animal.adoptionFee || '0'} Adoption Fee</div>
                </div>

                <div className="card-actions-group">
                  <button className="premium-action-btn edit" onClick={() => handleToggleStatus(animal._id, animal.isAvailable)}>
                    <span className="icon">🔄</span>
                    Toggle Status
                  </button>
                  <button className="premium-action-btn delete" onClick={() => handleDelete(animal._id)}>
                    <span className="icon">🗑️</span>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAnimals;
