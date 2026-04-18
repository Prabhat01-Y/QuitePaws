import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import b1Img from '../assets/b1.jpg';

const Home = () => {
  const [activeQA, setActiveQA] = useState(null);

  const toggleQA = (index) => {
    setActiveQA(activeQA === index ? null : index);
  };

  const faqs = [
    {
      question: "How can I adopt a pet?",
      answer: "You can visit our adoption page, fill out an application, and schedule a visit."
    },
    {
      question: "How do I become a volunteer?",
      answer: "Fill out our volunteer form, and we will connect you with rescue organizations."
    },
    {
      question: "Can I foster an animal before adopting?",
      answer: "Yes! Many shelters offer foster programs where you can care for a pet temporarily."
    }
  ];

  return (
    <div className="home-wrapper">
      {/* Hero Section */}
      <section className="static-hero" style={{ backgroundImage: `url(${b1Img})` }}>
        <div className="static-hero-overlay"></div>
        
        <div className="hero-content">
          <div className="hero-subtitle">
            <span className="leaf-icon">🍃</span>
            <span>AN ADVENTURE OF</span>
            <span className="line-dec"></span>
          </div>
          
          <h1 className="hero-title">SAVING LIVES</h1>
          
          <p className="hero-desc">
            Rescuing wildlife, restoring hope, and protecting<br/>
            the beauty of our planet.
          </p>
          
          <div className="hero-buttons">
            <Link to="/emergency-report" className="hero-btn hero-btn--red">
              🚨 EMERGENCY REPORT <span className="arrow">›</span>
            </Link>
            <Link to="/donate" className="hero-btn hero-btn--green">
              🤲 DONATION <span className="arrow">›</span>
            </Link>
          </div>
        </div>

        {/* Feature Cards overlap */}
        <div className="hero-features">
          <div className="hf-card">
            <div className="hf-icon"><span className="hf-i">🛡️</span></div>
            <div className="hf-text">
              <h4>Wildlife Rescue</h4>
              <p>Quick response for injured animals</p>
            </div>
          </div>
          <div className="hf-card">
            <div className="hf-icon"><span className="hf-i">🌿</span></div>
            <div className="hf-text">
              <h4>Habitat Protection</h4>
              <p>Preserving natural homes & ecosystems</p>
            </div>
          </div>
          <div className="hf-card">
            <div className="hf-icon"><span className="hf-i">👥</span></div>
            <div className="hf-text">
              <h4>Community Support</h4>
              <p>Uniting people for a greater cause</p>
            </div>
          </div>
          <div className="hf-card">
            <div className="hf-icon"><span className="hf-i">💚</span></div>
            <div className="hf-text">
              <h4>Make a Difference</h4>
              <p>Your support saves lives</p>
            </div>
          </div>
        </div>

        {/* Bottom wave curve */}
        <div className="hero-wave">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,60 C320,120 420,-40 720,60 C1020,160 1120,0 1440,60 L1440,150 L0,150 Z" fill="#f8eedf"></path>
          </svg>
          <div className="wave-icon-center">🐾</div>
        </div>
      </section>

      {/* Mission Section */}
      <div className="sec" style={{ background: '#f8eedf', padding: '60px 40px', marginTop: '-5px' }}>
        <h2>🐾 Our Mission</h2>
        <p>
          Every day, countless animals suffer on the streets, abandoned, injured, and left without food or shelter.
          Our mission is to be their voice, their shelter, and their hope...
        </p>

        <h2>💡 How Our Platform Helps ?</h2>
        <p>
          ✔ Animal Rescue & Medical Care: We provide emergency rescues...<br/>
          ✔ Fundraising for Treatment: Shelters can raise funds...<br/>
          ✔ Adoption Services: Find loving homes...
        </p>
      </div>

      {/* Q&A Section */}
      <div className="qna-section" style={{ background: '#f8eedf' }}>
        <h2 style={{ textAlign: 'center', color: '#01e37f', marginBottom: '30px' }}>Q&A</h2>
        {faqs.map((faq, idx) => (
          <div className="question" key={idx}>
            <button className="qna-toggle" onClick={() => toggleQA(idx)}>
              {faq.question}
              <span className="qna-icon">{activeQA === idx ? '−' : '+'}</span>
            </button>
            <div className={`qna-answer-container ${activeQA === idx ? 'show' : ''}`}>
              <p className="qna-answer">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;