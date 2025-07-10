// utils/logger.js
const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logDir = path.join(__dirname, '../logs');
    this.ensureLogDir();
  }

  // Ensure logs directory exists
  ensureLogDir() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  // Get current timestamp
  getTimestamp() {
    return new Date().toISOString();
  }

  // Log info message
  info(message, data = null) {
    const logEntry = {
      level: 'INFO',
      timestamp: this.getTimestamp(),
      message,
      data
    };
    
    console.log(`[${logEntry.level}] ${logEntry.timestamp} - ${message}`, data || '');
    this.writeToFile('info.log', logEntry);
  }

  // Log error message
  error(message, error = null) {
    const logEntry = {
      level: 'ERROR',
      timestamp: this.getTimestamp(),
      message,
      error: error ? error.stack || error.message : null
    };
    
    console.error(`[${logEntry.level}] ${logEntry.timestamp} - ${message}`, error || '');
    this.writeToFile('error.log', logEntry);
  }

  // Log warning message
  warn(message, data = null) {
    const logEntry = {
      level: 'WARN',
      timestamp: this.getTimestamp(),
      message,
      data
    };
    
    console.warn(`[${logEntry.level}] ${logEntry.timestamp} - ${message}`, data || '');
    this.writeToFile('warn.log', logEntry);
  }

  // Write log entry to file
  writeToFile(filename, logEntry) {
    const logPath = path.join(this.logDir, filename);
    const logLine = JSON.stringify(logEntry) + '\n';
    
    fs.appendFileSync(logPath, logLine);
  }

  // Log contact form submission
  logContactSubmission(contact) {
    this.info('Contact form submission received', {
      name: contact.getFullName(),
      email: contact.email,
      subject: contact.subject,
      reference: contact.reference,
      timestamp: contact.submittedAt
    });
  }
}

module.exports = new Logger();
