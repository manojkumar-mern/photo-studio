import express from 'express';
import { updateDeliveryStatus } from '../controllers/automationController.js';

const router = express.Router();

// Middleware to verify calls from n8n using shared webhook secret
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

// Route mappings for portfolio and quotation callbacks
router.patch('/lead/:id/portfolio', verifyN8nCallback, updateDeliveryStatus('Lead', 'portfolio'));
router.patch('/lead/:id/quotation', verifyN8nCallback, updateDeliveryStatus('Lead', 'quotation'));
router.patch('/lead/:id/followup', verifyN8nCallback, updateDeliveryStatus('Lead', 'followup'));
router.patch('/booking/:id/portfolio', verifyN8nCallback, updateDeliveryStatus('Booking', 'portfolio'));
router.patch('/booking/:id/quotation', verifyN8nCallback, updateDeliveryStatus('Booking', 'quotation'));
router.patch('/booking/:id/followup', verifyN8nCallback, updateDeliveryStatus('Booking', 'followup'));

export default router;
