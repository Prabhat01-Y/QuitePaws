import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AdoptionForm.css';

const AdoptionForm = () => {
  const { id } = useParams(); // Selected animal ID
  const navigate = useNavigate();
  
  const [animal, setAnimal] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State matching the newly requested explicit schema
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    
    // Legacy fields that might still be required by schema but we'll autofill or use locally
    aadhaar: 'Not Required',
    location: 'Online',
    adoptionDate: new Date().toISOString().split('T')[0],
    
    // New Home Details
    homeType: '',
    rentOrOwn: '',
    hasChildren: '',
    petsCount: '',
    hoursAlone: '',
    hasYard: '',
    intent: ''
  });

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/api/animals/${id}`)
        .then(res => res.json())
        .then(data => setAnimal(data))
        .catch(err => console.error(err));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? (checked ? 'Yes' : 'No') : value 
    });
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = { ...formData, animal: id };

      const res = await fetch('http://localhost:5000/api/adoptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setStep(3); // Go to complete step
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to submit application.');
      }
    } catch (err) {
      setError('Could not connect to the backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adoption-wizard-page">
      <div className="adoption-wizard-container">
        
        {/* LEFT SIDE: Animal Profile */}
        <div className="wizard-left">
          {animal ? (
            <div className="animal-summary">
              <div className="animal-image-wrapper">
                <img 
                  src={animal.image?.startsWith('http') ? animal.image : `http://localhost:5000/uploads/animals/${animal.image}`} 
                  alt={animal.name} 
                  className="main-animal-image"
                  onError={(e) => { e.target.style.display='none'; }}
                />
              </div>
              <h2 className="animal-name-title">{animal.name}</h2>
              <p className="animal-tags">
                {animal.age} years old • {animal.breed} • {animal.gender || 'Unknown'}
              </p>
              
              {/* Dummy thumbnails matching screenshot aesthetic */}
              <div className="thumbnail-gallery">
                <img src={animal.image?.startsWith('http') ? animal.image : `http://localhost:5000/uploads/animals/${animal.image}`} alt="thumb 1" className="thumb active" onError={(e) => { e.target.style.display='none'; }} />
                <div className="thumb placeholder">🐾</div>
                <div className="thumb placeholder">🦴</div>
              </div>
            </div>
          ) : (
            <div className="animal-loading">
              <p>Loading pet details...</p>
            </div>
          )}
        </div>

        {/* RIGHT SIDE: Multi-Step Form */}
        <div className="wizard-right">
          
          <div className="step-indicator">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>
              <div className="step-circle">1</div>
              <span>Your Info</span>
            </div>
            <div className="step-line"></div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>
              <div className="step-circle">2</div>
              <span>Home Details</span>
            </div>
            <div className="step-line"></div>
            <div className={`step ${step === 3 ? 'active' : ''}`}>
              <div className="step-circle">3</div>
              <span>Complete</span>
            </div>
          </div>

          <div className="form-content">
            {error && <div className="error-banner">{error}</div>}

            {step === 1 && (
              <div className="step-section fade-in">
                <h3>Personal Information</h3>
                <p className="form-desc">Tell us about yourself so we can process your application.</p>
                
                <div className="form-grid">
                  <div className="input-group">
                    <label>Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="input-group">
                    <label>Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="input-group">
                    <label>Phone Number</label>
                    <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required />
                  </div>
                  <div className="input-group">
                    <label>Address</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} required />
                  </div>
                </div>

                <div className="wizard-actions">
                  <div></div> {/* Spacer */}
                  <button 
                    type="button" 
                    className="wizard-btn-primary" 
                    onClick={nextStep}
                    disabled={!formData.name || !formData.email || !formData.mobile || !formData.address}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="step-section fade-in">
                <h3>Home Details</h3>
                <p className="form-desc">Help us ensure this is the right match for both of you.</p>

                <form onSubmit={handleSubmit}>
                  <div className="form-grid">
                    <div className="input-group">
                      <label>Living Situation</label>
                      <select name="homeType" value={formData.homeType} onChange={handleChange} required>
                        <option value="">Select Home Type...</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Independent House">Independent House</option>
                        <option value="Farmhouse">Farmhouse</option>
                      </select>
                    </div>

                    <div className="input-group">
                      <label>Rent or Own?</label>
                      <select name="rentOrOwn" value={formData.rentOrOwn} onChange={handleChange} required>
                        <option value="">Select...</option>
                        <option value="Rent">Rent</option>
                        <option value="Own">Own</option>
                      </select>
                    </div>

                    <div className="input-group">
                      <label>Are there children in the home?</label>
                      <select name="hasChildren" value={formData.hasChildren} onChange={handleChange} required>
                        <option value="">Select...</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>

                    <div className="input-group">
                      <label>Existing Pets?</label>
                      <select name="petsCount" value={formData.petsCount} onChange={handleChange} required>
                        <option value="">Select...</option>
                        <option value="None">None</option>
                        <option value="1 Pet">1 Pet</option>
                        <option value="2 Pets">2 Pets</option>
                        <option value="3+ Pets">3+ Pets</option>
                      </select>
                    </div>

                    <div className="input-group">
                      <label>Hours pet will be alone daily?</label>
                      <input type="number" name="hoursAlone" min="0" max="24" value={formData.hoursAlone} onChange={handleChange} placeholder="e.g. 4" required />
                    </div>

                    <div className="input-group">
                      <label>Do you have a Yard/Garden?</label>
                      <div className="radio-group">
                        <label><input type="radio" name="hasYard" value="Yes" onChange={handleChange} required /> Yes</label>
                        <label><input type="radio" name="hasYard" value="No" onChange={handleChange} /> No</label>
                      </div>
                    </div>
                  </div>

                  <div className="input-group full-width" style={{marginTop: '20px'}}>
                    <label>Why do you want to adopt this pet?</label>
                    <textarea name="intent" rows="3" value={formData.intent} onChange={handleChange} placeholder="Briefly explain your intent..." required></textarea>
                  </div>

                  <div className="wizard-actions">
                    <button type="button" className="wizard-btn-secondary" onClick={prevStep}>Back</button>
                    <button type="submit" className="wizard-btn-primary" disabled={loading}>
                      {loading ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === 3 && (
              <div className="step-section fade-in success-step">
                <div className="success-icon">🎉</div>
                <h3>Application Received!</h3>
                <p>Thank you for offering a loving home. Our team will review your application and send you an email at <strong>{formData.email}</strong> shortly.</p>
                <button onClick={() => navigate('/adopt')} className="wizard-btn-primary" style={{marginTop: '30px'}}>
                  Back to Animals
                </button>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default AdoptionForm;