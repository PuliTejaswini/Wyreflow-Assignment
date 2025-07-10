// routes/contactRoutes.js
const express = require('express');
const ContactController = require('../controllers/contactController');
const { validateContactForm } = require('../middleware/validation');

const router = express.Router();

// POST /api/contact - Submit contact form
router.post('/', validateContactForm, ContactController.submitContactForm);

// GET /api/contact/stats - Get contact statistics (for admin)
router.get('/stats', ContactController.getContactStats);

// GET /api/contact/all - Get all contacts with pagination (for admin)
router.get('/all', ContactController.getAllContacts);

// GET /api/contact/:reference - Get contact by reference (for admin)
router.get('/:reference', ContactController.getContactByReference);

// PUT /api/contact/:reference/status - Update contact status (for admin)
router.put('/:reference/status', ContactController.updateContactStatus);

module.exports = router;
