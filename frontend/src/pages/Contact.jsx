import React, { useState } from 'react';
import './Contact.css';


import contactImg from '../assets/contact.avif'; 

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    description: '',
    category: 'injured-animal',
    priority: 'medium',
    photo: null
  });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photo: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting emergency report...');
    setLoading(true);

    try {
      
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("mobile", formData.mobile);
      submitData.append("address", formData.address);
      submitData.append("description", formData.description);
      submitData.append("category", formData.category);
      submitData.append("priority", formData.priority);
      
      if (formData.photo) {
        submitData.append("photo", formData.photo);
      }

      const response = await fetch("http://localhost:5000/api/emergency-reports", {
        method: "POST",
        body: submitData
      });

      const data = await response.json();

      if (response.ok || data.success) {
        setStatus("Emergency report submitted successfully!");
        setFormData({ 
          name: '', 
          email: '', 
          mobile: '', 
          address: '', 
          description: '',
          category: 'injured-animal',
          priority: 'medium',
          photo: null
        }); // Reset the form
        
        
        setTimeout(() => setStatus(''), 3000);
      } else {
        setStatus(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus("Error submitting report. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page-wrapper">
      <div className="contact-container">
        <form onSubmit={handleSubmit} className="contact-left">
          <div className="contact-left-title">
            <h2>Emergency Incident Report</h2>
            <p className="form-subtitle">Report an incident and help us assist animals in need</p>
            <hr />
          </div>
          
          <input 
            type="text" 
            name="name" 
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name" 
            className="contact-inputs" 
            required 
          />
          <input 
            type="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email" 
            className="contact-inputs" 
            required 
          />
          <input 
            type="tel" 
            name="mobile" 
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Mobile Number" 
            className="contact-inputs" 
            pattern="[0-9+\-\s]{10,}"
            required 
          />
          <textarea 
            name="address" 
            value={formData.address}
            onChange={handleChange}
            placeholder="Address of Incident" 
            className="contact-inputs address-input"
            required
          ></textarea>
          <textarea 
            name="description" 
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the incident details..." 
            className="contact-inputs" 
            required
          ></textarea>
          <select 
            name="category" 
            value={formData.category}
            onChange={handleChange}
            className="contact-inputs select-input" 
            required 
          >
            <option value="">Select Incident Category</option>
            <option value="injured-animal">Injured Animal</option>
            <option value="stray-animal">Stray Animal</option>
            <option value="animal-abuse">Animal Abuse</option>
            <option value="lost-pet">Lost Pet</option>
            <option value="wildlife-issue">Wildlife Issue</option>
            <option value="other">Other</option>
          </select>

          <select 
            name="priority" 
            value={formData.priority}
            onChange={handleChange}
            className="contact-inputs select-input" 
            required 
          >
            <option value="low">Priority: Low</option>
            <option value="medium">Priority: Medium</option>
            <option value="high">Priority: High</option>
            <option value="critical">Priority: Critical</option>
          </select>

          <div className="file-input-wrapper">
            <label htmlFor="photo" className="file-input-label">
              📸 Upload Photo (Optional)
            </label>
            <input 
              type="file" 
              id="photo"
              name="photo" 
              onChange={handlePhotoChange}
              accept="image/*"
              className="file-input"
            />
            {formData.photo && <p className="file-name">File: {formData.photo.name}</p>}
          </div>
          
          <button type="submit" disabled={loading}> 
            {loading ? 'Submitting...' : 'Submit Report'} <b>&#8594;</b>
          </button>
          
          {status && <p className="status-message">{status}</p>}
        </form>
        
        <div className="contact-right">
          <img src={contactImg} alt="Contact Support" />
        </div>
      </div>
    </div>
  );
};

export default Contact;