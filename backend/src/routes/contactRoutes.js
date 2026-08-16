import express from 'express';
import { submitContactForm } from '../controllers/contactController.js';

const router = express.Router();

// Public route to submit contact forms
router.post('/', submitContactForm);

export default router;
