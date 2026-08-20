import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Lead from './models/Lead.js';
import Booking from './models/Booking.js';
import WhatsAppConversation from './models/WhatsAppConversation.js';
import { sendAutomationEvent } from './services/n8n/automation.service.js';
import { syncLeadToZoho, syncBookingToZoho } from './services/zoho/zoho.service.js';
import { handleIncomingMessage } from './services/whatsapp/conversation.service.js';
import { getPortfolioUrl, getQuotationUrl } from './config/resources.config.js';
import jwt from 'jsonwebtoken';

dotenv.config();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ==========================================
// FETCH MOCK INTERCEPTOR
// ==========================================
const originalFetch = global.fetch;

global.fetch = async (url, options) => {
  if (url.includes('zohoapis.com') || url.includes('zoho.com') || url.includes('localhost:5000') || url.includes('127.0.0.1:5000')) {
    return originalFetch(url, options);
  }

  console.log(`[Fetch Mock] Intercepted request: ${url}`);

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

    // Cleanup previous test leftovers
    await Booking.deleteMany({ phone: { $in: ['9999911111', '9999922222', '9999933333', '9999944444', '9999955555'] } });
    await WhatsAppConversation.deleteMany({ phoneNumber: { $in: ['9999911111', '9999922222', '9999933333', '9999944444', '9999955555'] } });
    await Lead.deleteMany({ phone: { $in: ['9999911111', '9999922222', '9999933333'] } });

    const originalWebhookUrl = process.env.N8N_LEAD_WEBHOOK_URL;
    const webhookSecret = process.env.N8N_WEBHOOK_SECRET || 'dev_n8n_secret_123';
    const patchHeader = {
      'Content-Type': 'application/json',
      'x-n8n-webhook-secret': webhookSecret
    };

    // ==========================================
    // TEST A: Followup request event
    // ==========================================
    console.log('\n--- TEST A: Followup Request Event Dispatch ---');
    const bookingA = new Booking({
      name: 'Test Followup User A',
      phone: '9999911111',
      service: 'Wedding Documentary (Elite)',
      date: new Date(),
      message: 'Test Followup'
    });
    await bookingA.save();

    const resA = await sendAutomationEvent('followup.requested', bookingA);
    console.log('Followup requested result:', resA);
    const updatedBookingA = await Booking.findById(bookingA._id);
    console.log('Booking followup status:', updatedBookingA.followup);
    if (resA.success && updatedBookingA.followup.status === 'sent') {
      console.log('TEST A PASS!');
    } else {
      console.error('TEST A FAIL!');
    }

    // ==========================================
    // TEST B: Followup callback update success & failure
    // ==========================================
    console.log('\n--- TEST B: Followup Callback Webhooks (Success/Fail) ---');
    const followId = bookingA._id.toString();

    // Success callback
    console.log('Sending success callback to /api/automation/booking/:id/followup...');
    const callbackSuccess = await fetch(`http://localhost:${process.env.PORT || 5000}/api/automation/booking/${followId}/followup`, {
      method: 'PATCH',
      headers: patchHeader,
      body: JSON.stringify({ status: 'sent', attempts: 1 })
    });
    const updatedB1 = await Booking.findById(followId);
    console.log('Booking followup status after success:', updatedB1.followup);

    // Failure callback
    console.log('Sending failure callback to /api/automation/booking/:id/followup...');
    const callbackFail = await fetch(`http://localhost:${process.env.PORT || 5000}/api/automation/booking/${followId}/followup`, {
      method: 'PATCH',
      headers: patchHeader,
      body: JSON.stringify({ status: 'failed', lastError: 'Service delivery error', attempts: 2 })
    });
    const updatedB2 = await Booking.findById(followId);
    console.log('Booking followup status after failure:', updatedB2.followup);

    if (updatedB1.followup.status === 'sent' && updatedB2.followup.status === 'failed' && updatedB2.followup.lastError.includes('delivery error')) {
      console.log('TEST B PASS!');
    } else {
      console.error('TEST B FAIL!');
    }

    // ==========================================
    // TEST C: Status transition event - booking.status.updated & booking.booked
    // ==========================================
    console.log('\n--- TEST C: Booking status transitioned to "booked" ---');
    console.log('Signing admin JWT token...');
    const adminToken = jwt.sign({ id: 'admin' }, process.env.JWT_SECRET || 'fallback_secret_for_local_dev');
    const authHeader = `Bearer ${adminToken}`;

    console.log('Updating booking status to "booked" via PATCH...');
    const resUpdateBooked = await fetch(`http://localhost:${process.env.PORT || 5000}/api/bookings/${bookingA._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({ status: 'booked' })
    });
    console.log('PATCH update response status:', resUpdateBooked.status);

    await sleep(1000);
    const updatedC = await Booking.findById(bookingA._id);
    console.log('Booking C final status in DB:', updatedC.status);
    if (updatedC.status === 'booked') {
      console.log('TEST C PASS!');
    } else {
      console.error('TEST C FAIL!');
    }

    // ==========================================
    // TEST D: Status transition event - booking.not_booked
    // ==========================================
    console.log('\n--- TEST D: Booking status transitioned to "not_booked" ---');
    console.log('Updating booking status to "not_booked" via PATCH...');
    const resUpdateNotBooked = await fetch(`http://localhost:${process.env.PORT || 5000}/api/bookings/${bookingA._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({ status: 'not_booked' })
    });
    console.log('PATCH update response status:', resUpdateNotBooked.status);

    await sleep(1000);
    const updatedD = await Booking.findById(bookingA._id);
    console.log('Booking D final status in DB:', updatedD.status);
    if (updatedD.status === 'not_booked') {
      console.log('TEST D PASS!');
    } else {
      console.error('TEST D FAIL!');
    }

    // ==========================================
    // TEST E: n8n timeout abort
    // ==========================================
    console.log('\n--- TEST E: n8n Timeout Abort check (Timeout followup.requested) ---');
    process.env.N8N_LEAD_WEBHOOK_URL = 'http://10.255.255.1';
    const bookingE = new Booking({
      name: 'Test Timeout User E',
      phone: '9999922222',
      service: 'Pre-Wedding Shoot (Standard)',
      date: new Date(),
      message: 'Test Timeout'
    });
    await bookingE.save();

    console.log('Triggering event (expecting abort in 5s)...');
    const startTime = Date.now();
    const resE = await sendAutomationEvent('followup.requested', bookingE);
    const duration = Date.now() - startTime;
    console.log(`Event completed in ${duration}ms. Outcome:`, resE);

    const updatedE = await Booking.findById(bookingE._id);
    console.log('Booking E followup status:', updatedE.followup);

    if (updatedE.followup.status === 'failed' && updatedE.followup.lastError.includes('timed out') && duration < 6500) {
      console.log('TEST E PASS!');
    } else {
      console.error('TEST E FAIL!');
    }

    // Restore webhook config URL
    process.env.N8N_LEAD_WEBHOOK_URL = originalWebhookUrl;

    // ==========================================
    // TEST F: Phase 6 Portfolio regression
    // ==========================================
    console.log('\n--- TEST F: Portfolio delivery regression ---');
    const resF = await sendAutomationEvent('portfolio.requested', bookingA);
    const updatedF = await Booking.findById(bookingA._id);
    console.log('Portfolio delivery status:', updatedF.portfolio);
    if (resF.success && updatedF.portfolio.status === 'sent') {
      console.log('TEST F PASS!');
    } else {
      console.error('TEST F FAIL!');
    }

    // ==========================================
    // TEST G: Phase 6 Quotation regression
    // ==========================================
    console.log('\n--- TEST G: Quotation delivery regression ---');
    const leadG = new Lead({
      name: 'Test Quotation Lead G',
      phone: '9999933333',
      email: 'leadG@test.com',
      weddingDate: new Date('2026-11-20'),
      weddingLocation: 'Chennai',
      packageInterest: 'Premium'
    });
    await leadG.save();

    const resG = await sendAutomationEvent('quotation.requested', leadG);
    const updatedG = await Lead.findById(leadG._id);
    console.log('Lead G quotation delivery status:', updatedG.quotation);
    if (resG.success && updatedG.quotation.status === 'sent') {
      console.log('TEST G PASS!');
    } else {
      console.error('TEST G FAIL!');
    }

    // ==========================================
    // TEST H: Phase 5 Lead creation regression
    // ==========================================
    console.log('\n--- TEST H: Phase 5 Lead creation dispatch regression ---');
    const resH = await sendAutomationEvent('lead.created', leadG);
    const updatedLeadH = await Lead.findById(leadG._id);
    console.log('Lead H primary n8n status:', updatedLeadH.n8n);
    if (resH.success && updatedLeadH.n8n.status === 'sent') {
      console.log('TEST H PASS!');
    } else {
      console.error('TEST H FAIL!');
    }

    // ==========================================
    // TEST I: Phase 3A Zoho lead sync regression
    // ==========================================
    console.log('\n--- TEST I: Phase 3A Zoho lead sync regression ---');
    await syncLeadToZoho(leadG._id);
    const crmLeadI = await Lead.findById(leadG._id);
    console.log('Lead I Zoho CRM status:', crmLeadI.crm);
    if (crmLeadI.crm.status === 'synced' && crmLeadI.crm.zohoLeadId) {
      console.log('TEST I PASS!');
    } else {
      console.error('TEST I FAIL!');
    }

    // ==========================================
    // TEST J: Phase 4 WhatsApp Booking sync to Zoho regression
    // ==========================================
    console.log('\n--- TEST J: Phase 4 WhatsApp Booking sync to Zoho regression ---');
    const bookingJ = new Booking({
      name: 'WhatsApp Zoho J',
      phone: '9999944444',
      service: 'Pre-Wedding Shoot (Premium)',
      date: new Date(),
      message: 'WhatsApp Booking'
    });
    await bookingJ.save();
    await syncBookingToZoho(bookingJ._id);
    const crmBookingJ = await Booking.findById(bookingJ._id);
    console.log('Booking J Zoho CRM status:', crmBookingJ.crm);
    if (crmBookingJ.crm.status === 'synced' && crmBookingJ.crm.zohoLeadId) {
      console.log('TEST J PASS!');
    } else {
      console.error('TEST J FAIL!');
    }

    // ==========================================
    // TEST K: Existing WhatsApp conversation regression
    // ==========================================
    console.log('\n--- TEST K: WhatsApp Conversation State Machine welcome check ---');
    const fromK = '9999955555';
    await handleIncomingMessage({ from: fromK, text: 'hi' });
    const convK = await WhatsAppConversation.findOne({ phoneNumber: fromK });
    console.log('Conversation status after hi:', convK.currentStep);
    if (convK.currentStep === 'WELCOME') {
      console.log('TEST K PASS!');
    } else {
      console.error('TEST K FAIL!');
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
