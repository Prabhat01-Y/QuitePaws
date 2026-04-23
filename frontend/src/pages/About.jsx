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
          <h1 className="hero-tagline">A quieter corner of the internet, where every paw finds a home</h1>
          <p className="hero-description">
            QuietPaws is a community-led platform that connects rescued animals with caring adopters, dedicated volunteers, and kind-hearted donors across India. We believe every animal deserves a second chance and every small act of rescue truly matters.
          </p>
        </div>
      </section>

      {/* 2. Our Story Section */}
      <section className="about-story sec-padding">
        <div className="container">
          <div className="story-content">
            <h2 className="section-title">Our story</h2>
            <h3 className="section-subtitle">Born from a gap that once cost lives</h3>
            <p>
              Every day, countless animals are abandoned, injured, or simply overlooked not because people don’t care, but because the systems meant to help them fall short. Rescue calls often go unanswered. Adoption listings sit unchanged for weeks. And willing volunteers are left without a clear way to help.
            </p>
            <p>
              QuietPaws was built to change that. We started with a simple belief: if reporting an injured animal felt as easy as ordering food, and adopting a pet was as transparent as reading a review, more lives could be saved. So we set out to build exactly that.
            </p>
            <p className="story-conclusion">
              We’re on a mission to make animal welfare easier and more human, by uniting rescue, adoption, and community on a single platform.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Impact Section */}
      <section className="about-impact sec-padding">
        <div className="container">
          <h2 className="section-title">Impact so far</h2>
          <p className="section-description">Real lives changed through the power of community.</p>

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
              <div className="feature-icon">🆘</div>
              <h4>Emergency rescue</h4>
              <p>Report injured or stray animals with a photo and location, we’ll instantly notify nearby volunteers.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏠</div>
              <h4>Transparent adoption</h4>
              <p>Get to know each animal through real profiles—health details, behavior notes, and their rescue journey before you commi</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h4>Volunteer network</h4>
              <p>Join in, share when you’re available, and we’ll connect you with rescue opportunities near you no experience required.</p>
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
              <p>Every donation, rescue case, and outcome is tracked and shared openly..</p>
            </div>
            <div className="value-item">
              <h5>Accessibility</h5>
              <p>Built for everyone from first-time reporters to experienced shelter teams.</p>
            </div>
            <div className="value-item">
              <h5>Compassion</h5>
              <p>For animals and the people who care for them we create tools that feel simple, human, and easy to use</p>
            </div>
            <div className="value-item">
              <h5>Community</h5>
              <p>We don’t save animals alone every rescue is a shared effort.</p>
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
              QuietPaws is built and run by a small, passionate group of developers, animal welfare advocates, and volunteers. We’re not a corporation we’re people who got tired of waiting for change. If you’d like to be part of it, reach out through our Contact page or sign up as a volunteer.
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
              Whether you have five minutes to report an animal in need, a weekend to volunteer, or a home to offer there’s a place for you at QuietPaws.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;