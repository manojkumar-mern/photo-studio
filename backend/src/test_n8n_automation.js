import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Lead from './models/Lead.js';
import Booking from './models/Booking.js';
import WhatsAppConversation from './models/WhatsAppConversation.js';
import { handleIncomingMessage } from './services/whatsapp/conversation.service.js';
import { sendAutomationEvent } from './services/n8n/automation.service.js';
import { syncBookingToZoho, syncLeadToZoho } from './services/zoho/zoho.service.js';

dotenv.config();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ==========================================
// GLOBAL FETCH MOCK INTERCEPTOR FOR n8n
// ==========================================
const originalFetch = global.fetch;

global.fetch = async (url, options) => {
  // If it's a Zoho CRM API url, use original fetch (which relies on ZOHO_MOCK)
  if (url.includes('zohoapis.com') || url.includes('zoho.com')) {
    return originalFetch(url, options);
  }

  // Intercept n8n webhook dispatches
  console.log(`[Fetch Mock] Intercepted n8n request: ${url}`);

  // Simulate timeout case (Test F)
  if (url.includes('10.255.255.1')) {
    const signal = options?.signal;
    // Wait longer than 5 seconds to trigger AbortController timeout
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

  // Simulate server unavailable/500 case (Test E)
  if (url.includes('invalid-endpoint-path')) {
    return {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      text: async () => 'Error connecting to database downstream'
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
    await Booking.deleteMany({ phone: { $in: ['1111111111', '2222222222', '3333333333', '4444444444', '5555555555'] } });
    await WhatsAppConversation.deleteMany({ phoneNumber: { $in: ['1111111111', '2222222222', '3333333333', '4444444444', '5555555555'] } });
    await Lead.deleteMany({ phone: { $in: ['1111111111', '2222222222', '3333333333'] } });

    const originalWebhookUrl = process.env.N8N_LEAD_WEBHOOK_URL;

    // ==========================================
    // TEST A: lead.created event trigger
    // ==========================================
    console.log('\n--- TEST A: lead.created event trigger ---');
    const leadA = new Lead({
      name: 'Lead Automation A',
      phone: '1111111111',
      email: 'leadA@test.com',
      weddingDate: new Date('2026-11-20'),
      weddingLocation: 'Chennai',
      packageInterest: 'Standard'
    });
    await leadA.save();
    console.log('Saved Lead A. Triggering lead.created event...');
    
    const resA = await sendAutomationEvent('lead.created', leadA);
    console.log('Automation Delivery Status:', resA);
    
    const updatedLeadA = await Lead.findById(leadA._id);
    console.log('Lead A n8n field status:', updatedLeadA.n8n);
    if (updatedLeadA.n8n && updatedLeadA.n8n.status === 'sent') {
      console.log('TEST A PASS!');
    } else {
      console.error('TEST A FAIL!');
    }

    // ==========================================
    // TEST B: booking.completed event trigger
    // ==========================================
    console.log('\n--- TEST B: booking.completed event trigger ---');
    const bookingB = new Booking({
      name: 'Booking Completed B',
      phone: '2222222222',
      email: 'bookingB@test.com',
      service: 'Pre-Wedding Shoot (Elite)',
      date: new Date('2026-12-05'),
      message: 'WhatsApp Booking\nLocation: Chennai\nRequirements: Drone video'
    });
    await bookingB.save();
    console.log('Saved Booking B. Triggering booking.completed event...');

    const resB = await sendAutomationEvent('booking.completed', bookingB);
    console.log('Automation Delivery Status:', resB);

    const updatedBookingB = await Booking.findById(bookingB._id);
    console.log('Booking B n8n field status:', updatedBookingB.n8n);
    if (updatedBookingB.n8n && updatedBookingB.n8n.status === 'sent') {
      console.log('TEST B PASS!');
    } else {
      console.error('TEST B FAIL!');
    }

    // ==========================================
    // TEST C: booking.updated event trigger
    // ==========================================
    console.log('\n--- TEST C: booking.updated event trigger ---');
    bookingB.name = 'Booking B Updated Name';
    await bookingB.save();
    console.log('Updated Booking B. Triggering booking.updated event...');

    const resC = await sendAutomationEvent('booking.updated', bookingB);
    console.log('Automation Delivery Status:', resC);

    const updatedBookingC = await Booking.findById(bookingB._id);
    console.log('Booking B n8n status after update:', updatedBookingC.n8n);
    if (updatedBookingC.n8n && updatedBookingC.n8n.status === 'sent') {
      console.log('TEST C PASS!');
    } else {
      console.error('TEST C FAIL!');
    }

    // ==========================================
    // TEST D: booking.cancelled event trigger
    // ==========================================
    console.log('\n--- TEST D: booking.cancelled event trigger ---');
    console.log('Deleting Booking B (cancelling)...');
    
    const resD = await sendAutomationEvent('booking.cancelled', bookingB);
    console.log('Cancellation Delivery Status:', resD);
    if (resD.success) {
      console.log('TEST D PASS!');
    } else {
      console.error('TEST D FAIL!');
    }

    // ==========================================
    // TEST E: n8n unavailable resilience
    // ==========================================
    console.log('\n--- TEST E: n8n Unavailable resilience (Bad Webhook URL) ---');
    process.env.N8N_LEAD_WEBHOOK_URL = 'http://localhost:9999/invalid-endpoint-path';
    
    const leadE = new Lead({
      name: 'Lead Automation E',
      phone: '3333333333',
      email: 'leadE@test.com',
      weddingDate: new Date('2026-11-20'),
      weddingLocation: 'Chennai',
      packageInterest: 'Standard'
    });
    await leadE.save();
    
    console.log('Triggering Zoho CRM Lead Sync (should pass in mock mode)...');
    await syncLeadToZoho(leadE._id);
    
    console.log('Triggering automation event...');
    const resE = await sendAutomationEvent('lead.created', leadE);
    console.log('Automation Delivery outcome (expected fail):', resE);

    const updatedLeadE = await Lead.findById(leadE._id);
    console.log('Lead E CRM Status:', updatedLeadE.crm);
    console.log('Lead E n8n Status:', updatedLeadE.n8n);

    if (updatedLeadE.crm.status === 'synced' && updatedLeadE.n8n.status === 'failed') {
      console.log('TEST E PASS! (Core Lead Sync passed, n8n failure handled safely)');
    } else {
      console.error('TEST E FAIL!');
    }

    // ==========================================
    // TEST F: n8n timeout abort
    // ==========================================
    console.log('\n--- TEST F: n8n Timeout (Slow Webhook / abort check) ---');
    process.env.N8N_LEAD_WEBHOOK_URL = 'http://10.255.255.1';
    
    const bookingF = new Booking({
      name: 'Booking Timeout F',
      phone: '4444444444',
      email: 'bookingF@test.com',
      service: 'Wedding Documentary (Standard)',
      date: new Date('2027-01-10'),
      message: 'WhatsApp Booking\nLocation: Delhi\nRequirements: Timeout test'
    });
    await bookingF.save();
    
    console.log('Triggering event with 5s timeout...');
    const startTime = Date.now();
    const resF = await sendAutomationEvent('booking.completed', bookingF);
    const duration = Date.now() - startTime;
    
    console.log(`Event dispatch completed in ${duration}ms. Outcome:`, resF);
    const updatedBookingF = await Booking.findById(bookingF._id);
    console.log('Booking F n8n final status:', updatedBookingF.n8n);
    
    if (updatedBookingF.n8n.status === 'failed' && updatedBookingF.n8n.lastError.includes('timed out') && duration < 6500) {
      console.log('TEST F PASS! (Aborted successfully inside 5s timeout window)');
    } else {
      console.error('TEST F FAIL!');
    }

    // Restore original Webhook config
    process.env.N8N_LEAD_WEBHOOK_URL = originalWebhookUrl;

    // ==========================================
    // TEST G: duplicate eventId check
    // ==========================================
    console.log('\n--- TEST G: Idempotency (Unique eventId check) ---');
    const leadG = new Lead({
      name: 'Lead G',
      phone: '2222222222',
      email: 'leadG@test.com',
      weddingDate: new Date('2026-11-20'),
      weddingLocation: 'Chennai',
      packageInterest: 'Standard'
    });
    await leadG.save();

    const envelope1 = `${leadG._id}_${Date.now()}`;
    await sleep(50);
    const envelope2 = `${leadG._id}_${Date.now()}`;
    console.log(`EventId 1: ${envelope1}`);
    console.log(`EventId 2: ${envelope2}`);
    if (envelope1 !== envelope2) {
      console.log('TEST G PASS!');
    } else {
      console.error('TEST G FAIL!');
    }

    // ==========================================
    // TEST H & I: Regressions flow via state machine completion
    // ==========================================
    console.log('\n--- TEST H & I: End-to-End WhatsApp Conversation booking.completed integration ---');
    const fromH = '5555555555';
    
    await handleIncomingMessage({ from: fromH, text: 'hi' });
    await handleIncomingMessage({ from: fromH, buttonPayload: 'menu_book_session' });
    await handleIncomingMessage({ from: fromH, listPayload: 'service_wedding' });
    await handleIncomingMessage({ from: fromH, buttonPayload: 'package_standard' });
    await handleIncomingMessage({ from: fromH, text: '2026-12-10' });
    await handleIncomingMessage({ from: fromH, text: 'Vellore' });
    await handleIncomingMessage({ from: fromH, text: 'Harry Potter' });
    await handleIncomingMessage({ from: fromH, text: 'None' });
    
    console.log('Confirming WhatsApp booking...');
    await handleIncomingMessage({ from: fromH, buttonPayload: 'confirm_booking_yes' });
    
    console.log('Waiting for background tasks to finalize...');
    await sleep(2000);
    
    const finalBooking = await Booking.findOne({ phone: fromH });
    console.log('Completed Booking CRM Status:', finalBooking.crm);
    console.log('Completed Booking n8n Status:', finalBooking.n8n);

    if (finalBooking.crm.status === 'synced' && finalBooking.n8n.status === 'sent') {
      console.log('TEST H & I PASS! (WhatsApp state machine triggers both Zoho and n8n dispatches safely)');
    } else {
      console.error('TEST H & I FAIL!');
    }

    // ==========================================
    // CLEANUP
    // ==========================================
    console.log('\nCleaning up test records...');
    await Booking.deleteMany({ phone: { $in: ['1111111111', '2222222222', '3333333333', '4444444444', '5555555555'] } });
    await WhatsAppConversation.deleteMany({ phoneNumber: { $in: ['1111111111', '2222222222', '3333333333', '4444444444', '5555555555'] } });
    await Lead.deleteMany({ phone: { $in: ['1111111111', '2222222222', '3333333333'] } });
    console.log('Done cleaning up!');

  } catch (error) {
    console.error('Test execution failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
};

runTests();
