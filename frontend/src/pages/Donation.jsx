import React, { useState } from 'react';
import './Donation.css';

// Importing existing assets
import img1 from '../assets/Donation1.jpg';
import img2 from '../assets/a.png';
import img3 from '../assets/b1.jpg';
import img4 from '../assets/c.png';
import img5 from '../assets/d.png';
import img6 from '../assets/Donation3..jpg'; 

const Donation = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);
  const [formData, setFormData] = useState({ 
    donorName: '', 
    donorEmail: '', 
    amount: '', 
    paymentMethod: 'UPI' 
  });
  const [statusMessage, setStatusMessage] = useState('');

  const images = [img1, img2, img3, img4, img5, img6];

  const moveSlide = (direction) => {
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + direction;
      if (nextIndex < 0) return images.length - 1;
      if (nextIndex >= images.length) return 0;
      return nextIndex;
    });
  };

  const handleTierSelect = (amount) => {
    setSelectedTier(amount);
    setFormData({ ...formData, amount: amount });
    setShowForm(true);
    // Smooth scroll to form
    setTimeout(() => {
      document.getElementById('donation-form-anchor')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('Processing your donation...');

    try {
      const response = await fetch('http://localhost:5000/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorName: formData.donorName,
          donorEmail: formData.donorEmail,
          amount: Number(formData.amount),
          paymentMethod: formData.paymentMethod,
        }),
      });

      if (response.ok) {
        setStatusMessage('Thank you! Your generosity is making a real difference.');
        setFormData({ donorName: '', donorEmail: '', amount: '', paymentMethod: 'UPI' });
        setTimeout(() => {
          setShowForm(false);
          setStatusMessage('');
          setSelectedTier(null);
        }, 4000);
      } else {
        setStatusMessage('Something went wrong. Please check your details and try again.');
      }
    } catch (error) {
      setStatusMessage('Connection failed. Please ensure the backend is running.');
    }
  };

  const tiers = [
    { amount: "500", label: "Medical Aid", desc: "Covers basic vaccinations and deworming for one rescue.", icon: "💊" },
    { amount: "1500", label: "Safe Haven", desc: "Provides food and shelter for an animal for an entire month.", icon: "🏠" },
    { amount: "5000", label: "Life Saver", desc: "Funds a critical emergency surgery for an injured stray.", icon: "❤️" }
  ];

  const handleCustomClick = () => {
    setShowForm(true);
    // Smooth scroll to form after it begins to expand
    setTimeout(() => {
      document.getElementById('donation-form-anchor')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="donation-container">
      {/* 1. Hero Section */}
      <section className="donation-hero">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <span className="hero-badge">Your Kindness Saves Lives</span>
          <h1>Give a Voice to the <br/><span>Voiceless</span></h1>
          <p>
            Every rupee you donate goes directly towards rescuing, treating, and 
            rehabilitating animals in distress across India. 100% transparency, 100% heart.
          </p>
          <div className="hero-cta">
            <button className="btn-primary" onClick={handleCustomClick}>Donate Custom Amount</button>
            <a href="#impact-tiers" className="btn-secondary">See Your Impact</a>
          </div>
        </div>
      </section>

      {/* 2. Impact Tiers Section */}
      <section id="impact-tiers" className="donation-tiers sec-padding">
        <div className="container">
          <div className="section-header">
            <span className="sub-title">Choose Your Impact</span>
            <h2>Small Acts, Big Changes</h2>
          </div>
          <div className="tiers-grid">
            {tiers.map((tier, idx) => (
              <div 
                key={idx} 
                className={`tier-card ${selectedTier === tier.amount ? 'active' : ''}`}
                onClick={() => handleTierSelect(tier.amount)}
              >
                <div className="tier-icon">{tier.icon}</div>
                <h3>₹{tier.amount}</h3>
                <h4>{tier.label}</h4>
                <p>{tier.desc}</p>
                <button className="select-tier-btn">Select This Tier</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Integrated Donation Form */}
      <section id="donation-form-anchor" className={`donation-form-section ${showForm ? 'visible' : 'hidden'}`}>
        <div className="container">
          <div className="form-wrapper">
            <div className="form-header">
              <h2>Complete Your Donation</h2>
              <p>Secure payment processing for your peace of mind.</p>
            </div>
            <form onSubmit={handleDonationSubmit} className="modern-form">
              <div className="form-grid">
                <div className="form-field">
                  <label>Full Name</label>
                  <input 
                    type="text" required 
                    value={formData.donorName} 
                    onChange={(e) => setFormData({ ...formData, donorName: e.target.value })} 
                  />
                </div>
                <div className="form-field">
                  <label>Email Address</label>
                  <input 
                    type="email" required 
                    value={formData.donorEmail} 
                    onChange={(e) => setFormData({ ...formData, donorEmail: e.target.value })} 
                  />
                </div>
                <div className="form-field">
                  <label>Amount (₹)</label>
                  <input 
                    type="number" min="1" required 
                    value={formData.amount} 
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })} 
                  />
                </div>
                <div className="form-field">
                  <label>Payment Method</label>
                  <select 
                    value={formData.paymentMethod} 
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  >
                    <option value="UPI">UPI / GPay</option>
                    <option value="Bank Transfer">Direct Bank Transfer</option>
                    <option value="QR Code">Scan QR Code</option>
                  </select>
                </div>
              </div>

              <div className="form-footer">
                <button type="submit" className="confirm-btn">Confirm ₹{formData.amount || '0'} Donation</button>
                <button type="button" className="cancel-text-btn" onClick={() => setShowForm(false)}>Maybe Later</button>
              </div>
            </form>
            {statusMessage && <div className="status-notification">{statusMessage}</div>}
          </div>
        </div>
      </section>

      {/* 4. Success Stories Gallery (Carousel) */}
      <section className="success-gallery sec-padding">
        <div className="container">
          <div className="section-header">
            <span className="sub-title">Healed Hearts</span>
            <h2>Lives You've Changed</h2>
          </div>
          
          <div className="gallery-main">
            <button className="nav-arrow prev" onClick={() => moveSlide(-1)}>&#10094;</button>
            <div className="viewer">
              <div 
                className="track" 
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {images.map((src, index) => (
                  <div key={index} className="slide">
                    <img src={src} alt={`Rescue Story ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
            <button className="nav-arrow next" onClick={() => moveSlide(1)}>&#10095;
            </button>
          </div>
        </div>
      </section>

      {/* 5. Values / Transparency */}
      <section className="transparency-section sec-padding">
        <div className="container">
          <div className="transparency-grid">
            <div className="t-item">
              <div className="t-icon">📊</div>
              <h4>Direct Impact</h4>
              <p>We provide medical receipts and rescue updates for major surgeries funded by you.</p>
            </div>
            <div className="t-item">
              <div className="t-icon">🔐</div>
              <h4>Secure Gifting</h4>
              <p>Your financial privacy is our priority. We use industry-standard encryption.</p>
            </div>
            <div className="t-item">
              <div className="t-icon">🌍</div>
              <h4>Local Support</h4>
              <p>We work with local clinics across India to keep rescue costs low and reachable.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Donation;