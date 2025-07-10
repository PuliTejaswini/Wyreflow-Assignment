// utils/helpers.js
const crypto = require('crypto');

class Helpers {
  // Generate unique reference ID
  static generateReference(prefix = 'CF') {
    const timestamp = Date.now();
    const random = crypto.randomBytes(4).toString('hex');
    return `${prefix}-${timestamp}-${random}`;
  }

  // Sanitize string input
  static sanitizeString(str) {
    if (!str || typeof str !== 'string') return '';
    return str.trim().replace(/[<>]/g, '');
  }

  // Format phone number
  static formatPhoneNumber(phone) {
    if (!phone) return '';
    // Remove all non-numeric characters except +
    const cleaned = phone.replace(/[^\d+]/g, '');
    return cleaned;
  }

  // Generate response object
  static createResponse(success, message, data = null, errors = null) {
    const response = {
      success,
      message,
      timestamp: new Date().toISOString()
    };

    if (data) response.data = data;
    if (errors) response.errors = errors;

    return response;
  }

  // Check if email is valid domain
  static isValidEmailDomain(email) {
    const blockedDomains = ['10minutemail.com', 'tempmail.org', 'guerrillamail.com'];
    const domain = email.split('@')[1];
    return !blockedDomains.includes(domain);
  }

  // Rate limiting helper
  static createRateLimitMessage(windowMs, max) {
    const minutes = Math.floor(windowMs / 60000);
    return `Too many requests. Maximum ${max} requests per ${minutes} minutes allowed.`;
  }

  // Format date for display
  static formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

module.exports = Helpers;
