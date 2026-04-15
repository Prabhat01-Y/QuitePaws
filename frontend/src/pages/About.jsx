import React from 'react';
import Navbar from '../components/Navbar';
import AboutHeroGraphic from '../components/AboutHeroGraphic';
import './About.css';

const About = () => {
  return (
    <div className="about-page-wrapper">
      <Navbar />
      
      <main className="about-content">
        <div className="about-text">
          <h1>Our Mission</h1>
          <p>
            At QuietPaws, we believe every animal deserves a second chance. 
            Our platform bridges the gap between overwhelmed animal shelters and 
            loving families looking to adopt.
          </p>
          <p>
            Founded on the principles of compassion and care, we provide a safe, 
            transparent, and efficient process for adoption, volunteering, and 
            community support.
          </p>
        </div>
        
        <div className="about-graphic-wrapper">
          <AboutHeroGraphic />
        </div>
      </main>

    </div>
  );
};

export default About;