import express from 'express';
import { handlePaymentWebhook } from '../controllers/paymentController.js';

const router = express.Router();

// Webhook callback endpoint for payment provider
router.post('/webhook', handlePaymentWebhook);

export default router;
