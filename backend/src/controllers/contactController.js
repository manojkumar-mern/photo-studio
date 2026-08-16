import { sendContactEmail } from '../config/emailService.js';

export const submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate presence of required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        status: 'error',
        message: 'Name, email, and message are required fields'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 'error',
        message: 'Please enter a valid email address'
      });
    }

    // Trigger contact email notification
    await sendContactEmail({ name, email, message });

    return res.status(200).json({
      status: 'success',
      message: 'Contact enquiry submitted and email sent successfully'
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to send contact notification email'
    });
  }
};
