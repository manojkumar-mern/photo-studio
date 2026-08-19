import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Lead from './models/Lead.js';
import Booking from './models/Booking.js';
import WhatsAppConversation from './models/WhatsAppConversation.js';
import { handleIncomingMessage } from './services/whatsapp/conversation.service.js';
import { syncBookingToZoho, syncLeadToZoho } from './services/zoho/zoho.service.js';

dotenv.config();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const runTests = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');

    // Cleanup previous test leftovers if any
    await Booking.deleteMany({ phone: { $in: ['1234567890', '8888888888', '9999999999', '7777777777', '5555555555'] } });
    await WhatsAppConversation.deleteMany({ phoneNumber: { $in: ['1234567890', '8888888888', '9999999999', '7777777777', '5555555555'] } });

    // ==========================================
    // TEST A: New WhatsApp booking -> new Zoho CRM record
    // ==========================================
    console.log('\n--- TEST A: New WhatsApp Booking (Phone: 1234567890) ---');
    
    // Simulate flow to complete a WhatsApp booking
    const fromA = '1234567890';
    
    // 1. Initialize conversation
    console.log('Simulating conversation welcome...');
    await handleIncomingMessage({ from: fromA, text: 'hi' });

    // 1.5. Click Book Session
    console.log('Clicking Book Session...');
    await handleIncomingMessage({ from: fromA, buttonPayload: 'menu_book_session' });

    // 2. Select service
    console.log('Selecting service...');
    await handleIncomingMessage({ from: fromA, listPayload: 'service_wedding' });

    // 3. Select package
    console.log('Selecting package...');
    await handleIncomingMessage({ from: fromA, buttonPayload: 'package_premium' });

    // 4. Enter date
    console.log('Entering date...');
    await handleIncomingMessage({ from: fromA, text: '2026-10-15' });

    // 5. Enter location
    console.log('Entering location...');
    await handleIncomingMessage({ from: fromA, text: 'Bangalore' });

    // 6. Enter name
    console.log('Entering name...');
    await handleIncomingMessage({ from: fromA, text: 'Alice Smith' });

    // 7. Enter requirements
    console.log('Entering requirements...');
    await handleIncomingMessage({ from: fromA, text: 'Outdoor photography requested' });

    // Verify confirmation state
    let convA = await WhatsAppConversation.findOne({ phoneNumber: fromA });
    console.log(`Conversation step is: ${convA.currentStep} (Expected: CONFIRMATION)`);

    // 8. Confirm Booking
    console.log('Confirming booking...');
    await handleIncomingMessage({ from: fromA, buttonPayload: 'confirm_booking_yes' });

    // Sleep to allow background sync to execute
    console.log('Waiting for background sync...');
    await sleep(1500);

    // Verify Booking saved and CRM status is synced
    const bookingA = await Booking.findOne({ phone: fromA });
    console.log('Saved Booking:', {
      name: bookingA.name,
      phone: bookingA.phone,
      service: bookingA.service,
      date: bookingA.date,
      message: bookingA.message,
      crm: bookingA.crm
    });
    if (bookingA.crm && bookingA.crm.status === 'synced' && bookingA.crm.zohoLeadId) {
      console.log('TEST A PASS!');
    } else {
      console.error('TEST A FAIL!');
    }

    // ==========================================
    // TEST B: Existing customer -> existing Zoho record updated
    // ==========================================
    console.log('\n--- TEST B: Duplicate Lookup / Existing Zoho Update (Phone: 8888888888) ---');
    const fromB = '8888888888';
    const bookingB = new Booking({
      name: 'Bob Duplicate',
      phone: fromB,
      service: 'Pre-Wedding Shoot (Elite)',
      date: new Date('2026-12-05'),
      message: 'WhatsApp Booking\nLocation: Chennai\nRequirements: None'
    });
    await bookingB.save();
    console.log(`Saved Booking B. Triggering sync...`);
    await syncBookingToZoho(bookingB._id);

    const updatedB = await Booking.findById(bookingB._id);
    console.log('Booking B CRM Status:', updatedB.crm);
    if (updatedB.crm && updatedB.crm.status === 'updated' && updatedB.crm.zohoLeadId === 'mock_zoho_lead_dup_555') {
      console.log('TEST B PASS!');
    } else {
      console.error('TEST B FAIL!');
    }

    // ==========================================
    // TEST C: Duplicate webhook/confirmation -> no duplicate CRM record
    // ==========================================
    console.log('\n--- TEST C: Double-Click / Idempotency protection check ---');
    // We already have conversation status: 'completed'
    // Sending confirm_booking_yes on a completed status should be ignored
    convA = await WhatsAppConversation.findOne({ phoneNumber: fromA });
    convA.status = 'completed';
    await convA.save();

    const initialBookingCount = await Booking.countDocuments({ phone: fromA });
    
    console.log('Sending duplicate confirm_booking_yes...');
    await handleIncomingMessage({ from: fromA, buttonPayload: 'confirm_booking_yes' });
    
    const finalBookingCount = await Booking.countDocuments({ phone: fromA });
    console.log(`Booking count: Initial = ${initialBookingCount}, Final = ${finalBookingCount}`);
    if (initialBookingCount === finalBookingCount) {
      console.log('TEST C PASS!');
    } else {
      console.error('TEST C FAIL!');
    }

    // ==========================================
    // TEST D: Zoho API failure -> booking remains saved and CRM status becomes failed
    // ==========================================
    console.log('\n--- TEST D: Zoho API Failure (Phone: 9999999999) ---');
    const fromD = '9999999999';
    const bookingD = new Booking({
      name: 'Failed Test',
      phone: fromD,
      service: 'Fine Art Portraiture (Standard)',
      date: new Date('2026-11-10'),
      message: 'WhatsApp Booking\nLocation: Mumbai\nRequirements: Test failure'
    });
    await bookingD.save();
    console.log(`Saved Booking D. Triggering sync...`);
    await syncBookingToZoho(bookingD._id);

    const updatedD = await Booking.findById(bookingD._id);
    console.log('Booking D CRM Status:', updatedD.crm);
    if (updatedD.crm && updatedD.crm.status === 'failed' && updatedD.crm.lastError) {
      console.log('TEST D PASS!');
    } else {
      console.error('TEST D FAIL!');
    }

    // ==========================================
    // TEST E: Retry after transient Zoho failure -> eventually synced
    // ==========================================
    console.log('\n--- TEST E: Transient Retry Success (Phone: 7777777777) ---');
    const fromE = '7777777777';
    const bookingE = new Booking({
      name: 'Retry Test',
      phone: fromE,
      service: 'Commercial Event (Premium)',
      date: new Date('2026-11-18'),
      message: 'WhatsApp Booking\nLocation: Pune\nRequirements: Test retry'
    });
    await bookingE.save();
    console.log(`Saved Booking E. Triggering sync...`);
    await syncBookingToZoho(bookingE._id);

    const updatedE = await Booking.findById(bookingE._id);
    console.log('Booking E CRM Status:', updatedE.crm);
    if (updatedE.crm && updatedE.crm.status === 'synced' && updatedE.crm.zohoLeadId) {
      console.log('TEST E PASS!');
    } else {
      console.error('TEST E FAIL!');
    }

    // ==========================================
    // TEST F: Missing optional email -> booking still synchronizes
    // ==========================================
    console.log('\n--- TEST F: Missing optional email (Phone: 5555555555) ---');
    const fromF = '5555555555';
    const bookingF = new Booking({
      name: 'No Email Test',
      phone: fromF,
      service: 'Wedding Documentary (Standard)',
      date: new Date('2027-01-10'),
      message: 'WhatsApp Booking\nLocation: Delhi\nRequirements: No email'
      // Note: email field is not defined (undefined/null)
    });
    await bookingF.save();
    console.log(`Saved Booking F. Triggering sync...`);
    await syncBookingToZoho(bookingF._id);

    const updatedF = await Booking.findById(bookingF._id);
    console.log('Booking F CRM Status:', updatedF.crm);
    if (updatedF.crm && updatedF.crm.status === 'synced' && updatedF.crm.zohoLeadId) {
      console.log('TEST F PASS!');
    } else {
      console.error('TEST F FAIL!');
    }

    // ==========================================
    // TEST G: Existing website booking regression
    // ==========================================
    console.log('\n--- TEST G: Website Booking Regression (Standard API create) ---');
    const bookingG = new Booking({
      name: 'Website Lead',
      email: 'website@example.com',
      phone: '4444444444',
      service: 'Wedding Documentary',
      date: new Date('2026-08-25'),
      message: 'Standard website booking query'
    });
    await bookingG.save();
    console.log('Saved Website Booking. Triggering sync...');
    await syncBookingToZoho(bookingG._id);
    const updatedG = await Booking.findById(bookingG._id);
    console.log('Website Booking CRM Status:', updatedG.crm);
    if (updatedG.crm && updatedG.crm.status === 'synced' && updatedG.crm.zohoLeadId) {
      console.log('TEST G PASS!');
    } else {
      console.error('TEST G FAIL!');
    }

    // ==========================================
    // TEST H: Existing WhatsApp conversation regression
    // ==========================================
    console.log('\n--- TEST H: WhatsApp Conversation Edit/Change Detail & Cancel regression ---');
    const fromH = '6666666666';
    
    // Welcome
    await handleIncomingMessage({ from: fromH, text: 'hi' });
    // Book session
    await handleIncomingMessage({ from: fromH, buttonPayload: 'menu_book_session' });
    // Select service
    await handleIncomingMessage({ from: fromH, listPayload: 'service_pre_wedding' });
    // Select package
    await handleIncomingMessage({ from: fromH, buttonPayload: 'package_premium' });
    // Enter Date
    await handleIncomingMessage({ from: fromH, text: '2026-09-12' });
    // Enter Location
    await handleIncomingMessage({ from: fromH, text: 'Chennai' });
    // Enter Name
    await handleIncomingMessage({ from: fromH, text: 'Charles X' });
    // Enter Requirements
    await handleIncomingMessage({ from: fromH, text: 'Drone shot' });

    let convH = await WhatsAppConversation.findOne({ phoneNumber: fromH });
    console.log(`Step before change: ${convH.currentStep} (Expected: CONFIRMATION), Service: ${convH.service}`);

    // Request Change
    console.log('Clicking change details...');
    await handleIncomingMessage({ from: fromH, buttonPayload: 'confirm_booking_change' });
    convH = await WhatsAppConversation.findOne({ phoneNumber: fromH });
    console.log(`Step after edit trigger: ${convH.currentStep} (Expected: CHANGE_DETAILS)`);

    // Choose to change service
    console.log('Changing service field...');
    await handleIncomingMessage({ from: fromH, listPayload: 'change_field_service' });
    convH = await WhatsAppConversation.findOne({ phoneNumber: fromH });
    console.log(`Step in sub-selection: ${convH.currentStep} (Expected: SERVICE_SELECTION)`);

    // Select pre-wedding again
    await handleIncomingMessage({ from: fromH, listPayload: 'service_pre_wedding' });
    convH = await WhatsAppConversation.findOne({ phoneNumber: fromH });
    console.log(`Returned to summary screen step: ${convH.currentStep} (Expected: CONFIRMATION)`);

    // Cancel conversation entirely
    console.log('Cancelling booking...');
    await handleIncomingMessage({ from: fromH, text: 'cancel' });
    convH = await WhatsAppConversation.findOne({ phoneNumber: fromH });
    console.log(`Step after cancellation: ${convH.currentStep} (Expected: WELCOME), Service: ${convH.service}`);
    if (convH.currentStep === 'WELCOME' && !convH.service) {
      console.log('TEST H PASS!');
    } else {
      console.error('TEST H FAIL!');
    }

    // ==========================================
    // TEST I: Existing Phase 3A Zoho lead sync regression
    // ==========================================
    console.log('\n--- TEST I: Existing Phase 3A Lead Sync Regression ---');
    const leadI = new Lead({
      name: 'Lead Regression',
      phone: '3333333333',
      email: 'lead@regression.com',
      weddingDate: new Date('2026-11-20'),
      weddingLocation: 'Chennai',
      packageInterest: 'Standard'
    });
    await leadI.save();
    console.log(`Saved Lead. Triggering sync...`);
    await syncLeadToZoho(leadI._id);
    const updatedLeadI = await Lead.findById(leadI._id);
    console.log('Lead Sync CRM Status:', updatedLeadI.crm);
    if (updatedLeadI.crm && updatedLeadI.crm.status === 'synced' && updatedLeadI.crm.zohoLeadId) {
      console.log('TEST I PASS!');
    } else {
      console.error('TEST I FAIL!');
    }

    // ==========================================
    // CLEANUP
    // ==========================================
    console.log('\nCleaning up test records...');
    await Booking.deleteMany({ phone: { $in: [fromA, fromB, fromD, fromE, fromF, '4444444444'] } });
    await WhatsAppConversation.deleteMany({ phoneNumber: { $in: [fromA, fromB, fromD, fromE, fromF, fromH] } });
    await Lead.deleteMany({ _id: leadI._id });
    console.log('Done cleaning up!');

  } catch (error) {
    console.error('Test execution failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
};

runTests();
