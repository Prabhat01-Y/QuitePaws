import React, { useState, useEffect } from 'react';
import './Adopt.css';
import { Link } from 'react-router-dom';

const Adopt = () => {
  const [animals, setAnimals] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/animals');

        if (!response.ok) {
          throw new Error('Could not fetch animals from the database');
        }

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
    if (currentIndex < animals.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (loading)
    return (
      <div className="loading-screen">
        <h2>Loading rescue animals...</h2>
      </div>
    );

  if (error)
    return (
      <div className="error-screen">
        <h2>Error: {error}</h2>
      </div>
    );

  if (animals.length === 0)
    return (
      <div className="empty-screen">
        <h2>No animals are currently available for adoption.</h2>
      </div>
    );

  const currentAnimal = animals[currentIndex];

  return (
    <div className="adopt-page">

      {/* NAVBAR */}
      <div className="navbar">
        <div className="logo">QuietPaws</div>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/volunteer">Volunteer</Link></li>
          <li><Link to="/donate">Donation</Link></li>
        </ul>
      </div>

      {/* MAIN CONTENT */}
      <main className="adopt-content">

        <section className="product active">

          {/* IMAGE SECTION */}
          <div className="product__photo">
            <div className="photo-container">
              <div className="photo-main">
                <img
                  src={currentAnimal.image}
                  alt={currentAnimal.name}
                />
              </div>
            </div>
          </div>

          {/* INFO SECTION */}
          <div className="product__info">
            <div className="title">
              <h1>{currentAnimal.name}</h1>
              <span>Breed : {currentAnimal.breed}</span>
            </div>

            <div className="price">
              ₹Rs <span>{currentAnimal.adoptionFee}/-</span>
            </div>

            <div className="adoption-amount">
              (Adoption Amount)
            </div>

            <div className="description">
              <h3>PERSONALITY</h3>
              <ul>
                {currentAnimal.personalityTraits.map((trait, index) => (
                  <li key={index}>{trait}</li>
                ))}
              </ul>
            </div>

            <Link to={`/adoption-form/${currentAnimal._id}`} className="buy--btn">
              ADOPT NOW
            </Link>
          </div>

        </section>

        {/* NAVIGATION BUTTONS (Below Section) */}
        <div className="nav-buttons">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === animals.length - 1}
          >
            Next
          </button>
        </div>

      </main>

    </div>
  );
};

export default Adopt;