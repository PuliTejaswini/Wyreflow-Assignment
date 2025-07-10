import React, { useState } from 'react';
import './ContactUs.css';
import Navbar from './Navbar';
import config from '../config/config';

const ContactUs = () => {
  console.log('🔧 ContactUs component initialized');
  console.log('🎨 CSS should be loaded from ContactUs.css');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '+1',
    phone: '',
    company: '',
    interests: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log('📊 Current component state:', {
    formData,
    errors,
    isSubmitting
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('🔄 Field changed:', { name, value });
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      console.log('✅ Clearing error for field:', name);
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    console.log('🔍 Starting form validation with data:', formData);
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }
    
    if (!formData.interests.trim()) {
      newErrors.interests = 'Please select or specify your interests';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Please tell us what you would like to discuss';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Please provide more details (minimum 10 characters)';
    }
    
    console.log('📝 Validation results:', { 
      errorCount: Object.keys(newErrors).length,
      errors: newErrors 
    });
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🚀 Form submission started');
    
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      console.log('❌ Form validation failed:', newErrors);
      setErrors(newErrors);
      return;
    }
    
    console.log('✅ Form validation passed, sending to API...');
    setIsSubmitting(true);
    
    try {
      const apiUrl = `${config.API_BASE_URL}/contact`;
      console.log('📤 Sending request to:', apiUrl);
      console.log('📦 Request payload:', formData);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      console.log('📥 Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });
      
      const data = await response.json();
      console.log('📋 Response data:', data);
      
      if (response.ok && data.success) {
        console.log('🎉 Form submitted successfully!');
        
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          countryCode: '+1',
          phone: '',
          company: '',
          interests: '',
          message: ''
        });
        
        console.log('🔄 Form reset completed');
        alert(data.message || 'Thank you for your message! We will get back to you soon.');
      } else {
        console.log('⚠️ Server returned error:', data);
        
        // Handle validation errors from backend
        if (data.errors) {
          console.log('📝 Setting backend validation errors:', data.errors);
          setErrors(data.errors);
        } else {
          alert(data.message || 'Something went wrong. Please try again.');
        }
      }
    } catch (error) {
      console.error('💥 Network error occurred:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      console.log('🏁 Form submission completed');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      {/* Navigation Bar */}
      <Navbar activeTab="contact" />

      {/* Contact Us Content */}
      <div className="contact-us-container">
      <div className="contact-us-header">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
      </div>
      
      <div className="contact-us-content">
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <div className="contact-item">
            <span className="contact-icon">📧</span>
            <div>
              <h3>Email</h3>
              <p>contact@company.com</p>
            </div>
          </div>
          <div className="contact-item">
            <span className="contact-icon"></span>
            <div>
              <h3>Address</h3>
              <p>123 Business Street<br />Suite 100<br />City, State 12345</p>
            </div>
          </div>
          <div className="contact-item">
            <span className="contact-icon">🕒</span>
            <div>
              <h3>Business Hours</h3>
              <p>Monday - Friday: 9:00 AM - 6:00 PM<br />Saturday: 10:00 AM - 4:00 PM</p>
            </div>
          </div>
        </div>
        
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={errors.firstName ? 'error' : ''}
                placeholder="Enter your first name"
              />
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={errors.lastName ? 'error' : ''}
                placeholder="Enter your last name"
              />
              {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder="Enter your email address"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <div className="phone-input-group">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="country-code-select"
                >
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+86">🇨🇳 +86</option>
                  <option value="+81">🇯🇵 +81</option>
                  <option value="+49">🇩🇪 +49</option>
                  <option value="+33">🇫🇷 +33</option>
                  <option value="+39">🇮🇹 +39</option>
                  <option value="+34">🇪🇸 +34</option>
                  <option value="+7">🇷🇺 +7</option>
                  <option value="+55">🇧🇷 +55</option>
                  <option value="+52">🇲🇽 +52</option>
                  <option value="+61">🇦🇺 +61</option>
                  <option value="+82">🇰🇷 +82</option>
                  <option value="+65">🇸🇬 +65</option>
                </select>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? 'error' : ''}
                  placeholder="Enter your phone number"
                />
              </div>
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="company">Company (Optional)</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Enter your company name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="interests">Your Interests *</label>
            <textarea
              id="interests"
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              className={errors.interests ? 'error' : ''}
              placeholder="Tell us about your interests or select from suggestions below..."
              rows="3"
            />
            <div className="interest-suggestions">
              <span className="suggestion-label">Quick suggestions:</span>
              <div className="suggestion-buttons">
                <button 
                  type="button" 
                  className="suggestion-btn"
                  onClick={() => setFormData(prev => ({...prev, interests: 'Web Development & Design'}))}
                >
                  Web Development & Design
                </button>
                <button 
                  type="button" 
                  className="suggestion-btn"
                  onClick={() => setFormData(prev => ({...prev, interests: 'Digital Marketing & SEO'}))}
                >
                  Digital Marketing & SEO
                </button>
                <button 
                  type="button" 
                  className="suggestion-btn"
                  onClick={() => setFormData(prev => ({...prev, interests: 'E-commerce Solutions'}))}
                >
                  E-commerce Solutions
                </button>
                <button 
                  type="button" 
                  className="suggestion-btn"
                  onClick={() => setFormData(prev => ({...prev, interests: 'Mobile App Development'}))}
                >
                  Mobile App Development
                </button>
                <button 
                  type="button" 
                  className="suggestion-btn"
                  onClick={() => setFormData(prev => ({...prev, interests: 'Cloud Services & Hosting'}))}
                >
                  Cloud Services & Hosting
                </button>
                <button 
                  type="button" 
                  className="suggestion-btn"
                  onClick={() => setFormData(prev => ({...prev, interests: 'Data Analytics & AI'}))}
                >
                  Data Analytics & AI
                </button>
                <button 
                  type="button" 
                  className="suggestion-btn"
                  onClick={() => setFormData(prev => ({...prev, interests: 'Cybersecurity Solutions'}))}
                >
                  Cybersecurity Solutions
                </button>
                <button 
                  type="button" 
                  className="suggestion-btn"
                  onClick={() => setFormData(prev => ({...prev, interests: 'Consulting & Strategy'}))}
                >
                  Consulting & Strategy
                </button>
              </div>
            </div>
            {errors.interests && <span className="error-message">{errors.interests}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="message">What would you like to discuss? *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className={errors.message ? 'error' : ''}
              placeholder="Tell us more about your project, requirements, or questions... (minimum 10 characters)"
              rows="6"
            />
            {errors.message && <span className="error-message">{errors.message}</span>}
          </div>
          
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default ContactUs;
