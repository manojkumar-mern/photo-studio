import Lead from '../../models/Lead.js';
import Booking from '../../models/Booking.js';
import { getAccessToken, invalidateAccessToken, isMockMode } from './zohoTokenManager.js';

/**
 * Normalizes phone numbers (e.g. keeps only digits and +).
 */
const normalizePhone = (phone) => {
  if (!phone) return '';
  return phone.replace(/[^\d+]/g, '');
};

/**
 * Parses full name into First Name and Last Name (mandatory in Zoho CRM Leads).
 */
const parseName = (fullName) => {
  const nameParts = (fullName || '').trim().split(/\s+/);
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '.'; // Fallback '.' as Zoho requires Last Name
  return { firstName, lastName };
};

/**
 * Retries a promise-returning function with exponential backoff.
 */
const retryWithBackoff = async (fn, retries = 2, delayMs = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    // Only retry transient errors
    const isTransient = error.isTransient || !error.status || [429, 500, 502, 503, 504].includes(error.status);
    if (!isTransient) throw error;

    console.warn(`[Zoho Sync] Transient error encountered. Retrying in ${delayMs}ms... Attempts remaining: ${retries}`);
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return retryWithBackoff(fn, retries - 1, delayMs * 2);
  }
};

/**
 * Mock helper to simulate Zoho API behaviors locally.
 */
const handleMockFlow = async (lead) => {
  const phone = normalizePhone(lead.phone);
  const email = lead.email ? lead.email.toLowerCase().trim() : '';

  console.log(`[Zoho CRM Mock] Simulating sync for Lead ID: ${lead._id} (Name: ${lead.name}, Phone: ${phone})`);

  // Simulate 500ms API latency
  await new Promise(resolve => setTimeout(resolve, 500));

  // 1. Simulate Failure Mode
  if (phone === '9999999999' || email === 'fail@test.com') {
    throw new Error('Simulated Zoho CRM API connection breakdown (Internal Server Error 500)');
  }

  // 2. Simulate Retry Mode (Success on second attempt)
  if (phone === '7777777777' || email === 'retry@test.com') {
    if (!global.retryCounts) global.retryCounts = {};
    if (!global.retryCounts[lead._id]) global.retryCounts[lead._id] = 0;

    global.retryCounts[lead._id]++;
    if (global.retryCounts[lead._id] < 2) {
      const err = new Error('Simulated Zoho API Timeout (Transient 504)');
      err.isTransient = true;
      throw err;
    }
    delete global.retryCounts[lead._id];
    console.log('[Zoho CRM Mock] Retry attempt succeeded!');
  }

  // 3. Simulate Duplicate Mode
  if (phone === '8888888888' || email === 'duplicate@test.com') {
    console.log('[Zoho CRM Mock] Duplicate Lead detected. Matching mock zohoLeadId: mock_zoho_lead_dup_555');
    return {
      action: 'updated',
      zohoLeadId: 'mock_zoho_lead_dup_555'
    };
  }

  // 4. Default: New Lead Success
  return {
    action: 'synced',
    zohoLeadId: `mock_zoho_lead_new_${Math.random().toString(36).substr(2, 9)}`
  };
};

/**
 * Searches Zoho Leads by phone or email.
 * 
 * @returns {Promise<string|null>} Zoho Lead ID if found, else null.
 */
export const searchLeadInZoho = async (email, phone) => {
  const apiBase = process.env.ZOHO_API_BASE_URL || 'https://www.zohoapis.com/crm/v2';
  const accessToken = await getAccessToken();

  const searchRequest = async (searchType, value) => {
    const url = `${apiBase}/Leads/search?${searchType}=${encodeURIComponent(value)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
      }
    });

    if (response.status === 401) {
      invalidateAccessToken();
      const err = new Error('Unauthorized - access token invalid');
      err.status = 401;
      throw err;
    }

    if (response.status === 204) {
      return null; // No content found
    }

    if (!response.ok) {
      const errorText = await response.text();
      const err = new Error(`Search failed: ${response.status} ${errorText}`);
      err.status = response.status;
      throw err;
    }

    const data = await response.json();
    if (data && data.data && data.data.length > 0) {
      return data.data[0].id;
    }
    return null;
  };

  // 1. Search by Phone first
  if (phone) {
    try {
      const normalized = normalizePhone(phone);
      const leadId = await searchRequest('phone', normalized);
      if (leadId) return leadId;
    } catch (err) {
      if (err.status === 401) throw err; // Escalate 401 for retry refresh
      console.warn(`[Zoho Search] Phone search failed: ${err.message}`);
    }
  }

  // 2. Search by Email next if phone search returned nothing
  if (email) {
    try {
      const leadId = await searchRequest('email', email);
      if (leadId) return leadId;
    } catch (err) {
      if (err.status === 401) throw err; // Escalate 401
      console.warn(`[Zoho Search] Email search failed: ${err.message}`);
    }
  }

  return null;
};

/**
 * Maps Photo Studio Lead fields to Zoho CRM Lead layout structure.
 */
const mapToZohoFields = (lead) => {
  const { firstName, lastName } = parseName(lead.name);
  
  return {
    First_Name: firstName,
    Last_Name: lastName,
    Phone: normalizePhone(lead.phone),
    Email: lead.email || '',
    Wedding_Date: lead.weddingDate ? lead.weddingDate.toISOString().split('T')[0] : '',
    Wedding_Location: lead.weddingLocation || '',
    Guest_Count: lead.guestCount !== undefined ? lead.guestCount : null,
    Package_Interest: lead.packageInterest || 'Not Sure',
    Description: lead.requirements || '',
    Lead_Source: lead.source || 'Website',
    Ad_Campaign: lead.sourceCampaign || '',
    Ad_Medium: lead.sourceMedium || '',
    Internal_Lead_Id: lead._id.toString()
  };
};

/**
 * Creates a Lead record directly in Zoho CRM.
 */
export const createLeadInZoho = async (lead) => {
  const apiBase = process.env.ZOHO_API_BASE_URL || 'https://www.zohoapis.com/crm/v2';
  const accessToken = await getAccessToken();
  const payload = {
    data: [mapToZohoFields(lead)]
  };

  const response = await fetch(`${apiBase}/Leads`, {
    method: 'POST',
    headers: {
      'Authorization': `Zoho-oauthtoken ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (response.status === 401) {
    invalidateAccessToken();
    const err = new Error('Unauthorized');
    err.status = 401;
    throw err;
  }

  if (!response.ok) {
    const errorText = await response.text();
    const err = new Error(`Create failed: ${response.status} ${errorText}`);
    err.status = response.status;
    throw err;
  }

  const result = await response.json();
  if (result.data && result.data[0] && result.data[0].status === 'success') {
    return result.data[0].details.id;
  } else {
    const msg = result.data?.[0]?.message || 'Zoho CRM rejected the record submission';
    throw new Error(msg);
  }
};

/**
 * Updates a Lead record directly in Zoho CRM.
 */
export const updateLeadInZoho = async (zohoLeadId, lead) => {
  const apiBase = process.env.ZOHO_API_BASE_URL || 'https://www.zohoapis.com/crm/v2';
  const accessToken = await getAccessToken();
  const payload = {
    data: [{
      id: zohoLeadId,
      ...mapToZohoFields(lead)
    }]
  };

  const response = await fetch(`${apiBase}/Leads`, {
    method: 'PUT',
    headers: {
      'Authorization': `Zoho-oauthtoken ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (response.status === 401) {
    invalidateAccessToken();
    const err = new Error('Unauthorized');
    err.status = 401;
    throw err;
  }

  if (!response.ok) {
    const errorText = await response.text();
    const err = new Error(`Update failed: ${response.status} ${errorText}`);
    err.status = response.status;
    throw err;
  }

  const result = await response.json();
  if (result.data && result.data[0] && result.data[0].status === 'success') {
    return result.data[0].details.id;
  } else {
    const msg = result.data?.[0]?.message || 'Zoho CRM rejected the record update';
    throw new Error(msg);
  }
};

/**
 * Synchronizes a primary MongoDB Lead record directly with Zoho CRM in the background.
 * Uses a lookup-before-create design, exponential retries, and records final integration state.
 * 
 * @param {string} leadId - MongoDB Lead document ID.
 */
export const syncLeadToZoho = async (leadId) => {
  const lastAttemptAt = new Date();
  let attempts = 0;

  try {
    // 1. Fetch lead from DB
    const lead = await Lead.findById(leadId);
    if (!lead) {
      console.error(`[Zoho CRM Sync] Lead ID ${leadId} not found in database.`);
      return;
    }

    attempts = (lead.crm?.attempts || 0) + 1;

    // Transition state to pending
    await Lead.findByIdAndUpdate(leadId, {
      $set: {
        'crm.status': 'pending',
        'crm.lastAttemptAt': lastAttemptAt,
        'crm.attempts': attempts
      }
    });

    let syncResult;

    if (isMockMode()) {
      // Execute simulated mock environment logic
      syncResult = await retryWithBackoff(() => handleMockFlow(lead), 2, 1000);
    } else {
      // Execute production API logic with OAuth token manager
      syncResult = await retryWithBackoff(async () => {
        try {
          // Check if lead already exists in Zoho CRM
          const existingZohoLeadId = await searchLeadInZoho(lead.email, lead.phone);
          
          if (existingZohoLeadId) {
            console.log(`[Zoho CRM Sync] Existing lead found with Zoho ID: ${existingZohoLeadId}. Updating...`);
            await updateLeadInZoho(existingZohoLeadId, lead);
            return { action: 'updated', zohoLeadId: existingZohoLeadId };
          } else {
            console.log('[Zoho CRM Sync] No existing record found. Creating new Zoho Lead...');
            const newZohoLeadId = await createLeadInZoho(lead);
            return { action: 'synced', zohoLeadId: newZohoLeadId };
          }
        } catch (err) {
          // If error is 401, retry once (getAccessToken will fetch a fresh one)
          if (err.status === 401) {
            console.warn('[Zoho CRM Sync] Retry flow after unauthorized token expiry...');
            const existingZohoLeadId = await searchLeadInZoho(lead.email, lead.phone);
            if (existingZohoLeadId) {
              await updateLeadInZoho(existingZohoLeadId, lead);
              return { action: 'updated', zohoLeadId: existingZohoLeadId };
            } else {
              const newZohoLeadId = await createLeadInZoho(lead);
              return { action: 'synced', zohoLeadId: newZohoLeadId };
            }
          }
          throw err;
        }
      }, 2, 1000);
    }

    // 2. Sync success update
    await Lead.findByIdAndUpdate(leadId, {
      $set: {
        'crm.status': syncResult.action, // 'synced' or 'updated'
        'crm.zohoLeadId': syncResult.zohoLeadId,
        'crm.syncedAt': new Date(),
        'crm.lastError': null,
        'crm.lastAttemptAt': lastAttemptAt,
        'crm.attempts': attempts
      }
    });

    console.log(`[Zoho CRM Sync] Lead ID ${leadId} sync successful: status set to '${syncResult.action}'`);

  } catch (error) {
    console.error(`[Zoho CRM Sync] Failed to synchronize Lead ID ${leadId}:`, error.message);

    // 3. Sync failure update (preserves primary record in MongoDB)
    await Lead.findByIdAndUpdate(leadId, {
      $set: {
        'crm.status': 'failed',
        'crm.lastError': error.message,
        'crm.lastAttemptAt': lastAttemptAt,
        'crm.attempts': attempts
      }
    });
  }
};

/**
 * Parses booking service string to extract service type and package tier.
 */
const parseServiceAndPackage = (serviceStr) => {
  let category = serviceStr || '';
  let packageInterest = 'Not Sure';

  const match = category.match(/^(.*?)\s*\((Standard|Premium|Elite)\)$/i);
  if (match) {
    category = match[1].trim();
    packageInterest = match[2];
  }
  return { category, packageInterest };
};

/**
 * Parses message for WhatsApp location and requirements formatting.
 */
const parseMessageMetadata = (message) => {
  const metadata = {
    location: '',
    requirements: message || ''
  };

  if (message && message.startsWith('WhatsApp Booking')) {
    const lines = message.split('\n');
    for (const line of lines) {
      if (line.startsWith('Location:')) {
        metadata.location = line.replace('Location:', '').trim();
      } else if (line.startsWith('Requirements:')) {
        metadata.requirements = line.replace('Requirements:', '').trim();
      }
    }
  }
  return metadata;
};

/**
 * Maps Booking fields to Zoho Lead layout.
 */
const mapBookingToZohoFields = (booking) => {
  const { firstName, lastName } = parseName(booking.name);
  const { category, packageInterest } = parseServiceAndPackage(booking.service);
  const { location, requirements } = parseMessageMetadata(booking.message);

  const isWhatsApp = booking.message && booking.message.startsWith('WhatsApp Booking');

  return {
    First_Name: firstName,
    Last_Name: lastName,
    Phone: normalizePhone(booking.phone),
    Email: booking.email || '',
    Wedding_Date: booking.date ? booking.date.toISOString().split('T')[0] : '',
    Wedding_Location: location,
    Package_Interest: packageInterest,
    Description: requirements,
    Lead_Source: isWhatsApp ? 'WhatsApp' : 'Website',
    Internal_Lead_Id: booking._id.toString(),
    Lead_Status: booking.status === 'confirmed' ? 'Confirmed' : (booking.status === 'booked' ? 'Booked' : 'New')
  };
};

/**
 * Mock helper to simulate Zoho API behaviors for Booking locally.
 */
const handleMockBookingFlow = async (booking) => {
  const phone = normalizePhone(booking.phone);
  const email = booking.email ? booking.email.toLowerCase().trim() : '';

  console.log(`[Zoho CRM Booking Mock] Simulating sync for Booking ID: ${booking._id} (Name: ${booking.name}, Phone: ${phone}, Status: ${booking.status}, Payment Status: ${booking.payment?.status})`);

  // Simulate 500ms API latency
  await new Promise(resolve => setTimeout(resolve, 500));

  // 1. Simulate Failure Mode
  if (phone === '9999999999' || email === 'fail@test.com') {
    throw new Error('Simulated Zoho CRM API connection breakdown (Internal Server Error 500)');
  }

  // 2. Simulate Retry Mode (Success on second attempt)
  if (phone === '7777777777' || email === 'retry@test.com') {
    if (!global.retryCounts) global.retryCounts = {};
    if (!global.retryCounts[booking._id]) global.retryCounts[booking._id] = 0;

    global.retryCounts[booking._id]++;
    if (global.retryCounts[booking._id] < 2) {
      const err = new Error('Simulated Zoho API Timeout (Transient 504)');
      err.isTransient = true;
      throw err;
    }
    delete global.retryCounts[booking._id];
    console.log('[Zoho CRM Booking Mock] Retry attempt succeeded!');
  }

  // 3. Simulate Duplicate Mode
  if (phone === '8888888888' || email === 'duplicate@test.com') {
    console.log('[Zoho CRM Booking Mock] Duplicate Lead detected. Matching mock zohoLeadId: mock_zoho_lead_dup_555');
    return {
      action: 'updated',
      zohoLeadId: 'mock_zoho_lead_dup_555'
    };
  }

  // 4. Default: New Lead Success
  return {
    action: 'synced',
    zohoLeadId: `mock_zoho_lead_new_${Math.random().toString(36).substr(2, 9)}`
  };
};

/**
 * Creates a Lead record directly in Zoho CRM based on a Booking.
 */
export const createBookingInZoho = async (booking) => {
  const apiBase = process.env.ZOHO_API_BASE_URL || 'https://www.zohoapis.com/crm/v2';
  const accessToken = await getAccessToken();
  const payload = {
    data: [mapBookingToZohoFields(booking)]
  };

  const response = await fetch(`${apiBase}/Leads`, {
    method: 'POST',
    headers: {
      'Authorization': `Zoho-oauthtoken ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (response.status === 401) {
    invalidateAccessToken();
    const err = new Error('Unauthorized');
    err.status = 401;
    throw err;
  }

  if (!response.ok) {
    const errorText = await response.text();
    const err = new Error(`Create failed: ${response.status} ${errorText}`);
    err.status = response.status;
    throw err;
  }

  const result = await response.json();
  if (result.data && result.data[0] && result.data[0].status === 'success') {
    return result.data[0].details.id;
  } else {
    const msg = result.data?.[0]?.message || 'Zoho CRM rejected the booking submission';
    throw new Error(msg);
  }
};

/**
 * Updates a Lead record directly in Zoho CRM based on a Booking.
 */
export const updateBookingInZoho = async (zohoLeadId, booking) => {
  const apiBase = process.env.ZOHO_API_BASE_URL || 'https://www.zohoapis.com/crm/v2';
  const accessToken = await getAccessToken();
  const payload = {
    data: [{
      id: zohoLeadId,
      ...mapBookingToZohoFields(booking)
    }]
  };

  const response = await fetch(`${apiBase}/Leads`, {
    method: 'PUT',
    headers: {
      'Authorization': `Zoho-oauthtoken ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (response.status === 401) {
    invalidateAccessToken();
    const err = new Error('Unauthorized');
    err.status = 401;
    throw err;
  }

  if (!response.ok) {
    const errorText = await response.text();
    const err = new Error(`Update failed: ${response.status} ${errorText}`);
    err.status = response.status;
    throw err;
  }

  const result = await response.json();
  if (result.data && result.data[0] && result.data[0].status === 'success') {
    return result.data[0].details.id;
  } else {
    const msg = result.data?.[0]?.message || 'Zoho CRM rejected the booking update';
    throw new Error(msg);
  }
};

/**
 * Synchronizes a primary MongoDB Booking record directly with Zoho CRM in the background.
 */
export const syncBookingToZoho = async (bookingId) => {
  const lastAttemptAt = new Date();
  let attempts = 0;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      console.error(`[Zoho CRM Sync] Booking ID ${bookingId} not found in database.`);
      return;
    }

    attempts = (booking.crm?.attempts || 0) + 1;

    // Transition state to pending
    await Booking.findByIdAndUpdate(bookingId, {
      $set: {
        'crm.status': 'pending',
        'crm.lastAttemptAt': lastAttemptAt,
        'crm.attempts': attempts
      }
    });

    let syncResult;

    if (isMockMode()) {
      syncResult = await retryWithBackoff(() => handleMockBookingFlow(booking), 2, 1000);
    } else {
      syncResult = await retryWithBackoff(async () => {
        try {
          const existingZohoLeadId = await searchLeadInZoho(booking.email, booking.phone);
          
          if (existingZohoLeadId) {
            console.log(`[Zoho CRM Sync] Existing lead found with Zoho ID: ${existingZohoLeadId} for booking. Updating...`);
            await updateBookingInZoho(existingZohoLeadId, booking);
            return { action: 'updated', zohoLeadId: existingZohoLeadId };
          } else {
            console.log('[Zoho CRM Sync] No existing record found for booking. Creating new Zoho Lead...');
            const newZohoLeadId = await createBookingInZoho(booking);
            return { action: 'synced', zohoLeadId: newZohoLeadId };
          }
        } catch (err) {
          if (err.status === 401) {
            console.warn('[Zoho CRM Sync] Retry flow for booking after unauthorized token expiry...');
            const existingZohoLeadId = await searchLeadInZoho(booking.email, booking.phone);
            if (existingZohoLeadId) {
              await updateBookingInZoho(existingZohoLeadId, booking);
              return { action: 'updated', zohoLeadId: existingZohoLeadId };
            } else {
              const newZohoLeadId = await createBookingInZoho(booking);
              return { action: 'synced', zohoLeadId: newZohoLeadId };
            }
          }
          throw err;
        }
      }, 2, 1000);
    }

    // Update success status
    await Booking.findByIdAndUpdate(bookingId, {
      $set: {
        'crm.status': syncResult.action,
        'crm.zohoLeadId': syncResult.zohoLeadId,
        'crm.syncedAt': new Date(),
        'crm.lastError': null,
        'crm.lastAttemptAt': lastAttemptAt,
        'crm.attempts': attempts
      }
    });

    console.log(`[Zoho CRM Sync] Booking ID ${bookingId} sync successful: status set to '${syncResult.action}'`);

  } catch (error) {
    console.error(`[Zoho CRM Sync] Failed to synchronize Booking ID ${bookingId}:`, error.message);

    await Booking.findByIdAndUpdate(bookingId, {
      $set: {
        'crm.status': 'failed',
        'crm.lastError': error.message,
        'crm.lastAttemptAt': lastAttemptAt,
        'crm.attempts': attempts
      }
    });
  }
};
