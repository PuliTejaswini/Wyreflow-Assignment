// controllers/contactController.js
const { Contact, ValidationError } = require('../models/Contact');
const emailService = require('../services/emailService');
const logger = require('../utils/logger');

class ContactController {
  // Handle contact form submission
  static async submitContactForm(req, res) {
    try {
      // Validate the data first
      const errors = Contact.validateData(req.body);
      if (Object.keys(errors).length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors
        });
      }

      // Add IP address and user agent for tracking
      const contactData = {
        ...req.body,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent')
      };

      // Create and save contact to MongoDB
      const contact = new Contact(contactData);
      await contact.save();

      // Log the submission
      contact.logSubmission();

      // Send emails (don't fail the request if email fails)
      const emailResults = await Promise.allSettled([
        emailService.sendContactNotification(contact),
        emailService.sendAutoReply(contact)
      ]);

      // Log email results
      emailResults.forEach((result, index) => {
        const type = index === 0 ? 'admin notification' : 'auto-reply';
        if (result.status === 'fulfilled') {
          logger.info(`Email ${type}: ${result.value.message}`);
        } else {
          logger.error(`Email ${type} failed: ${result.reason}`);
        }
      });

      // Return success response
      res.status(200).json({
        success: true,
        message: 'Thank you for your message! We will get back to you soon.',
        data: {
          submittedAt: contact.createdAt.toISOString(),
          reference: contact.reference
        }
      });

    } catch (error) {
      if (error.name === 'ValidationError') {
        // Handle Mongoose validation errors
        const validationErrors = {};
        Object.keys(error.errors).forEach(key => {
          validationErrors[key] = error.errors[key].message;
        });

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationErrors
        });
      }

      logger.error('Error processing contact form:', error);

      res.status(500).json({
        success: false,
        message: 'Sorry, there was an error processing your message. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Get contact form statistics (for admin dashboard)
  static async getContactStats(req, res) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [
        totalSubmissions,
        todaySubmissions,
        lastSubmission,
        pendingSubmissions
      ] = await Promise.all([
        Contact.countDocuments(),
        Contact.countDocuments({ createdAt: { $gte: today } }),
        Contact.findOne({}, {}, { sort: { createdAt: -1 } }),
        Contact.countDocuments({ status: 'pending' })
      ]);

      const stats = {
        totalSubmissions,
        todaySubmissions,
        pendingSubmissions,
        lastSubmission: lastSubmission ? {
          name: lastSubmission.fullName,
          email: lastSubmission.email,
          subject: lastSubmission.subject,
          submittedAt: lastSubmission.createdAt,
          reference: lastSubmission.reference
        } : null,
        averageResponseTime: '2 hours' // This could be calculated from actual data
      };

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      logger.error('Error getting contact stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving contact statistics',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Get all contacts (for admin dashboard)
  static async getAllContacts(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const [contacts, total] = await Promise.all([
        Contact.find({})
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Contact.countDocuments()
      ]);

      res.json({
        success: true,
        data: {
          contacts,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            itemsPerPage: limit
          }
        }
      });
    } catch (error) {
      logger.error('Error getting all contacts:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving contacts',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Get contact by reference (for admin)
  static async getContactByReference(req, res) {
    try {
      const { reference } = req.params;
      const contact = await Contact.findOne({ reference });

      if (!contact) {
        return res.status(404).json({
          success: false,
          message: 'Contact not found'
        });
      }

      res.json({
        success: true,
        data: contact
      });
    } catch (error) {
      logger.error('Error getting contact by reference:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving contact',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Update contact status (for admin)
  static async updateContactStatus(req, res) {
    try {
      const { reference } = req.params;
      const { status } = req.body;

      const validStatuses = ['pending', 'read', 'responded', 'archived'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
        });
      }

      const contact = await Contact.findOneAndUpdate(
        { reference },
        { status },
        { new: true }
      );

      if (!contact) {
        return res.status(404).json({
          success: false,
          message: 'Contact not found'
        });
      }

      res.json({
        success: true,
        message: 'Contact status updated successfully',
        data: contact
      });
    } catch (error) {
      logger.error('Error updating contact status:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating contact status',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = ContactController;
