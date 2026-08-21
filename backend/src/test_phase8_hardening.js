import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Lead from './models/Lead.js';
import Booking from './models/Booking.js';
import WhatsAppConversation from './models/WhatsAppConversation.js';
import { sendAutomationEvent } from './services/n8n/automation.service.js';
import { getPortfolioUrl, getQuotationUrl } from './config/resources.config.js';

dotenv.config();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const runHardeningTests = async () => {
  let serverProcess;
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');

    // Cleanup
    await Booking.deleteMany({ phone: { $in: ['9999900000', '9999900001'] } });
    await Lead.deleteMany({ phone: { $in: ['9999900000', '9999900001'] } });

    const serverUrl = `http://localhost:${process.env.PORT || 5000}`;

    // ==========================================
    // TEST A & B: Resource URL Accessibility
    // ==========================================
    console.log('\n--- TEST A & B: Portfolio and Quotation serving accessibility ---');
    const resPortfolio = await fetch(`${serverUrl}/portfolios/general.pdf`);
    const textPortfolio = await resPortfolio.text();
    console.log('Portfolio general.pdf fetch status:', resPortfolio.status);
    console.log('Portfolio content snippet:', textPortfolio.substring(0, 30));

    const resQuotation = await fetch(`${serverUrl}/quotations/general.pdf`);
    const textQuotation = await resQuotation.text();
    console.log('Quotation general.pdf fetch status:', resQuotation.status);
    console.log('Quotation content snippet:', textQuotation.substring(0, 30));

    if (resPortfolio.status === 200 && textPortfolio.includes('PDF') && resQuotation.status === 200 && textQuotation.includes('PDF')) {
      console.log('TEST A & B PASS!');
    } else {
      console.error('TEST A & B FAIL!');
    }

    // ==========================================
    // TEST C, D, E: Idempotency Key Checks
    // ==========================================
    console.log('\n--- TEST C, D, E: Stable Idempotency Key check ---');
    
    // Intercept fetch to inspect payload envelope
    const originalFetch = global.fetch;
    const capturedEnvelopes = [];
    global.fetch = async (url, options) => {
      if (url.includes('/api/automation') || url.includes('/api/payments')) {
        return originalFetch(url, options);
      }
      if (options && options.body) {
        try {
          const body = JSON.parse(options.body);
          if (body.idempotencyKey) {
            capturedEnvelopes.push(body);
          }
        } catch (e) {}
      }
      return {
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => ({ success: true }),
        text: async () => '{"success":true}'
      };
    };

    const bookingT = new Booking({
      name: 'Idempotency Test User',
      phone: '9999900000',
      service: 'Pre-Wedding Shoot (Standard)',
      date: new Date(),
      status: 'pending'
    });
    await bookingT.save();

    console.log('Triggering booking.status.updated event twice for pending status...');
    await sendAutomationEvent('booking.status.updated', bookingT);
    await sleep(50);
    await sendAutomationEvent('booking.status.updated', bookingT);

    const keys = capturedEnvelopes.map(e => e.idempotencyKey);
    console.log('Captured Idempotency Keys:', keys);

    if (keys.length === 2 && keys[0] === keys[1]) {
      console.log('TEST C & D PASS (Stable idempotency key matches for identical booking status updates)!');
    } else {
      console.error('TEST C & D FAIL!');
    }

    // Test Payment confirmed idempotency key stability
    capturedEnvelopes.length = 0;
    bookingT.payment = {
      status: 'paid',
      transactionId: 'txn_stable_123',
      amount: 1000,
      attempts: 1
    };
    await bookingT.save();

    await sendAutomationEvent('payment.confirmed', bookingT);
    await sendAutomationEvent('payment.confirmed', bookingT);
    const paymentKeys = capturedEnvelopes.map(e => e.idempotencyKey);
    console.log('Captured Payment Confirmed Keys:', paymentKeys);

    if (paymentKeys.length === 2 && paymentKeys[0] === paymentKeys[1] && paymentKeys[0].includes('txn_stable_123')) {
      console.log('TEST E PASS (Stable payment idempotency keys match using transactionId)!');
    } else {
      console.error('TEST E FAIL!');
    }

    // Restore fetch
    global.fetch = originalFetch;

    // Cleanup
    await Booking.deleteMany({ phone: { $in: ['9999900000', '9999900001'] } });
    await Lead.deleteMany({ phone: { $in: ['9999900000', '9999900001'] } });
    console.log('Database cleanup completed.');

  } catch (error) {
    console.error('Hardening tests failed with error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
};

runHardeningTests();
