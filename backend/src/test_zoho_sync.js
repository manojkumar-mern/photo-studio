import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Lead from './models/Lead.js';
import { syncLeadToZoho } from './services/zoho/zoho.service.js';

dotenv.config();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const runTests = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');

    // 1. Success Mock Lead
    console.log('\n--- TEST 1: New Lead Success Mock ---');
    const lead1 = new Lead({
      name: 'John Doe',
      phone: '1234567890',
      email: 'john@example.com',
      weddingDate: new Date('2026-11-20'),
      weddingLocation: 'Chennai',
      packageInterest: 'Standard'
    });
    await lead1.save();
    console.log(`Saved Lead ID ${lead1._id}. Triggering sync...`);
    await syncLeadToZoho(lead1._id);
    const updatedLead1 = await Lead.findById(lead1._id);
    console.log('Lead 1 Final CRM Status:', updatedLead1.crm);

    // 2. Duplicate Mock Lead
    console.log('\n--- TEST 2: Duplicate Lead Mock (Phone: 8888888888) ---');
    const lead2 = new Lead({
      name: 'Duplicate Test',
      phone: '8888888888',
      email: 'duplicate@test.com',
      weddingDate: new Date('2026-11-20'),
      weddingLocation: 'Chennai',
      packageInterest: 'Premium'
    });
    await lead2.save();
    console.log(`Saved Lead ID ${lead2._id}. Triggering sync...`);
    await syncLeadToZoho(lead2._id);
    const updatedLead2 = await Lead.findById(lead2._id);
    console.log('Lead 2 Final CRM Status:', updatedLead2.crm);

    // 3. Failure Mock Lead
    console.log('\n--- TEST 3: Failure Lead Mock (Phone: 9999999999) ---');
    const lead3 = new Lead({
      name: 'Failure Test',
      phone: '9999999999',
      email: 'fail@test.com',
      weddingDate: new Date('2026-11-20'),
      weddingLocation: 'Chennai',
      packageInterest: 'Elite'
    });
    await lead3.save();
    console.log(`Saved Lead ID ${lead3._id}. Triggering sync...`);
    await syncLeadToZoho(lead3._id);
    const updatedLead3 = await Lead.findById(lead3._id);
    console.log('Lead 3 Final CRM Status:', updatedLead3.crm);

    // 4. Retry Mock Lead
    console.log('\n--- TEST 4: Retry Lead Mock (Phone: 7777777777) ---');
    const lead4 = new Lead({
      name: 'Retry Test',
      phone: '7777777777',
      email: 'retry@test.com',
      weddingDate: new Date('2026-11-20'),
      weddingLocation: 'Chennai',
      packageInterest: 'Standard'
    });
    await lead4.save();
    console.log(`Saved Lead ID ${lead4._id}. Triggering sync...`);
    
    // We call syncLeadToZoho. It will fail on the first try but succeed on retry (within the function).
    await syncLeadToZoho(lead4._id);
    const updatedLead4 = await Lead.findById(lead4._id);
    console.log('Lead 4 Final CRM Status:', updatedLead4.crm);

    // Clean up test records
    console.log('\nCleaning up test records...');
    await Lead.deleteMany({
      _id: { $in: [lead1._id, lead2._id, lead3._id, lead4._id] }
    });
    console.log('Done cleaning up!');

  } catch (error) {
    console.error('Test execution failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
};

runTests();
