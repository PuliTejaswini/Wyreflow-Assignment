// models/Contact.js
const mongoose = require('mongoose');
const validator = require('validator');
const Helpers = require('../utils/helpers');
const logger = require('../utils/logger');

// MongoDB Schema
const contactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxLength: [50, 'First name must be less than 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxLength: [50, 'Last name must be less than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    validate: [validator.isEmail, 'Please provide a valid email address']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    validate: {
      validator: function(phone) {
        return validator.isMobilePhone(phone, 'any', { strictMode: false });
      },
      message: 'Please provide a valid phone number'
    }
  },
  countryCode: {
    type: String,
    required: [true, 'Country code is required'],
    trim: true,
    default: '+1'
  },
  company: {
    type: String,
    trim: true,
    default: ''
  },
  interests: {
    type: String,
    required: [true, 'Interests are required'],
    trim: true,
    maxLength: [200, 'Interests must be less than 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    minLength: [10, 'Message must be at least 10 characters long'],
    maxLength: [1000, 'Message must be less than 1000 characters']
  },
  reference: {
    type: String,
    unique: true,
    index: true,
    default: function() {
      return Helpers.generateReference('CF');
    }
  },
  status: {
    type: String,
    enum: ['pending', 'read', 'responded', 'archived'],
    default: 'pending'
  },
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
contactSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Index for faster queries
contactSchema.index({ email: 1 });
contactSchema.index({ createdAt: -1 });

// Pre-save middleware for data sanitization
contactSchema.pre('save', function(next) {
  if (this.isModified('firstName')) {
    this.firstName = validator.escape(this.firstName);
  }
  if (this.isModified('lastName')) {
    this.lastName = validator.escape(this.lastName);
  }
  if (this.isModified('email')) {
    this.email = validator.normalizeEmail(this.email);
  }
  if (this.isModified('company')) {
    this.company = validator.escape(this.company);
  }
  if (this.isModified('interests')) {
    this.interests = validator.escape(this.interests);
  }
  if (this.isModified('message')) {
    this.message = validator.escape(this.message);
  }
  next();
});

// Static method for validation
contactSchema.statics.validateData = function(data) {
  const { firstName, lastName, email, phone, countryCode, interests, message } = data;
  const errors = {};

  // Validate required fields
  if (!firstName || !firstName.trim()) {
    errors.firstName = 'First name is required';
  } else if (firstName.length > 50) {
    errors.firstName = 'First name must be less than 50 characters';
  }

  if (!lastName || !lastName.trim()) {
    errors.lastName = 'Last name is required';
  } else if (lastName.length > 50) {
    errors.lastName = 'Last name must be less than 50 characters';
  }

  if (!email || !email.trim()) {
    errors.email = 'Email is required';
  } else if (!validator.isEmail(email)) {
    errors.email = 'Please provide a valid email address';
  }

  if (!phone || !phone.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!validator.isMobilePhone(phone, 'any', { strictMode: false })) {
    errors.phone = 'Please provide a valid phone number';
  }

  if (!countryCode || !countryCode.trim()) {
    errors.countryCode = 'Country code is required';
  }

  if (!interests || !interests.trim()) {
    errors.interests = 'Interests are required';
  } else if (interests.length > 200) {
    errors.interests = 'Interests must be less than 200 characters';
  }

  if (!message || !message.trim()) {
    errors.message = 'Message is required';
  } else if (message.length < 10) {
    errors.message = 'Message must be at least 10 characters long';
  } else if (message.length > 1000) {
    errors.message = 'Message must be less than 1000 characters';
  }

  return errors;
};

// Instance method to get formatted date
contactSchema.methods.getFormattedDate = function() {
  return this.createdAt.toLocaleString();
};

// Instance method to log submission
contactSchema.methods.logSubmission = function() {
  logger.info('Contact form submission saved to database', {
    name: this.fullName,
    email: this.email,
    phone: `${this.countryCode} ${this.phone}`,
    interests: this.interests,
    reference: this.reference,
    timestamp: this.createdAt
  });
};

// Create the model
const Contact = mongoose.model('Contact', contactSchema);

// Custom validation error class
class ValidationError extends Error {
  constructor(message, errors) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

module.exports = { Contact, ValidationError };
