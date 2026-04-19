import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Adopt.css';

const Adopt = () => {
  const [animals, setAnimals] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/animals');
        if (!response.ok) throw new Error('Failed to load rescue animals');
        const data = await response.json();
        setAnimals(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchAnimals();
  }, []);

  const handleNext = () => {
    if (currentIndex < animals.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  if (loading) return <div className="adopt-loading"><h2>Searching for your best friend...</h2></div>;
  if (error) return <div className="adopt-error"><h2>Error: {error}</h2></div>;
  if (animals.length === 0) return <div className="adopt-empty"><h2>No animals available for adoption today.</h2></div>;

  const currentAnimal = animals[currentIndex];

  return (
    <div className="adopt-wrapper">
      <div className="container">
        
        {/* Header Section */}
        <header className="adopt-header">
          <span className="badge">🐾 Available For Adoption</span>
          <h1>Find Your Forever Friend</h1>
          <p>Each of these souls has a story. Could you be their next chapter?</p>
        </header>

        {/* Main Profile Card */}
        <div className="profile-card">
          <div className="profile-grid">
            
            {/* Image Section */}
            <div className="profile-image">
              <img src={currentAnimal.image} alt={currentAnimal.name} />
              <div className="image-overlay">
                <div className="tag">Ready for Adoption</div>
              </div>
            </div>

            {/* Info Section */}
            <div className="profile-info">
              <div className="info-header">
                <div className="name-breed">
                  <h2>{currentAnimal.name}</h2>
                  <span className="breed">Breed: {currentAnimal.breed}</span>
                </div>
                <div className="fee-tag">
                  ₹{currentAnimal.adoptionFee}
                  <span>Adoption Fee</span>
                </div>
              </div>

              <div className="personality-section">
                <h3>My Unique Paws-onality</h3>
                <div className="trait-badges">
                  {currentAnimal.personalityTraits.map((trait, index) => (
                    <span key={index} className="trait-badge">{trait}</span>
                  ))}
                </div>
              </div>

              <div className="description-text">
                <p>
                  {currentAnimal.name} is looking for a loving home that can provide 
                  the care and attention they deserve. This friend is fully vaccinated 
                  and ready to meet their new family.
                </p>
              </div>

              <div className="profile-actions">
                <Link to={`/adoption-form/${currentAnimal._id}`} className="adopt-btn">
                  Adopt {currentAnimal.name} 🐾
                </Link>
                <div className="social-share">
                  <span>Pin to Share</span>
                  <div className="share-dots">
                    <div className="dot red"></div>
                    <div className="dot blue"></div>
                    <div className="dot green"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nav Controls Integrated into Card Container */}
          <div className="card-nav">
             <button onClick={handlePrev} disabled={currentIndex === 0} className="nav-btn prev">
               <span>&larr;</span> Previous
             </button>
             <div className="indicator">
                {currentIndex + 1} / {animals.length}
             </div>
             <button onClick={handleNext} disabled={currentIndex === animals.length - 1} className="nav-btn next">
               Next <span>&rarr;</span>
             </button>
          </div>
        </div>

        {/* 4. Bottom Section with Preview & Transition */}
        <section className="adopt-bottom-section">
          <div className="container">
            <div className="bottom-content">
              <h3>More Friends Waiting...</h3>
              <div className="preview-strip">
                {animals.map((animal, idx) => (
                  <div 
                    key={animal._id} 
                    className={`preview-item ${idx === currentIndex ? 'active' : ''}`}
                    onClick={() => setCurrentIndex(idx)}
                  >
                    <img src={animal.image} alt="preview" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Wave Transition into Footer */}
          <div className="adopt-wave-footer">
            <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,0 C320,120 420,-40 720,60 C1020,160 1120,0 1440,0 L1440,150 L0,150 Z" fill="#222"></path>
            </svg>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Adopt;