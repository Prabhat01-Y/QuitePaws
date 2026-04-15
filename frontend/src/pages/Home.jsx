import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';


import bird1Img from '../assets/b1.jpg';
import bird2Img from '../assets/2bi.png';
import treeImg from '../assets/tree.png';
import rockImg from '../assets/rock.png';
import lakeImg from '../assets/lake.png';


import b1Img from '../assets/b1.jpg';
import c1Img from '../assets/c1.png';
import d1Img from '../assets/d1.png';

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

  
  useEffect(() => {
    const text = document.getElementById('text');
    const bird1 = document.getElementById('bird1');
    const bird2 = document.getElementById('bird2');
    const btn = document.getElementById('btn');
    const rocks = document.getElementById('rocks');
    const forest = document.getElementById('forest');
    const header = document.getElementById('header');

    const handleScroll = () => {
      let value = window.scrollY;
      
      if (text) text.style.top = 50 + value * -0.1 + '%';
      if (bird2) {
        bird2.style.top = value * -1.5 + 'px';
        bird2.style.left = value * 2 + 'px';
      }
      if (bird1) {
        bird1.style.top = value * -1.5 + 'px';
        bird1.style.left = value * -5 + 'px';
      }
      if (btn) btn.style.marginTop = value * 1.5 + 'px';
      if (rocks) rocks.style.top = value * -0.12 + 'px';
      if (forest) forest.style.top = value * 0.25 + 'px';
      if (header) header.style.top = value * 0.5 + 'px';
    };

    window.addEventListener('scroll', handleScroll);
    
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="home-wrapper">
      {/* Hero Section */}
      <section className="parallax-section">
        <h2 id="text"><span>An Adventure of Saving Lives!</span><br/>Rescue</h2>
        <img src={bird1Img} id="bird1" alt="bird" />
        <img src={bird2Img} id="bird2" alt="bird" />
        <img src={treeImg} id="forest" alt="forest" />
        <div id="btn" className="hero-buttons">
          <Link to="/donate" className="hero-btn hero-btn--donate">Donation</Link>
          <Link to="/contact" className="hero-btn hero-btn--emergency">
            🚨 Emergency Report
          </Link>
        </div>
        <img src={rockImg} id="rocks" alt="rocks" />
        <img src={lakeImg} id="water" alt="water" />
      </section>

      {/* Mission Section */}
      <div className="sec">
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

      {/* Rescue Stories Cards */}
      <div className="card-container">
        {[b1Img, c1Img, d1Img].map((imgSrc, idx) => ( 
          <div className="card" key={idx}>
            <div className="face face1">
              <div className="content">
                <img src={imgSrc} alt="Rescue animal" />
                <h3>Story {idx + 1}</h3>
              </div>
            </div>
            <div className="face face2">
              <div className="content">
                <p><b>Bruno’s Rescue:</b> Found injured on the streets, Bruno was given medical care and is now happily adopted.</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Q&A Section */}
      <div className="qna-section">
        <h2 style={{ textAlign: 'center', color: '#01e37f', marginBottom: '30px' }}>Q&A</h2>
        
        {/* Mapping through the new faqs array */}
        {faqs.map((faq, idx) => (
          <div className="question" key={idx}>
            <button className="qna-toggle" onClick={() => toggleQA(idx)}>
              {faq.question}
              <span className="qna-icon">{activeQA === idx ? '−' : '+'}</span>
            </button>
            
            {/* The Answer Container */}
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