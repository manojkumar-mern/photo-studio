import express from 'express';
import { verifyWebhook, handleWebhook, handleMockWebhook } from '../controllers/whatsappController.js';

const router = express.Router();

// GET Webhook verification (Meta verification challenge)
router.get('/webhook', verifyWebhook);

// POST Webhook endpoint (Incoming Meta messages)
router.post('/webhook', handleWebhook);

// POST Mock Webhook endpoint (Testing state transitions in development)
router.post('/mock-webhook', handleMockWebhook);

export default router;
