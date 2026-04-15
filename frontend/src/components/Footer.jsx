import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';


import fbIcon from '../assets/fb.webp'; 
import instaIcon from '../assets/insta.png';
import xIcon from '../assets/x.webp';
import ytIcon from '../assets/yt.webp';

const Footer = () => {
  return (
    <footer className="footer">
        <div className="footer-container">

            {/* Column 1: About Us + Follow Us */}
            <div className="footer-about">
                <h3>About Us</h3>
                <p>We are dedicated to rescuing and rehabilitating animals in need. Join us in making a difference!</p>

                <h3 className="footer-follow-heading">Follow Us</h3>
                <div className="social-icons">
                    <a href="#"><img src={fbIcon} alt="Facebook" /></a>
                    <a href="#"><img src={instaIcon} alt="Instagram" /></a>
                    <a href="#"><img src={xIcon} alt="Twitter" /></a>
                    <a href="#"><img src={ytIcon} alt="YouTube" /></a>
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