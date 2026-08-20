import Lead from '../../models/Lead.js';
import Booking from '../../models/Booking.js';

/**
 * Sends a structured business automation event to n8n Webhook asynchronously.
 * Envelops the payload, manages timeout (5s), and updates the DB entity with the outcome.
 *
 * @param {string} eventType - The classification of event (e.g. 'lead.created', 'booking.completed')
 * @param {Object} entity - The Mongoose document instance (Lead or Booking)
 * @returns {Promise<Object>} Status object { success: boolean, error?: string }
 */
export const sendAutomationEvent = async (eventType, entity) => {
  const webhookUrl = process.env.N8N_LEAD_WEBHOOK_URL;
  const webhookSecret = process.env.N8N_WEBHOOK_SECRET;

  if (!webhookUrl) {
    console.warn(`[n8n Automation] Webhook URL not configured. Skipped dispatching: ${eventType}`);
    return { success: false, error: 'Webhook URL not configured' };
  }

  // Generate unique eventId based on MongoDB ID and millisecond timestamp
  const eventId = `${entity._id}_${Date.now()}`;
  const timestamp = new Date().toISOString();

  // Structure the consistent event envelope
  const envelope = {
    eventType,
    eventId,
    timestamp,
    source: 'photo-studio'
  };

  if (eventType === 'lead.created') {
    envelope.customer = {
      name: entity.name,
      phone: entity.phone,
      email: entity.email || ''
    };
    envelope.lead = {
      leadId: entity._id.toString(),
      weddingDate: entity.weddingDate ? entity.weddingDate.toISOString() : '',
      weddingLocation: entity.weddingLocation || '',
      guestCount: entity.guestCount !== undefined ? entity.guestCount : null,
      packageInterest: entity.packageInterest || 'Not Sure',
      requirements: entity.requirements || ''
    };
    envelope.crm = {
      provider: entity.crm?.provider || 'zoho',
      recordId: entity.crm?.zohoLeadId || null
    };
  } else if (eventType.startsWith('booking.')) {
    envelope.customer = {
      name: entity.name,
      phone: entity.phone,
      email: entity.email || ''
    };

    let serviceCategory = entity.service || '';
    let packageTier = 'Not Sure';
    const match = serviceCategory.match(/^(.*?)\s*\((Standard|Premium|Elite)\)$/i);
    if (match) {
      serviceCategory = match[1].trim();
      packageTier = match[2];
    }

    let location = '';
    let requirements = entity.message || '';
    if (entity.message && entity.message.startsWith('WhatsApp Booking')) {
      const lines = entity.message.split('\n');
      for (const line of lines) {
        if (line.startsWith('Location:')) {
          location = line.replace('Location:', '').trim();
        } else if (line.startsWith('Requirements:')) {
          requirements = line.replace('Requirements:', '').trim();
        }
      }
    }

    envelope.booking = {
      bookingId: entity._id.toString(),
      service: serviceCategory,
      package: packageTier,
      date: entity.date ? entity.date.toISOString() : '',
      location: location,
      requirements: requirements
    };
    envelope.crm = {
      provider: entity.crm?.provider || 'zoho',
      recordId: entity.crm?.zohoLeadId || null
    };
  }

  // Timeout controller (5s)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  const nextAttempts = (entity.n8n?.attempts || 0) + 1;
  const lastAttemptAt = new Date();

  try {
    const headers = {
      'Content-Type': 'application/json'
    };
    if (webhookSecret) {
      headers['X-N8N-Webhook-Secret'] = webhookSecret;
    }

    console.log(`[n8n Automation] Sending event ${eventType} (ID: ${eventId}) to ${webhookUrl}...`);
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(envelope),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`n8n webhook responded with status ${response.status} ${response.statusText}`);
    }

    const updatePayload = {
      'n8n.status': 'sent',
      'n8n.sentAt': new Date(),
      'n8n.lastAttemptAt': lastAttemptAt,
      'n8n.attempts': nextAttempts,
      'n8n.lastError': null
    };

    if (eventType === 'lead.created') {
      await Lead.findByIdAndUpdate(entity._id, { $set: updatePayload });
    } else {
      await Booking.findByIdAndUpdate(entity._id, { $set: updatePayload });
    }

    console.log(`[n8n Automation] Event ${eventType} delivered successfully.`);
    return { success: true };

  } catch (error) {
    clearTimeout(timeoutId);
    const errorMessage = error.name === 'AbortError' ? 'Webhook request timed out (5s)' : error.message;

    console.error(`[n8n Automation] Failed to deliver event ${eventType}:`, errorMessage);

    const updatePayload = {
      'n8n.status': 'failed',
      'n8n.lastAttemptAt': lastAttemptAt,
      'n8n.attempts': nextAttempts,
      'n8n.lastError': errorMessage
    };

    if (eventType === 'lead.created') {
      await Lead.findByIdAndUpdate(entity._id, { $set: updatePayload });
    } else {
      await Booking.findByIdAndUpdate(entity._id, { $set: updatePayload });
    }

    return { success: false, error: errorMessage };
  }
};
