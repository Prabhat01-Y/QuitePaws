import React, { useState } from 'react';
import './AdminAddAnimal.css';
import { useAuth } from '../context/AuthContext';

const AdminAddAnimal = () => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    adoptionFee: '',
    personalityTraits: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      setStatus('❗ Please select an image before submitting.');
      return;
    }

    setIsLoading(true);
    setStatus('Uploading image...');

    try {
      // Step 1: Upload the image file
      const imageFormData = new FormData();
      imageFormData.append('image', imageFile);

      const uploadRes = await fetch('http://localhost:5000/api/animals/upload-image', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: imageFormData,
      });

      if (!uploadRes.ok) {
        const err = await uploadRes.json();
        setStatus(`Image upload failed: ${err.message}`);
        setIsLoading(false);
        return;
      }

      const { imageUrl } = await uploadRes.json();
      setStatus('Adding animal to database...');

      // Step 2: Create the animal record with the uploaded image URL
      const traitsArray = formData.personalityTraits
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t !== '');

      const payload = {
        name: formData.name,
        breed: formData.breed,
        adoptionFee: Number(formData.adoptionFee),
        personalityTraits: traitsArray,
        image: imageUrl,
      };

      const animalRes = await fetch('http://localhost:5000/api/animals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (animalRes.ok) {
        setStatus(`✅ Success! ${formData.name} has been added to QuietPaws.`);
        setFormData({ name: '', breed: '', adoptionFee: '', personalityTraits: '' });
        setImageFile(null);
        setImagePreview(null);
      } else {
        const errorData = await animalRes.json();
        setStatus(`Error: ${errorData.message}`);
      }
    } catch (error) {
      setStatus('❌ Failed to connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-add-animal-container">
        <h2>Admin: Add New Rescue Animal</h2>
        <form onSubmit={handleSubmit} className="admin-form">

          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Breed</label>
            <input type="text" name="breed" value={formData.breed} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Adoption Fee (₹)</label>
            <input type="number" name="adoptionFee" value={formData.adoptionFee} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Personality Traits (comma separated)</label>
            <textarea
              name="personalityTraits"
              value={formData.personalityTraits}
              onChange={handleChange}
              placeholder="e.g. Playful, Good with kids, Energetic"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label>Animal Photo</label>
            <div className="image-upload-area" onClick={() => document.getElementById('imageFileInput').click()}>
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="image-preview" />
              ) : (
                <div className="image-upload-placeholder">
                  <span className="upload-icon">📷</span>
                  <p>Click to select an image from your computer</p>
                  <p className="upload-hint">JPG, PNG, WEBP up to 5MB</p>
                </div>
              )}
            </div>
            <input
              id="imageFileInput"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            {imagePreview && (
              <button
                type="button"
                className="change-image-btn"
                onClick={() => document.getElementById('imageFileInput').click()}
              >
                Change Image
              </button>
            )}
          </div>

          <button type="submit" className="admin-submit-btn" disabled={isLoading}>
            {isLoading ? 'Uploading...' : 'Add Animal'}
          </button>

          {status && <p className="admin-status">{status}</p>}
        </form>
      </div>
    </div>
  );
};

export default AdminAddAnimal;