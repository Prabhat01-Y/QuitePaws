import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Volunteer.css';

// Import a dog image from assets - reuse existing
import dogImg from '../assets/d1.png';

const Volunteer = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    availability: '',
    skills: [],
    comments: '',
    agreed: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const skillOptions = ['Rescuer', 'Fosterer', 'Caretaker', 'Trainer', 'Food Service', 'Other'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'skills') {
      setFormData(prev => ({
        ...prev,
        skills: checked ? [...prev.skills, value] : prev.skills.filter(s => s !== value)
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreed) {
      setError('Please agree to the terms and conditions.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      // Step 1: Register as volunteer
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'volunteer',
          mobile: formData.phone,
          availability: formData.availability,
          skills: formData.skills,
          comments: formData.comments
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Registration failed.');
        setLoading(false);
        return;
      }

      // Step 2: Auto-login with returned token
      login(data);

      // Step 3: Redirect to dashboard
      navigate('/volunteer-dashboard');
    } catch (err) {
      setError('Could not connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vol-signup-page">
      <div className="vol-signup-container">

        {/* LEFT: Image + Tagline */}
        <div className="vol-signup-left">
          <img src={dogImg} alt="Volunteer with animal" className="vol-hero-img" />
          <div className="vol-hero-text">
            <h2>Empowerment Through Service</h2>
            <p>Unite, Serve, Impact: Your Chance to Give Back</p>
          </div>
        </div>

        {/* RIGHT: Registration Form */}
        <div className="vol-signup-right">
          <h2 className="vol-form-title">Volunteer Registration</h2>
          <p className="vol-form-sub">Thank you for your interest in volunteering with us! Please fill out the form below to sign up.</p>

          {error && <div className="vol-error">{error}</div>}

          <form onSubmit={handleSubmit} className="vol-form">

            <div className="vol-form-row">
              <div className="vol-field">
                <label>Name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter" required />
              </div>
              <div className="vol-field">
                <label>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Example@gmail.com" required />
              </div>
            </div>

            <div className="vol-form-row">
              <div className="vol-field">
                <label>Phone Number:</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 12345 678" required />
              </div>
              <div className="vol-field">
                <label>Availability:</label>
                <select name="availability" value={formData.availability} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="weekdays">Weekdays</option>
                  <option value="weekends">Weekends</option>
                  <option value="both">Both</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>

            <div className="vol-field">
              <label>Password:</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create a password" minLength={6} required />
            </div>

            <div className="vol-skills-grid">
              {skillOptions.map(skill => (
                <label key={skill} className="vol-skill-check">
                  <input
                    type="checkbox"
                    name="skills"
                    value={skill}
                    checked={formData.skills.includes(skill)}
                    onChange={handleChange}
                  />
                  {skill}
                </label>
              ))}
            </div>

            <div className="vol-field">
              <label>Additional Comments/Questions:</label>
              <textarea name="comments" value={formData.comments} onChange={handleChange} placeholder="Add Text" rows={3} />
            </div>

            <label className="vol-terms-check">
              <input type="checkbox" name="agreed" checked={formData.agreed} onChange={handleChange} />
              I have read and agree to the terms and conditions.
            </label>

            <div className="vol-form-actions">
              <button type="button" className="vol-btn-cancel" onClick={() => navigate('/')}>Cancel</button>
              <button type="submit" className="vol-btn-submit" disabled={loading}>
                {loading ? 'Registering...' : 'Submit'}
              </button>
            </div>

          </form>

          <p className="vol-login-link">
            Already a volunteer? <a href="/login">Login here</a>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Volunteer;