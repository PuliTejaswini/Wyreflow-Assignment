// services/emailService.js
const nodemailer = require('nodemailer');
const emailTemplates = require('../templates/emailTemplates');

class EmailService {
  constructor() {
    this.transporter = null;
  }

  // Check if email is properly configured
  isEmailConfigured() {
    return process.env.EMAIL_USER && 
           process.env.EMAIL_PASS && 
           process.env.EMAIL_USER !== 'your_email@gmail.com' &&
           process.env.EMAIL_PASS !== 'your_app_password';
  }

  // Create email transporter
  createTransporter() {
    if (!this.isEmailConfigured()) {
      console.log('Email not configured - skipping email sending');
      return null;
    }

    if (!this.transporter) {
      console.log('Creating new email transporter with:', {
        user: process.env.EMAIL_USER,
        passLength: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0
      });
      
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    }
    return this.transporter;
  }

  // Send contact notification to admin
  async sendContactNotification(contact) {
    try {
      if (!this.isEmailConfigured()) {
        console.log('Email disabled - skipping admin notification');
        return { success: true, message: 'Email disabled - notification skipped' };
      }

      const transporter = this.createTransporter();
      if (!transporter) {
        return { success: false, error: 'Failed to create email transporter' };
      }
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
        subject: `Contact Form: ${contact.interests}`,
        html: emailTemplates.adminNotification(contact)
      };

      await transporter.sendMail(mailOptions);
      console.log('Admin notification email sent successfully');
      return { success: true, message: 'Admin notification sent' };
    } catch (error) {
      console.error('Error sending admin notification:', error);
      return { success: false, error: error.message };
    }
  }

  // Send auto-reply to user
  async sendAutoReply(contact) {
    try {
      if (!this.isEmailConfigured()) {
        console.log('Email disabled - skipping auto-reply');
        return { success: true, message: 'Email disabled - auto-reply skipped' };
      }

      const transporter = this.createTransporter();
      if (!transporter) {
        return { success: false, error: 'Failed to create email transporter' };
      }
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: contact.email,
        subject: 'Thank you for contacting us',
        html: emailTemplates.autoReply(contact)
      };

      await transporter.sendMail(mailOptions);
      console.log('Auto-reply email sent successfully');
      return { success: true, message: 'Auto-reply sent' };
    } catch (error) {
      console.error('Error sending auto-reply:', error);
      return { success: false, error: error.message };
    }
  }

  // Test email configuration
  async testEmailConfig() {
    try {
      const transporter = this.createTransporter();
      await transporter.verify();
      console.log('Email configuration is valid');
      return true;
    } catch (error) {
      console.error('Email configuration error:', error);
      return false;
    }
  }
}

module.exports = new EmailService();
