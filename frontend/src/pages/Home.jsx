import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [activeQA, setActiveQA] = useState(null);

  const toggleQA = (index) => {
    setActiveQA(activeQA === index ? null : index);
  };

  const faqs = [
    {
      question: "How can I adopt a pet at QuietPaws?",
      answer: "Browsing our portal is the first step. Once you find a furry friend you connect with, submit an application. Our team will review it and schedule a virtual or in-person meeting."
    },
    {
      question: "What is required to become a volunteer?",
      answer: "You just need a compassionate heart and some free time. We provide all necessary training for rescue reporting and animal care. Sign up through our Volunteer portal to get started!"
    },
    {
      question: "Can I foster an animal temporarily?",
      answer: "Yes! Fostering is a vital part of our mission. It helps animals transition from rescue to home life. We cover medical expenses and provide basic supplies for all our fosters."
    }
  ];

  return (
    <div className="home-container">
      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge">🐾 Saving Lives Every Day</div>
          <h1 className="hero-main-title">A Quiter Corner for <br /><span>Every Paw in Need</span></h1>
          <p className="hero-subtitle">
            Helping abandoned animals find the love they deserve.
            Whether it’s a rescue or a new home, we’re here to make sure they’re never alone again.
          </p>
          <div className="hero-cta-group">
            <Link to="/emergency-report" className="cta-btn cta-btn--emergency">
              Report Emergency 🚨
            </Link>
            <Link to="/adopt" className="cta-btn cta-btn--secondary">
              Find a Friend 🐾
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Services */}
      <section className="home-services sec-padding">
        <div className="container">
          <div className="section-header">
            <span className="sub-title">What We Do</span>
            <h2>Our Core Pillars</h2>
          </div>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🆘</div>
              <h3>Emergency Rescue</h3>
              <p>A real-time system that quickly notifies rescuers whenever an animal needs help.</p>
              <Link to="/emergency-report" className="service-link">Learn More ➔</Link>
            </div>
            <div className="service-card">
              <div className="service-icon">🏠</div>
              <h3>Smart Adoption</h3>
              <p>Helping you find the right companion with clear health info and personality details</p>
              <Link to="/adopt" className="service-link">Browse Pets ➔</Link>
            </div>
            <div className="service-card">
              <div className="service-icon">🤝</div>
              <h3>Volunteer Network</h3>
              <p>Be part of a growing community of animal lovers working hands-on to rescue and foster.</p>
              <Link to="/volunteer" className="service-link">Join Us ➔</Link>
            </div>
            <div className="service-card">
              <div className="service-icon">💝</div>
              <h3>Donation Drive</h3>
              <p>Supporting critical care and shelter essentials with full transparency and real impact you can follow.</p>
              <Link to="/donate" className="service-link">Donate Now ➔</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Success Stories */}
      <section className="featured-rescues sec-padding">
        <div className="container">
          <div className="section-header">
            <span className="sub-title">Success Stories</span>
            <h2>Recent Happy Tails</h2>
          </div>
          <div className="rescue-gallery">
            <div className="rescue-item">
              <div className="rescue-img-wrapper">
                <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=1000" alt="Rescued Dog" />
              </div>
              <div className="rescue-info">
                <h4>Buddy</h4>
                <span>Rescued from Mumbai</span>
                <p>"Buddy was found with a fractured paw. Today, he's living his best life!"</p>
              </div>
            </div>
            <div className="rescue-item">
              <div className="rescue-img-wrapper">
                <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=1000" alt="Rescued Cat" />
              </div>
              <div className="rescue-info">
                <h4>Whiskers</h4>
                <span>Ready for Adoption</span>
                <p>"A gentle soul looking for a quiet home to share her purrs."</p>
              </div>
            </div>
            <div className="rescue-item">
              <div className="rescue-img-wrapper">
                <img src="https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&q=80&w=1000" alt="Rescued Puppy" />
              </div>
              <div className="rescue-info">
                <h4>Luna</h4>
                <span>Fostered in Delhi</span>
                <p>"Recovering beautifully thanks to our amazing volunteer medical team."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FAQ */}
      <section className="home-faq sec-padding">
        <div className="container">
          <div className="faq-container">
            <div className="faq-header">
              <h2>Common Questions</h2>
              <p>Everything you need to know about helping our furry friends.</p>
            </div>
            <div className="faq-list">
              {faqs.map((faq, idx) => (
                <div className={`faq-card ${activeQA === idx ? 'active' : ''}`} key={idx} onClick={() => toggleQA(idx)}>
                  <div className="faq-question">
                    <span>{faq.question}</span>
                    <div className="plus-icon">{activeQA === idx ? '−' : '+'}</div>
                  </div>
                  {activeQA === idx && <div className="faq-answer">{faq.answer}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Footer */}
      <section className="final-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to make a difference?</h2>
            <p>Your support could be the second chance an animal is waiting for.</p>
            <div className="cta-btns">
              <Link to="/volunteer" className="cta-btn cta-btn--primary">Join the Community</Link>
              <Link to="/donate" className="cta-btn cta-btn--green">Support Our Mission</Link>
            </div>
          </div>
        </div>

        {/* Inverted wave to smooth transition into footer */}
        <div className="cta-wave-bottom">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,0 C320,120 420,-40 720,60 C1020,160 1120,0 1440,0 L1440,150 L0,150 Z" fill="#222"></path>
          </svg>
        </div>
      </section>
    </div>
  );
};

export default Home;