import Booking from '../models/Booking.js';
import { sendAutomationEvent } from '../services/n8n/automation.service.js';
import { syncBookingToZoho } from '../services/zoho/zoho.service.js';

/**
 * Handle incoming payment webhook/callback.
 * Supported status transitions:
 * - requested/processing/failed -> paid (booking status transitions to confirmed)
 * - requested/processing -> failed (booking status remains booked)
 */
export const handlePaymentWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-payment-signature'];
    const localSecret = process.env.PAYMENT_WEBHOOK_SECRET || 'mock_secret_key_123';

    // 1. Webhook authentication validation
    if (!signature || signature !== localSecret) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid or missing signature'
      });
    }

    const { bookingId, status: newPaymentStatus, transactionId, amount, error } = req.body;

    if (!bookingId || !newPaymentStatus || !['paid', 'failed'].includes(newPaymentStatus)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid webhook payload. bookingId and status (paid or failed) are required.'
      });
    }

    // 2. Identify the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking not found'
      });
    }

    const currentPaymentStatus = booking.payment?.status || 'pending';

    // 3. Idempotency: prevent duplicate processing if same transaction or already paid
    if (currentPaymentStatus === 'paid') {
      if (newPaymentStatus === 'paid' && booking.payment?.transactionId === transactionId) {
        return res.status(200).json({
          success: true,
          message: 'Payment already processed successfully',
          data: booking
        });
      }

      // Invalid state transition: paid -> anything else (unless refund/cancellation, which is not configured)
      return res.status(400).json({
        status: 'error',
        message: `Invalid state transition: cannot transition from ${currentPaymentStatus} to ${newPaymentStatus}`
      });
    }

    // Double check idempotency for transaction ID matching
    if (transactionId && booking.payment?.transactionId === transactionId && booking.payment?.status === 'paid') {
      return res.status(200).json({
        success: true,
        message: 'Payment with this transaction ID already processed',
        data: booking
      });
    }

    // Validate states transitions
    // Only pending, requested, processing, failed, cancelled can transition to paid or failed.
    // If transition is invalid, reject it
    if (!['pending', 'requested', 'processing', 'failed', 'cancelled'].includes(currentPaymentStatus)) {
      return res.status(400).json({
        status: 'error',
        message: `Transitioning from ${currentPaymentStatus} is not supported`
      });
    }

    // 4. Update payment state safely
    if (newPaymentStatus === 'paid') {
      if (!transactionId) {
        return res.status(400).json({
          status: 'error',
          message: 'transactionId is required for paid status'
        });
      }

      booking.payment.status = 'paid';
      booking.payment.paidAt = new Date();
      booking.payment.transactionId = transactionId;
      booking.payment.lastError = null;
      if (amount !== undefined) {
        booking.payment.amount = amount;
      }

      // Transition booking status
      booking.status = 'confirmed';
      await booking.save();

      // Direct Zoho CRM update (asynchronous/non-blocking)
      syncBookingToZoho(booking._id).catch((err) => {
        console.error('[Zoho CRM Sync] Direct CRM update failed after payment:', err);
      });

      // Emit payment.confirmed event to n8n
      sendAutomationEvent('payment.confirmed', booking).catch((err) => {
        console.error('[n8n Service] Failed to send payment.confirmed event:', err);
      });

      return res.status(200).json({
        success: true,
        message: 'Payment completed successfully and booking confirmed',
        data: booking
      });

    } else if (newPaymentStatus === 'failed') {
      booking.payment.status = 'failed';
      booking.payment.failedAt = new Date();
      booking.payment.lastError = error || 'Payment failed';
      booking.payment.attempts = (booking.payment.attempts || 0) + 1;
      if (transactionId) {
        booking.payment.transactionId = transactionId;
      }

      // Keep booking status as booked
      await booking.save();

      // Emit payment.failed event to n8n
      sendAutomationEvent('payment.failed', booking).catch((err) => {
        console.error('[n8n Service] Failed to send payment.failed event:', err);
      });

      return res.status(200).json({
        success: true,
        message: 'Payment failure registered successfully',
        data: booking
      });
    }

  } catch (error) {
    console.error('Error in payment webhook controller:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while processing webhook'
    });
  }
};
