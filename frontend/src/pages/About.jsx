import React, { useState, useEffect } from 'react';
import './About.css';

const About = () => {
  const [stats, setStats] = useState({
    rescues: 0,
    adoptions: 0,
    volunteers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/public/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Error fetching impact stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="about-page">
      {/* 1. Hero / Intro Section */}
      <section className="about-hero">
        <div className="container">
          <h1 className="hero-tagline">A quieter corner of the internet — for every paw that needs a home</h1>
          <p className="hero-description">
            QuietPaws is a community-driven platform connecting rescued animals with loving adopters, 
            dedicated volunteers, and compassionate donors across India. We believe every animal 
            deserves a second chance, and every act of rescue — no matter how small — matters.
          </p>
        </div>
      </section>

      {/* 2. Our Story Section */}
      <section className="about-story sec-padding">
        <div className="container">
          <div className="story-content">
            <h2 className="section-title">Our story</h2>
            <h3 className="section-subtitle">Born from a gap that cost lives</h3>
            <p>
              Every day, thousands of animals are abandoned, injured, or overlooked — not because 
              people don't care, but because the systems that should help them are broken. 
              Rescue calls go unanswered for hours. Adoption pages go stale for weeks. 
              Volunteers show up with nowhere to channel their energy.
            </p>
            <p>
              QuietPaws was built to change that. We started with a simple belief: if you could 
              make reporting an injured animal as easy as ordering food online, and make adopting 
              a pet as transparent as reading a product review — you'd save more lives. 
              So we built exactly that.
            </p>
            <p className="story-conclusion">
              Our mission is to make animal welfare faster, simpler, and more human — by bringing 
              rescue, adoption, and community together in one place.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Impact Section */}
      <section className="about-impact sec-padding">
        <div className="container">
          <h2 className="section-title">Impact so far</h2>
          <p className="section-description">Real lives transformed through community action</p>
          
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-number">{loading ? '...' : `${stats.rescues}+`}</span>
              <span className="stat-label">Animals rescued</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{loading ? '...' : `${stats.adoptions}+`}</span>
              <span className="stat-label">Successful adoptions</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{loading ? '...' : `${stats.volunteers}+`}</span>
              <span className="stat-label">Active volunteers</span>
            </div>
          </div>
          
          <p className="stats-footer">
            {loading ? 'Refreshing impact data...' : 'Live data synced from our rescue network. Every figure represents a life touched.'}
          </p>
        </div>
      </section>

      {/* 4. What We Do Section */}
      <section className="about-features sec-padding">
        <div className="container">
          <h2 className="section-title">What we do</h2>
          <p className="section-description">Three things we do really well</p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📍</div>
              <h4>Emergency rescue</h4>
              <p>Report injured or stray animals with a photo and your location. We alert nearby volunteers instantly.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🐾</div>
              <h4>Transparent adoption</h4>
              <p>Browse real profiles — health records, temperament notes, and rescue stories — before you commit.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h4>Volunteer network</h4>
              <p>Sign up, choose your availability, and get matched to rescue tasks near you. No experience needed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Our Values Section */}
      <section className="about-values sec-padding">
        <div className="container">
          <h2 className="section-title">Our values</h2>
          <p className="section-description">What we stand for</p>
          <div className="values-grid">
            <div className="value-item">
              <h5>Transparency</h5>
              <p>Every donation, every rescue case, every outcome is tracked and shared openly.</p>
            </div>
            <div className="value-item">
              <h5>Accessibility</h5>
              <p>Designed for everyone — from first-time reporters to seasoned shelter staff.</p>
            </div>
            <div className="value-item">
              <h5>Compassion</h5>
              <p>Animals and people alike. We build tools that feel human, not bureaucratic.</p>
            </div>
            <div className="value-item">
              <h5>Community</h5>
              <p>We don't save animals alone. Every rescue is a collaboration.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. The Team Section */}
      <section className="about-team sec-padding">
        <div className="container">
          <div className="team-intro card-simple">
            <h2 className="section-title">The team</h2>
            <p>
              QuietPaws is built and maintained by a small, passionate team of developers, 
              animal welfare advocates, and volunteers. We are not a corporation — we are people 
              who got tired of waiting for someone else to fix the problem. If you'd like to join 
              us, reach out through our Contact page or sign up as a volunteer.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Get Involved Section */}
      <section className="about-cta sec-padding">
        <div className="container">
          <div className="cta-box">
            <h2 className="section-title">Get involved</h2>
            <h3 className="section-subtitle">There's a role for everyone here</h3>
            <p>
              Whether you have five minutes to report an animal in distress, a weekend to volunteer, 
              or simply a home to offer — QuietPaws has a place for you.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;