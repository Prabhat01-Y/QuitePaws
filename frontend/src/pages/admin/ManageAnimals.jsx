import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminStyles.css';

const ManageAnimals = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchAnimals();
  }, []);

  if (loading) return <div className="admin-loading">Loading animals...</div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h2>Manage Animals</h2>
          <p>View, track, and add animals available for adoption.</p>
        </div>
        <Link to="/admin/add-animal" className="back-website-btn" style={{background: '#01e37f', color: '#fff'}}>
          + Add New Animal
        </Link>
      </div>

      <div className="admin-table-container">
        {animals.length === 0 ? (
          <div className="admin-empty">No animals added yet.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name / Breed</th>
                <th>Age / Gender</th>
                <th>Diet</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {animals.map(animal => (
                <tr key={animal._id}>
                  <td>
                    <img 
                      src={`http://localhost:5000${animal.imageUrl}`} 
                      alt={animal.name} 
                      style={{width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px'}}
                    />
                  </td>
                  <td>
                    <strong>{animal.name}</strong><br/>
                    <small>{animal.breed}</small>
                  </td>
                  <td>
                    {animal.age} y.o.<br/>
                    <small>{animal.gender}</small>
                  </td>
                  <td>{animal.diet}</td>
                  <td>
                    <span className={`status-badge ${animal.isAvailable ? 'status-approved' : 'status-rejected'}`}>
                      {animal.isAvailable ? 'Available' : 'Adopted'}
                    </span>
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

export default ManageAnimals;
