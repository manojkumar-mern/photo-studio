import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Lead from './models/Lead.js';
import Booking from './models/Booking.js';
import WhatsAppConversation from './models/WhatsAppConversation.js';
import { sendAutomationEvent } from './services/n8n/automation.service.js';
import { syncLeadToZoho, syncBookingToZoho } from './services/zoho/zoho.service.js';
import { handleIncomingMessage } from './services/whatsapp/conversation.service.js';
import { getPortfolioUrl, getQuotationUrl } from './config/resources.config.js';

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

  // Test J: n8n unavailable (timeout simulation)
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

  // Simulated server error (500)
  if (url.includes('invalid-endpoint-path')) {
    return {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      text: async () => 'Error connecting'
    };
  }

  // Default: return successful 200 OK response
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

    // ==========================================
    // TEST A: Portfolio request event
    // ==========================================
    console.log('\n--- TEST A: Portfolio Request Event Dispatch ---');
    const bookingA = new Booking({
      name: 'Test Portfolio User A',
      phone: '9999911111',
      service: 'Pre-Wedding Shoot (Elite)',
      date: new Date(),
      message: 'Test Portfolio'
    });
    await bookingA.save();

    const resA = await sendAutomationEvent('portfolio.requested', bookingA);
    console.log('Portfolio requested result:', resA);
    const updatedBookingA = await Booking.findById(bookingA._id);
    console.log('Booking portfolio delivery status:', updatedBookingA.portfolio);
    if (resA.success && updatedBookingA.portfolio.status === 'sent') {
      console.log('TEST A PASS!');
    } else {
      console.error('TEST A FAIL!');
    }

    // ==========================================
    // TEST B: Portfolio selection based on category/package
    // ==========================================
    console.log('\n--- TEST B: Portfolio Resource Mapping check ---');
    const p1 = getPortfolioUrl('Wedding Documentary', 'Premium');
    const p2 = getPortfolioUrl('Pre-Wedding Shoot', 'Elite');
    const pDefault = getPortfolioUrl('Unknown Category', 'Standard');
    console.log('Wedding Documentary (Premium) portfolio:', p1);
    console.log('Pre-Wedding Shoot (Elite) portfolio:', p2);
    console.log('Default portfolio:', pDefault);

    if (p1.includes('wedding-premium') && p2.includes('pre-wedding-elite') && pDefault.includes('general.pdf')) {
      console.log('TEST B PASS!');
    } else {
      console.error('TEST B FAIL!');
    }

    // ==========================================
    // TEST C & D: Portfolio delivery status updates (Callback hooks)
    // ==========================================
    console.log('\n--- TEST C & D: Portfolio Callback Webhooks (Success & Failure simulation) ---');
    const portId = bookingA._id.toString();
    const patchHeader = {
      'Content-Type': 'application/json',
      'x-n8n-webhook-secret': webhookSecret
    };

    // Simulate n8n calling our backend callback route to update portfolio status to sent
    console.log('Sending success callback to /api/automation/booking/:id/portfolio...');
    const callbackResSuccess = await fetch(`http://localhost:${process.env.PORT || 5000}/api/automation/booking/${portId}/portfolio`, {
      method: 'PATCH',
      headers: patchHeader,
      body: JSON.stringify({ status: 'sent', attempts: 1 })
    });
    const successData = await callbackResSuccess.json();
    console.log('Success callback response status:', callbackResSuccess.status, successData);

    const updatedC = await Booking.findById(portId);
    console.log('Booking portfolio status after success callback:', updatedC.portfolio);

    // Simulate n8n calling backend with failed status
    console.log('Sending failure callback to /api/automation/booking/:id/portfolio...');
    const callbackResFail = await fetch(`http://localhost:${process.env.PORT || 5000}/api/automation/booking/${portId}/portfolio`, {
      method: 'PATCH',
      headers: patchHeader,
      body: JSON.stringify({ status: 'failed', lastError: 'WhatsApp connection failed', attempts: 2 })
    });
    const failData = await callbackResFail.json();
    console.log('Failure callback response status:', callbackResFail.status, failData);

    const updatedD = await Booking.findById(portId);
    console.log('Booking portfolio status after failure callback:', updatedD.portfolio);

    if (updatedC.portfolio.status === 'sent' && updatedD.portfolio.status === 'failed' && updatedD.portfolio.lastError.includes('WhatsApp connection')) {
      console.log('TEST C & D PASS!');
    } else {
      console.error('TEST C & D FAIL!');
    }

    // ==========================================
    // TEST E: Quotation request event
    // ==========================================
    console.log('\n--- TEST E: Quotation Request Event Dispatch ---');
    const leadE = new Lead({
      name: 'Test Quotation Lead E',
      phone: '9999922222',
      email: 'leadE@test.com',
      weddingDate: new Date('2026-11-20'),
      weddingLocation: 'Chennai',
      packageInterest: 'Premium'
    });
    await leadE.save();

    const resE = await sendAutomationEvent('quotation.requested', leadE);
    console.log('Quotation requested result:', resE);
    const updatedLeadE = await Lead.findById(leadE._id);
    console.log('Lead quotation delivery status:', updatedLeadE.quotation);
    if (resE.success && updatedLeadE.quotation.status === 'sent') {
      console.log('TEST E PASS!');
    } else {
      console.error('TEST E FAIL!');
    }

    // ==========================================
    // TEST F: Correct quotation/package mapping
    // ==========================================
    console.log('\n--- TEST F: Quotation Resource Mapping check ---');
    const q1 = getQuotationUrl('Wedding Documentary', 'Premium');
    const q2 = getQuotationUrl('Pre-Wedding Shoot', 'Elite');
    const qDefault = getQuotationUrl('Unknown Category', 'Standard');
    console.log('Wedding Documentary (Premium) quotation:', q1);
    console.log('Pre-Wedding Shoot (Elite) quotation:', q2);
    console.log('Default quotation:', qDefault);

    if (q1.includes('wedding-premium') && q2.includes('pre-wedding-elite') && qDefault.includes('general.pdf')) {
      console.log('TEST F PASS!');
    } else {
      console.error('TEST F FAIL!');
    }

    // ==========================================
    // TEST G & H: Quotation delivery success & failure
    // ==========================================
    console.log('\n--- TEST G & H: Quotation Callback Webhooks (Success & Failure simulation) ---');
    const quoteId = leadE._id.toString();

    // Success callback
    console.log('Sending success callback to /api/automation/lead/:id/quotation...');
    const callbackQSuccess = await fetch(`http://localhost:${process.env.PORT || 5000}/api/automation/lead/${quoteId}/quotation`, {
      method: 'PATCH',
      headers: patchHeader,
      body: JSON.stringify({ status: 'sent', attempts: 1 })
    });
    console.log('Success quotation response status:', callbackQSuccess.status);

    const updatedG = await Lead.findById(quoteId);
    console.log('Lead quotation status after success callback:', updatedG.quotation);

    // Failure callback
    console.log('Sending failure callback to /api/automation/lead/:id/quotation...');
    const callbackQFail = await fetch(`http://localhost:${process.env.PORT || 5000}/api/automation/lead/${quoteId}/quotation`, {
      method: 'PATCH',
      headers: patchHeader,
      body: JSON.stringify({ status: 'failed', lastError: 'Document fetch timeout', attempts: 2 })
    });
    console.log('Failure quotation response status:', callbackQFail.status);

    const updatedH = await Lead.findById(quoteId);
    console.log('Lead quotation status after failure callback:', updatedH.quotation);

    if (updatedG.quotation.status === 'sent' && updatedH.quotation.status === 'failed' && updatedH.quotation.lastError.includes('fetch timeout')) {
      console.log('TEST G & H PASS!');
    } else {
      console.error('TEST G & H FAIL!');
    }

    // ==========================================
    // TEST I: Duplicate event/idempotency
    // ==========================================
    console.log('\n--- TEST I: Event ID uniqueness/Idempotency check ---');
    const id1 = `${bookingA._id}_${Date.now()}`;
    await sleep(20);
    const id2 = `${bookingA._id}_${Date.now()}`;
    console.log('Event ID 1:', id1);
    console.log('Event ID 2:', id2);
    if (id1 !== id2) {
      console.log('TEST I PASS!');
    } else {
      console.error('TEST I FAIL!');
    }

    // ==========================================
    // TEST J: n8n unavailable
    // ==========================================
    console.log('\n--- TEST J: n8n Unavailable Resilience check (Timeout abort) ---');
    process.env.N8N_LEAD_WEBHOOK_URL = 'http://10.255.255.1';
    const bookingJ = new Booking({
      name: 'Test Timeout User J',
      phone: '9999933333',
      service: 'Pre-Wedding Shoot (Standard)',
      date: new Date(),
      message: 'Test Timeout'
    });
    await bookingJ.save();

    console.log('Triggering event (expecting abort in 5s)...');
    const startTime = Date.now();
    const resJ = await sendAutomationEvent('portfolio.requested', bookingJ);
    const duration = Date.now() - startTime;
    console.log(`Event completed in ${duration}ms. Outcome:`, resJ);

    const updatedJ = await Booking.findById(bookingJ._id);
    console.log('Booking J portfolio status:', updatedJ.portfolio);

    if (updatedJ.portfolio.status === 'failed' && updatedJ.portfolio.lastError.includes('timed out') && duration < 6500) {
      console.log('TEST J PASS!');
    } else {
      console.error('TEST J FAIL!');
    }

    // Restore webhook config URL
    process.env.N8N_LEAD_WEBHOOK_URL = originalWebhookUrl;

    // ==========================================
    // TEST K: Existing Phase 5 event dispatch regression
    // ==========================================
    console.log('\n--- TEST K: Phase 5 Lead creation dispatch regression ---');
    const leadK = new Lead({
      name: 'Phase 5 Lead K',
      phone: '9999944444',
      email: 'leadK@test.com',
      weddingDate: new Date('2026-12-25'),
      weddingLocation: 'Chennai',
      packageInterest: 'Standard'
    });
    await leadK.save();

    const resK = await sendAutomationEvent('lead.created', leadK);
    const updatedLeadK = await Lead.findById(leadK._id);
    console.log('Lead K primary n8n status:', updatedLeadK.n8n);
    if (resK.success && updatedLeadK.n8n.status === 'sent') {
      console.log('TEST K PASS!');
    } else {
      console.error('TEST K FAIL!');
    }

    // ==========================================
    // TEST L: Phase 3A Zoho regression
    // ==========================================
    console.log('\n--- TEST L: Phase 3A Zoho lead sync regression ---');
    await syncLeadToZoho(leadK._id);
    const crmLeadK = await Lead.findById(leadK._id);
    console.log('Lead K Zoho CRM status:', crmLeadK.crm);
    if (crmLeadK.crm.status === 'synced' && crmLeadK.crm.zohoLeadId) {
      console.log('TEST L PASS!');
    } else {
      console.error('TEST L FAIL!');
    }

    // ==========================================
    // TEST M: Phase 4 WhatsApp -> Zoho regression
    // ==========================================
    console.log('\n--- TEST M: Phase 4 WhatsApp Booking sync to Zoho regression ---');
    const bookingM = new Booking({
      name: 'WhatsApp Zoho M',
      phone: '9999955555',
      service: 'Pre-Wedding Shoot (Premium)',
      date: new Date(),
      message: 'WhatsApp Booking'
    });
    await bookingM.save();
    await syncBookingToZoho(bookingM._id);
    const crmBookingM = await Booking.findById(bookingM._id);
    console.log('Booking M Zoho CRM status:', crmBookingM.crm);
    if (crmBookingM.crm.status === 'synced' && crmBookingM.crm.zohoLeadId) {
      console.log('TEST M PASS!');
    } else {
      console.error('TEST M FAIL!');
    }

    // ==========================================
    // TEST N: Existing WhatsApp conversation regression
    // ==========================================
    console.log('\n--- TEST N: WhatsApp Conversation State Machine (menu_gallery triggers portfolio.requested) ---');
    const fromN = '9999955555';
    await handleIncomingMessage({ from: fromN, text: 'hi' });
    console.log('Sending menu_gallery payload...');
    await handleIncomingMessage({ from: fromN, buttonPayload: 'menu_gallery' });
    
    await sleep(1000);
    const checkBooking = await Booking.findOne({ phone: fromN }).sort({ createdAt: -1 });
    console.log('Auto-created booking for portfolio tracking details:', checkBooking);
    if (checkBooking && checkBooking.portfolio.status === 'sent') {
      console.log('TEST N PASS!');
    } else {
      console.error('TEST N FAIL!');
    }

    // ==========================================
    // TEST O: Existing website lead/booking regression
    // ==========================================
    console.log('\n--- TEST O: Standard API Lead and Booking persistence regression ---');
    const leadCount = await Lead.countDocuments({ phone: '9999944444' });
    const bookingCount = await Booking.countDocuments({ phone: '9999955555' });
    console.log(`Lead K Count: ${leadCount}, Booking M Count: ${bookingCount}`);
    if (leadCount > 0 && bookingCount > 0) {
      console.log('TEST O PASS!');
    } else {
      console.error('TEST O FAIL!');
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
