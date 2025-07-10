// middleware/validation.js
const { Contact } = require('../models/Contact');

// Middleware to validate contact form data
const validateContactForm = (req, res, next) => {
  try {
    const errors = Contact.validateData(req.body);
    
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Validation error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { validateContactForm };