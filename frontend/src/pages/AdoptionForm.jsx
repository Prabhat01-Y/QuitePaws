import React, { useState } from 'react';
import './AdoptionForm.css';

const AdoptionForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    
    setIsSubmitted(true);
  };

  return (
    <div className="adoption-form-wrapper">
      <section className="form-container">
        
        {!isSubmitted ? (
          <>
            <header className="form-header">Adopt an Animal</header>
            <form onSubmit={handleSubmit} className="form">
              
              <div className="input-box">
                <i className="fas fa-user icon"></i>
                <input type="text" id="name" name="name" placeholder=" " required />
                <label htmlFor="name">Full Name</label>
              </div>
              
              <div className="input-box">
                <i className="fas fa-id-card icon"></i>
                <input type="text" id="aadhaar" name="aadhaar" placeholder=" " required />
                <label htmlFor="aadhaar">Aadhaar Card Number</label>
              </div>
              
              <div className="input-box">
                <i className="fas fa-phone icon"></i>
                <input type="tel" id="mobile" name="mobile" placeholder=" " required />
                <label htmlFor="mobile">Mobile Number</label>
              </div>

              <div className="input-box">
                <i className="fas fa-map-marker-alt icon"></i>
                <input type="text" id="location" name="location" placeholder=" " required />
                <label htmlFor="location">Location of Adoption</label>
              </div>

              <div className="input-box">
                <i className="fas fa-calendar-alt icon"></i>
                <input type="date" id="adoption-date" name="adoption-date" required />
                <label htmlFor="adoption-date" className="date-label">Adoption Date</label>
              </div>

              <div className="input-box">
                <i className="fas fa-home icon"></i>
                <input type="text" id="address" name="address" placeholder=" " required />
                <label htmlFor="address">Address</label>
              </div>
              
              <div className="input-box">
                <i className="fas fa-comment-dots icon"></i>
                <textarea id="message" name="message" placeholder=" " required></textarea>
                <label htmlFor="message">Message</label>
              </div>
              
              <button type="submit" className="submit-btn">Submit Application</button>
            </form>
          </>
        ) : (
          <div className="success-message">
            <h2>Thank you for your submission!</h2>
            <p>Our team will review your application and contact you shortly.</p>
            <button onClick={() => window.location.href='/adopt'} className="submit-btn" style={{marginTop: '20px'}}>
              Back to Animals
            </button>
          </div>
        )}

      </section>
    </div>
  );
};

export default AdoptionForm;