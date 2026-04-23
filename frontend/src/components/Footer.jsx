import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    const location = useLocation();

    // Hide Footer when on any admin route, EXCEPT the admin login page
    if (location.pathname.startsWith('/admin') && location.pathname !== '/admin/login') {
        return null;
    }

    return (
        <footer className="footer">
            <div className="footer-container">

                {/* Column 1: About Us + Follow Us */}
                <div className="footer-about">
                    <h3>About Us</h3>
                    <p>We’re dedicated to rescuing and caring for animals in need, join us in making a real difference.</p>

                    <h3 className="footer-follow-heading">Follow Us</h3>
                    <div className="social-icons">
                        <a href="https://facebook.com/quietpaws" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" /></svg>
                        </a>
                        <a href="https://instagram.com/quietpaws" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.245 2.242 1.308 3.607.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.063 1.365-.333 2.632-1.308 3.607-.975.975-2.242 1.245-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.365-.063-2.632-.333-3.607-1.308-.975-.975-1.245-2.242-1.308-3.607-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.245 3.607-1.308 1.266-.058 1.646-.07 4.85-.07zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.28.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.058-1.28.072-1.689.072-4.948 0-3.259-.014-3.668-.072-4.948-.192-4.337-2.612-6.766-6.974-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                        </a>
                        <a href="https://twitter.com/quietpaws" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                        </a>
                        <a href="https://youtube.com/quietpaws" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                        </a>
                    </div>
                </div>

                {/* Column 2: Quick Links */}
                <div className="footer-links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/adopt">Adoption</Link></li>
                        <li><Link to="/donate">Donate</Link></li>
                        <li><Link to="/volunteer">Volunteer</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </div>

                {/* Column 3: Contact Info */}
                <div className="footer-contact">
                    <h3>Contact Info</h3>
                    <ul>
                        <li>
                            <a href="mailto:prabhatyadavmzp2003@gmail.com">
                                📧 prabhatyadavmzp2003@gmail.com
                            </a>
                        </li>
                        <li>
                            <a href="tel:+918052298282">
                                📞 8052298282
                            </a>
                        </li>
                        <li>
                            <a href="tel:+917007375902">
                                📞 7007375902
                            </a>
                        </li>
                    </ul>
                </div>

            </div>

            <div className="footer-bottom">
                <p>&copy; 2026 Animal Rescue. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;