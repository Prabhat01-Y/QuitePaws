import React, { useState } from 'react';
import './Donation.css';


import img1 from '../assets/Donation1.jpg';
import img2 from '../assets/a.png';
import img3 from '../assets/b1.jpg';
import img4 from '../assets/c.png';
import img5 from '../assets/d.png';
import img6 from '../assets/Donation3..jpg'; 

const Donation = () => {

  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [img1, img2, img3, img4, img5, img6];

  const moveSlide = (direction) => {
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + direction;
      if (nextIndex < 0) return images.length - 1;
      if (nextIndex >= images.length) return 0;
      return nextIndex;
    });
  };

  //  Backend Donation  Logic
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ 
    donorName: '', 
    donorEmail: '', 
    amount: '', 
    paymentMethod: 'UPI' 
  });
  const [statusMessage, setStatusMessage] = useState('');

  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('Processing your donation...');

    try {
      const response = await fetch('http://localhost:5000/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donorName: formData.donorName,
          donorEmail: formData.donorEmail,
          amount: Number(formData.amount),
          paymentMethod: formData.paymentMethod,
        }),
      });

      if (response.ok) {
        setStatusMessage('Thank you for your generosity! Your donation has been recorded.');
        setFormData({ donorName: '', donorEmail: '', amount: '', paymentMethod: 'UPI' }); // Reset form
        
        setTimeout(() => {
          setShowForm(false);
          setStatusMessage('');
        }, 3000);
      } else {
        setStatusMessage('There was an issue processing your donation. Please try again.');
      }
    } catch (error) {
      setStatusMessage('Failed to connect to the server. Is your backend running?');
    }
  };

  return (
    <div className="donation-page-wrapper">
      
      {/* Hero Section */}
      <section id="hero">
        <div className="hero-text-highlight">
          <h1>Help Us Heal Animals in Need</h1>
          <p>Your donation can make a difference.</p>
        </div>
        
        {/* Toggle the donation form visibility */}
        {!showForm ? (
          <button className="donate-btn" onClick={() => setShowForm(true)}>Donate Now</button>
        ) : (
          <div className="donation-form-container">
            <h3>Complete Your Donation</h3>
            <form onSubmit={handleDonationSubmit} className="inline-donation-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.donorName} 
                    onChange={(e) => setFormData({ ...formData, donorName: e.target.value })} 
                    placeholder="Enter your name" 
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={formData.donorEmail} 
                    onChange={(e) => setFormData({ ...formData, donorEmail: e.target.value })} 
                    placeholder="example@gmail.com" 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                   <label>Amount (₹)</label>
                   <input 
                     type="number" 
                     min="1"
                     required 
                     value={formData.amount} 
                     onChange={(e) => setFormData({ ...formData, amount: e.target.value })} 
                     placeholder="e.g. 500" 
                   />
                </div>
                <div className="form-group">
                  <label>Payment Method</label>
                  <select 
                    value={formData.paymentMethod} 
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  >
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="QR Code">QR Code</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-donation-btn">Confirm Donation</button>
                <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
            {statusMessage && <p className="status-message">{statusMessage}</p>}
          </div>
        )}
      </section>

      {/* Carousel Section */}
      <section id="carousel-container">
        <button className="carousel-btn prev" onClick={() => moveSlide(-1)}>
          &#10094;
        </button>
        
        <div className="carousel-viewport">
          <div 
            className="carousel-track" 
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((src, index) => (
              <img key={index} src={src} alt={`Rescue Animal ${index + 1}`} />
            ))}
          </div>
        </div>

        <button className="carousel-btn next" onClick={() => moveSlide(1)}>
          &#10095;
        </button>
      </section>

    </div>
  );
};

export default Donation;