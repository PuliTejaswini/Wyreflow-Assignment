import React, { useState } from 'react';
import './Navbar.css';

const Navbar = ({ activeTab = 'contact' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="modern-header">
      <nav className="navbar">
        <div className="nav-container">
          {/* Logo */}
          <div className="nav-logo">
            <h2>WyreFlow</h2>
          </div>
          
          {/* Navigation Links */}
          <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
            <li className="nav-item">
              <a 
                href="#home" 
                className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <span className="nav-icon">🏠</span>
                Home
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="#career" 
                className={`nav-link ${activeTab === 'career' ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <span className="nav-icon">💼</span>
                Career
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="#pricing" 
                className={`nav-link ${activeTab === 'pricing' ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <span className="nav-icon">💰</span>
                Pricing
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="#contact" 
                className={`nav-link ${activeTab === 'contact' ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <span className="nav-icon">📞</span>
                Contact
              </a>
            </li>
            {/* Mobile Login - only visible on mobile */}
            <li className="nav-item mobile-login">
              <a 
                href="#login" 
                className="nav-link login-mobile"
                onClick={handleLinkClick}
              >
                <span className="nav-icon">👤</span>
                Login
              </a>
            </li>
          </ul>
          
          {/* Desktop Login Button */}
          <div className="nav-auth">
            <button className="login-btn">
              <span className="nav-icon">👤</span>
              Login
            </button>
          </div>
          
          {/* Mobile Menu Toggle */}
          <div 
            className={`nav-toggle ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={handleMenuToggle}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
