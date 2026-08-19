import express from 'express';
import { createLead, updateLeadCrmStatus } from '../controllers/leadController.js';

const router = express.Router();

// Middleware to verify calls from n8n
const verifyN8nCallback = (req, res, next) => {
  const secretHeader = req.headers['x-n8n-webhook-secret'];
  const localSecret = process.env.N8N_WEBHOOK_SECRET;

  if (localSecret && secretHeader !== localSecret) {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized signature mismatch'
    });
  }
  next();
};

// Public route to submit wedding leads
router.post('/', createLead);

// Callback endpoint for n8n to update lead CRM integration status
router.patch('/:id/crm', verifyN8nCallback, updateLeadCrmStatus);

export default router;
