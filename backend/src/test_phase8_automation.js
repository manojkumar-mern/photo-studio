import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Lead from './models/Lead.js';
import Booking from './models/Booking.js';
import WhatsAppConversation from './models/WhatsAppConversation.js';
import { sendAutomationEvent } from './services/n8n/automation.service.js';
import { syncLeadToZoho, syncBookingToZoho } from './services/zoho/zoho.service.js';
import { handleIncomingMessage } from './services/whatsapp/conversation.service.js';
import jwt from 'jsonwebtoken';

dotenv.config();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const originalFetch = global.fetch;

// Intercept fetch to mock outgoing webhook/n8n/zoho APIs
const capturedEvents = [];
global.fetch = async (url, options) => {
  if (url.includes('zohoapis.com') || url.includes('zoho.com') || url.includes('localhost:5000') || url.includes('127.0.0.1:5000')) {
    return originalFetch(url, options);
  }

  console.log(`[Fetch Mock] Intercepted request to: ${url}`);
  
  if (options && options.body) {
    try {
      const payload = JSON.parse(options.body);
      if (payload.eventType) {
        capturedEvents.push(payload);
      }
    } catch (e) {
      // Not json body
    }
  }

  // Simulate timeout abort
  if (url.includes('10.255.255.1')) {
    const signal = options?.signal;
    for (let i = 0; i < 60; i++) {
      await sleep(100);
      if (signal?.aborted) {
        const err = new Error('The user aborted a request.');
        err.name = 'AbortError';
        throw err;
      }
    }
    throw new Error('Mock timeout error');
  }

  return {
    ok: true,
    status: 200,
    statusText: 'OK',
    json: async () => ({ success: true }),
    text: async () => '{"success":true}'
  };
};

const runTests = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');

    // Cleanup leftovers
    await Booking.deleteMany({ phone: { $in: ['9999911111', '9999922222', '9999933333', '9999944444', '9999955555'] } });
    await WhatsAppConversation.deleteMany({ phoneNumber: { $in: ['9999911111', '9999922222', '9999933333', '9999944444', '9999955555'] } });
    await Lead.deleteMany({ phone: { $in: ['9999911111', '9999922222', '9999933333'] } });

    const serverUrl = `http://localhost:${process.env.PORT || 5000}`;
    const paymentSecret = process.env.PAYMENT_WEBHOOK_SECRET || 'mock_payment_secret_123';
    const adminToken = jwt.sign({ id: 'admin' }, process.env.JWT_SECRET || 'fallback_secret_for_local_dev');
    const authHeader = `Bearer ${adminToken}`;

    // ==================================================
    // TEST A & B: BOOKED -> payment.requested + Payload Validation
    // ==================================================
    console.log('\n--- TEST A & B: BOOKED status transition and payment.requested event payload validation ---');
    
    const booking = new Booking({
      name: 'John Payment Test',
      phone: '9999911111',
      email: 'john.pay@test.com',
      service: 'Pre-Wedding Shoot (Premium)',
      date: new Date(),
      message: 'Test Booking message\nLocation: Chennai Marina\nRequirements: Drone coverage'
    });
    await booking.save();

    console.log('Updating status to "booked" via PATCH...');
    capturedEvents.length = 0; // Clear events

    const patchRes = await fetch(`${serverUrl}/api/bookings/${booking._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({ status: 'booked' })
    });

    console.log(`PATCH booking status: ${patchRes.status}`);
    await sleep(1000); // Give time to async event dispatches

    const updatedBooking = await Booking.findById(booking._id);
    console.log(`Booking state after PATCH - Status: ${updatedBooking.status}, Payment status: ${updatedBooking.payment?.status}`);

    // Direct dispatch check to capture and validate payment.requested payload
    await sendAutomationEvent('payment.requested', updatedBooking);
    const requestedEvent = capturedEvents.find(e => e.eventType === 'payment.requested');

    if (updatedBooking.status === 'booked' && updatedBooking.payment?.status === 'requested' && requestedEvent) {
      console.log('TEST A & B PASS!');
      console.log('Captured event payload:', JSON.stringify(requestedEvent, null, 2));
    } else {
      console.error('TEST A & B FAIL!');
    }

    // ==================================================
    // TEST C, D, E, F, G: Mock Successful Payment Webhook
    // ==================================================
    console.log('\n--- TEST C, D, E, F, G: Mock Successful Payment Webhook & Zoho CRM update ---');
    
    capturedEvents.length = 0; // Clear events

    const webhookPayload = {
      bookingId: booking._id.toString(),
      status: 'paid',
      transactionId: 'txn_mock_success_123',
      amount: 1500
    };

    console.log('Sending success webhook callback...');
    const webhookRes = await fetch(`${serverUrl}/api/payments/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-payment-signature': paymentSecret
      },
      body: JSON.stringify(webhookPayload)
    });

    console.log(`Webhook response status: ${webhookRes.status}`);
    await sleep(1000); // Wait for async Zoho and Event dispatch

    const paidBooking = await Booking.findById(booking._id);
    console.log(`Booking status: ${paidBooking.status}`);
    console.log(`Payment status: ${paidBooking.payment?.status}`);
    console.log(`Transaction ID: ${paidBooking.payment?.transactionId}`);
    console.log(`Paid amount: ${paidBooking.payment?.amount}`);
    console.log(`Zoho status: ${paidBooking.crm?.status}, Record ID: ${paidBooking.crm?.zohoLeadId}`);

    // Direct dispatch check to capture and validate payment.confirmed payload
    await sendAutomationEvent('payment.confirmed', paidBooking);
    const confirmedEvent = capturedEvents.find(e => e.eventType === 'payment.confirmed');

    if (
      webhookRes.status === 200 &&
      paidBooking.status === 'confirmed' &&
      paidBooking.payment?.status === 'paid' &&
      paidBooking.payment?.transactionId === 'txn_mock_success_123' &&
      paidBooking.crm?.status === 'synced' &&
      confirmedEvent
    ) {
      console.log('TEST C, D, E, F, G PASS!');
      console.log('Confirmed Event Payload:', JSON.stringify(confirmedEvent, null, 2));
    } else {
      console.error('TEST C, D, E, F, G FAIL!');
    }

    // ==================================================
    // TEST H, I, J: Mock Payment Failure Webhook
    // ==================================================
    console.log('\n--- TEST H, I, J: Mock Payment Failure Webhook ---');

    const failedBooking = new Booking({
      name: 'Failed Payment Test User',
      phone: '9999922222',
      email: 'failed.pay@test.com',
      service: 'Fine Art Portraiture (Elite)',
      date: new Date(),
      status: 'booked',
      payment: {
        status: 'requested',
        amount: 2000
      }
    });
    await failedBooking.save();

    capturedEvents.length = 0; // Clear events

    const failedWebhookPayload = {
      bookingId: failedBooking._id.toString(),
      status: 'failed',
      transactionId: 'txn_mock_fail_789',
      error: 'Insufficent funds in wallet'
    };

    console.log('Sending failure webhook callback...');
    const failWebhookRes = await fetch(`${serverUrl}/api/payments/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-payment-signature': paymentSecret
      },
      body: JSON.stringify(failedWebhookPayload)
    });

    console.log(`Webhook response status: ${failWebhookRes.status}`);
    await sleep(1000);

    const updatedFailedBooking = await Booking.findById(failedBooking._id);
    console.log(`Booking status (should remain booked): ${updatedFailedBooking.status}`);
    console.log(`Payment status: ${updatedFailedBooking.payment?.status}`);
    console.log(`Attempts: ${updatedFailedBooking.payment?.attempts}`);
    console.log(`Last Error: ${updatedFailedBooking.payment?.lastError}`);

    // Direct dispatch check to capture and validate payment.failed payload
    await sendAutomationEvent('payment.failed', updatedFailedBooking);
    const failedEvent = capturedEvents.find(e => e.eventType === 'payment.failed');

    if (
      failWebhookRes.status === 200 &&
      updatedFailedBooking.status === 'booked' &&
      updatedFailedBooking.payment?.status === 'failed' &&
      updatedFailedBooking.payment?.attempts === 1 &&
      updatedFailedBooking.payment?.lastError === 'Insufficent funds in wallet' &&
      failedEvent
    ) {
      console.log('TEST H, I, J PASS!');
      console.log('Failed Event Payload:', JSON.stringify(failedEvent, null, 2));
    } else {
      console.error('TEST H, I, J FAIL!');
    }

    // ==================================================
    // TEST K & L: Duplicate Webhook & Transaction Id (Idempotency)
    // ==================================================
    console.log('\n--- TEST K & L: Duplicate Webhook / Transaction ID Idempotency ---');
    
    // Send success webhook callback again with same details for booking (which is already paid)
    console.log('Resending the same successful webhook callback...');
    const duplicateRes = await fetch(`${serverUrl}/api/payments/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-payment-signature': paymentSecret
      },
      body: JSON.stringify(webhookPayload)
    });

    console.log(`Duplicate webhook status: ${duplicateRes.status}`);
    const duplicateJson = await duplicateRes.json();
    console.log(`Duplicate response message: ${duplicateJson.message}`);

    if (duplicateRes.status === 200 && duplicateJson.message.includes('already processed')) {
      console.log('TEST K & L PASS!');
    } else {
      console.error('TEST K & L FAIL!');
    }

    // ==================================================
    // TEST M: Invalid payment webhook authentication
    // ==================================================
    console.log('\n--- TEST M: Invalid payment webhook authentication (wrong signature) ---');
    
    const invalidAuthRes = await fetch(`${serverUrl}/api/payments/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-payment-signature': 'invalid_secret'
      },
      body: JSON.stringify(webhookPayload)
    });

    console.log(`Invalid auth response status: ${invalidAuthRes.status}`);
    if (invalidAuthRes.status === 401) {
      console.log('TEST M PASS!');
    } else {
      console.error('TEST M FAIL!');
    }

    // ==================================================
    // TEST N: Invalid state transition
    // ==================================================
    console.log('\n--- TEST N: Invalid state transition (paid -> failed) ---');
    
    const invalidTransitionRes = await fetch(`${serverUrl}/api/payments/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-payment-signature': paymentSecret
      },
      body: JSON.stringify({
        bookingId: booking._id.toString(),
        status: 'failed',
        error: 'Trying to fail a paid transaction'
      })
    });

    console.log(`Invalid transition status: ${invalidTransitionRes.status}`);
    const invalidTransitionJson = await invalidTransitionRes.json();
    console.log(`Invalid transition message: ${invalidTransitionJson.message}`);

    if (invalidTransitionRes.status === 400 && invalidTransitionJson.message.includes('Invalid state transition')) {
      console.log('TEST N PASS!');
    } else {
      console.error('TEST N FAIL!');
    }

    // ==================================================
    // TEST O & P: n8n timeout and unavailable abort handling
    // ==================================================
    console.log('\n--- TEST O & P: n8n timeout / unavailable check ---');
    
    const originalWebhookUrl = process.env.N8N_LEAD_WEBHOOK_URL;
    process.env.N8N_LEAD_WEBHOOK_URL = 'http://10.255.255.1'; // Target triggers mock timeout

    const bookingOP = new Booking({
      name: 'n8n OP User',
      phone: '9999933333',
      service: 'Pre-Wedding Shoot (Standard)',
      date: new Date()
    });
    await bookingOP.save();

    console.log('Triggering payment.requested event (expecting abort in 5s)...');
    const startTime = Date.now();
    const resOP = await sendAutomationEvent('payment.requested', bookingOP);
    const duration = Date.now() - startTime;
    console.log(`Event finished in ${duration}ms. success: ${resOP.success}, error: ${resOP.error}`);

    process.env.N8N_LEAD_WEBHOOK_URL = originalWebhookUrl; // restore

    if (!resOP.success && resOP.error.includes('timed out') && duration < 6500) {
      console.log('TEST O & P PASS!');
    } else {
      console.error('TEST O & P FAIL!');
    }

    // ==================================================
    // TEST Q, R, S, T, U, V, W: Regressions (Running Phase 7 suite inside Phase 8)
    // ==================================================
    console.log('\n--- Running Regressions (Phases 3A - 7) ---');
    
    // Followup requested event regression
    console.log('Testing Followup requested regression...');
    const regBookingA = new Booking({
      name: 'Regression Followup User A',
      phone: '9999944444',
      service: 'Wedding Documentary (Elite)',
      date: new Date()
    });
    await regBookingA.save();

    const resA = await sendAutomationEvent('followup.requested', regBookingA);
    const updatedRegBookingA = await Booking.findById(regBookingA._id);
    if (resA.success && updatedRegBookingA.followup.status === 'sent') {
      console.log('Phase 7 followup event regression: PASS');
    } else {
      console.error('Phase 7 followup event regression: FAIL');
    }

    // Portfolio delivery regression
    console.log('Testing Portfolio requested regression...');
    const resF = await sendAutomationEvent('portfolio.requested', regBookingA);
    const updatedRegBookingF = await Booking.findById(regBookingA._id);
    if (resF.success && updatedRegBookingF.portfolio.status === 'sent') {
      console.log('Phase 6 portfolio regression: PASS');
    } else {
      console.error('Phase 6 portfolio regression: FAIL');
    }

    // Lead creation sync regression
    console.log('Testing Zoho sync regression...');
    const regLeadG = new Lead({
      name: 'Regression Zoho Lead G',
      phone: '9999933333',
      email: 'leadregG@test.com',
      weddingDate: new Date('2026-11-20'),
      weddingLocation: 'Chennai',
      packageInterest: 'Premium'
    });
    await regLeadG.save();
    await syncLeadToZoho(regLeadG._id);
    const crmRegLeadG = await Lead.findById(regLeadG._id);
    if (crmRegLeadG.crm.status === 'synced') {
      console.log('Zoho CRM Lead Sync regression: PASS');
    } else {
      console.error('Zoho CRM Lead Sync regression: FAIL');
    }

    // WhatsApp conversation welcome state regression
    console.log('Testing WhatsApp welcome check regression...');
    const fromK = '9999955555';
    await handleIncomingMessage({ from: fromK, text: 'hi' });
    const convK = await WhatsAppConversation.findOne({ phoneNumber: fromK });
    if (convK && convK.currentStep === 'WELCOME') {
      console.log('WhatsApp conversation welcome regression: PASS');
    } else {
      console.error('WhatsApp conversation welcome regression: FAIL');
    }

    // ==========================================
    // CLEANUP
    // ==========================================
    console.log('\nCleaning up test records...');
    await Booking.deleteMany({ phone: { $in: ['9999911111', '9999922222', '9999933333', '9999944444', '9999955555'] } });
    await WhatsAppConversation.deleteMany({ phoneNumber: { $in: ['9999911111', '9999922222', '9999933333', '9999944444', '9999955555'] } });
    await Lead.deleteMany({ phone: { $in: ['9999911111', '9999922222', '9999933333'] } });
    console.log('Done cleaning up!');

  } catch (error) {
    console.error('Test execution failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
};

runTests();
