// templates/emailTemplates.js

class EmailTemplates {
  // Admin notification email template
  static adminNotification(contact) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2c3e50; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #667eea; margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${contact.fullName}</p>
          <p><strong>Email:</strong> <a href="mailto:${contact.email}">${contact.email}</a></p>
          <p><strong>Phone:</strong> <a href="tel:${contact.countryCode}${contact.phone}">${contact.countryCode} ${contact.phone}</a></p>
          ${contact.company ? `<p><strong>Company:</strong> ${contact.company}</p>` : ''}
          <p><strong>Reference:</strong> ${contact.reference}</p>
        </div>
        
        <div style="background: #fff; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0;">
          <h3 style="color: #2c3e50; margin-top: 0;">Interests</h3>
          <p>${contact.interests}</p>
        </div>
        
        <div style="background: #fff; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0;">
          <h3 style="color: #2c3e50; margin-top: 0;">What they want to discuss</h3>
          <p style="line-height: 1.6; white-space: pre-wrap;">${contact.message}</p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #7f8c8d; font-size: 12px;">
          <p>This message was sent from your website contact form on ${contact.getFormattedDate()}</p>
          <p>IP Address: ${contact.ipAddress || 'Unknown'}</p>
        </div>
      </div>
    `;
  }

  // Auto-reply email template
  static autoReply(contact) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2c3e50; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
          Thank You for Your Message
        </h2>
        
        <p>Dear ${contact.fullName},</p>
        
        <p>Thank you for contacting us. We have received your message and will get back to you as soon as possible.</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #667eea; margin-top: 0;">Your Message Details</h3>
          <p><strong>Interests:</strong> ${contact.interests}</p>
          <p><strong>Submitted on:</strong> ${contact.getFormattedDate()}</p>
          <p><strong>Reference Number:</strong> ${contact.reference}</p>
        </div>
        
        <p>Our team typically responds within 24-48 hours during business hours (Monday - Friday, 9:00 AM - 6:00 PM).</p>
        
        <p>If you have any urgent inquiries, please don't hesitate to call us directly.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
          <p>Best regards,<br>
          <strong>Customer Support Team</strong></p>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background: #e8f4f8; border-radius: 5px; font-size: 12px; color: #5a6c7d;">
          <p><strong>Note:</strong> This is an automated response. Please do not reply to this email directly.</p>
        </div>
      </div>
    `;
  }
}

module.exports = EmailTemplates;
