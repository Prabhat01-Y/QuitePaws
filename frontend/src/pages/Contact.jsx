import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate sending - replace with actual backend call if needed
    setTimeout(() => {
      setStatus('Message sent! We will get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
      setLoading(false);
      setTimeout(() => setStatus(''), 4000);
    }, 1000);
  };

  return (
    <div className="contact-page-wrapper">
      <div className="contact-container">

        {/* LEFT: Simple Contact Form */}
        <form className="contact-left" onSubmit={handleSubmit}>
          <div className="contact-left-title">
            <h2>Get in Touch</h2>
            <p className="form-subtitle">Have questions? We'd love to hear from you.</p>
          </div>

          <div className="contact-input-group">
            <span className="contact-input-icon">👤</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="contact-inputs"
              required
            />
          </div>

          <div className="contact-input-group">
            <span className="contact-input-icon">✉️</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="contact-inputs"
              required
            />
          </div>

          <div className="contact-input-group contact-textarea-group">
            <span className="contact-input-icon" style={{paddingTop: '4px'}}>💬</span>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              className="contact-inputs"
              rows={5}
              required
            />
          </div>

          {status && <p className="status-message">{status}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : '✈️ Send Message'}
          </button>
        </form>

        {/* RIGHT: Contact Info Card */}
        <div className="contact-right">
          <div className="contact-info-card">
            <h2>CONTACT US</h2>
            <ul className="contact-info-list">
              <li>
                <span className="info-icon">📞</span>
                <span>+91 80522 98282</span>
              </li>
              <li>
                <span className="info-icon">📧</span>
                <span>prabhatyadavmzp2003@gmail.com</span>
              </li>
              <li>
                <span className="info-icon">📍</span>
                <span>Lucknow, Uttar Pradesh, India</span>
              </li>
            </ul>
            <div className="contact-character">🧑‍💼</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;