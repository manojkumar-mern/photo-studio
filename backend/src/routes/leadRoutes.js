import express from 'express';
import { createLead } from '../controllers/leadController.js';

const router = express.Router();

// Public route to submit wedding leads
router.post('/', createLead);

export default router;
