import Lead from '../../models/Lead.js';
import Booking from '../../models/Booking.js';
import { getPortfolioUrl, getQuotationUrl } from '../../config/resources.config.js';

/**
 * Sends a structured business automation event to n8n Webhook asynchronously.
 * Envelops the payload, manages timeout (5s), and updates the DB entity with the outcome.
 *
 * @param {string} eventType - The classification of event (e.g. 'lead.created', 'booking.completed', 'booking.updated', 'booking.status.updated', 'booking.booked', 'booking.not_booked', 'portfolio.requested', 'quotation.requested', 'followup.requested')
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

  // Determine model type
  const isLead = entity.constructor && entity.constructor.modelName === 'Lead';

  // Extract category and package tier
  let serviceCategory = 'Wedding Documentary'; // default for Leads
  let packageTier = 'Standard';

  let location = '';
  let requirements = entity.requirements || entity.message || '';

  if (isLead) {
    packageTier = entity.packageInterest || 'Standard';
    location = entity.weddingLocation || '';
  } else {
    // It's a Booking
    serviceCategory = entity.service || 'Other Studio Shoot';
    const match = serviceCategory.match(/^(.*?)\s*\((Standard|Premium|Elite)\)$/i);
    if (match) {
      serviceCategory = match[1].trim();
      packageTier = match[2];
    }
    
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
  }

  // Generate logical idempotency key
  let idempotencyKey = '';
  const entityId = entity._id.toString();

  if (eventType === 'lead.created') {
    idempotencyKey = `${entityId}_lead.created`;
  } else if (eventType.startsWith('booking.')) {
    if (['booking.booked', 'booking.not_booked', 'booking.status.updated', 'booking.completed', 'booking.cancelled'].includes(eventType)) {
      idempotencyKey = `${entityId}_${eventType}_${entity.status || 'pending'}`;
    } else {
      const version = entity.updatedAt ? new Date(entity.updatedAt).getTime() : '1';
      idempotencyKey = `${entityId}_${eventType}_${version}`;
    }
  } else if (eventType.startsWith('payment.')) {
    const txnId = entity.payment?.transactionId || 'no-txn';
    const attempts = entity.payment?.attempts || 0;
    const paymentStatus = entity.payment?.status || 'pending';
    idempotencyKey = `${entityId}_${txnId}_${eventType}_${paymentStatus}_${attempts}`;
  } else {
    // Delivery-specific events
    let fieldPrefix = null;
    if (eventType === 'portfolio.requested') fieldPrefix = 'portfolio';
    else if (eventType === 'quotation.requested') fieldPrefix = 'quotation';
    else if (eventType === 'followup.requested') fieldPrefix = 'followup';

    if (fieldPrefix) {
      const attempts = entity[fieldPrefix]?.attempts || 0;
      idempotencyKey = `${entityId}_${eventType}_${attempts}`;
    } else {
      idempotencyKey = `${entityId}_${eventType}`;
    }
  }

  // Structure the consistent event envelope
  const envelope = {
    eventType,
    eventId,
    idempotencyKey,
    timestamp,
    source: isLead ? 'website' : 'whatsapp',
    customer: {
      name: entity.name || '',
      phone: entity.phone || '',
      email: entity.email || ''
    },
    meta: {
      entityId: entity._id.toString(),
      entityType: isLead ? 'Lead' : 'Booking'
    }
  };

  // Populate specific payload details
  if (eventType === 'lead.created') {
    envelope.lead = {
      leadId: entity._id.toString(),
      weddingDate: entity.weddingDate ? entity.weddingDate.toISOString() : '',
      weddingLocation: location,
      guestCount: entity.guestCount !== undefined ? entity.guestCount : null,
      packageInterest: packageTier,
      requirements: requirements
    };
    envelope.crm = {
      provider: entity.crm?.provider || 'zoho',
      recordId: entity.crm?.zohoLeadId || null
    };
  } else if (eventType.startsWith('booking.')) {
    envelope.booking = {
      bookingId: entity._id.toString(),
      status: entity.status || 'pending',
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
  } else if (eventType.startsWith('payment.')) {
    envelope.bookingId = entity._id.toString();
    envelope.payment = {
      amount: entity.payment?.amount || 1000,
      currency: entity.payment?.currency || 'INR',
      status: entity.payment?.status || 'pending',
      provider: entity.payment?.provider || 'mock',
      transactionId: entity.payment?.transactionId || null,
      requestedAt: entity.payment?.requestedAt ? entity.payment.requestedAt.toISOString() : null,
      paidAt: entity.payment?.paidAt ? entity.payment.paidAt.toISOString() : null,
      failedAt: entity.payment?.failedAt ? entity.payment.failedAt.toISOString() : null,
      lastError: entity.payment?.lastError || null,
      attempts: entity.payment?.attempts || 0
    };
    envelope.booking = {
      bookingId: entity._id.toString(),
      status: entity.status || 'pending',
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
  } else if (eventType === 'portfolio.requested') {
    const portfolioUrl = getPortfolioUrl(serviceCategory, packageTier);
    envelope.portfolio = {
      category: serviceCategory,
      package: packageTier,
      resource: portfolioUrl
    };
    if (!isLead) {
      envelope.bookingId = entity._id.toString();
    } else {
      envelope.leadId = entity._id.toString();
    }
    envelope.crm = {
      provider: entity.crm?.provider || 'zoho',
      recordId: entity.crm?.zohoLeadId || null
    };
  } else if (eventType === 'quotation.requested') {
    const quotationUrl = getQuotationUrl(serviceCategory, packageTier);
    envelope.quotation = {
      category: serviceCategory,
      package: packageTier,
      resource: quotationUrl
    };
    if (!isLead) {
      envelope.bookingId = entity._id.toString();
    } else {
      envelope.leadId = entity._id.toString();
    }
    envelope.crm = {
      provider: entity.crm?.provider || 'zoho',
      recordId: entity.crm?.zohoLeadId || null
    };
  } else if (eventType === 'followup.requested') {
    envelope.followup = {
      category: serviceCategory,
      package: packageTier,
      date: isLead ? (entity.weddingDate ? entity.weddingDate.toISOString() : '') : (entity.date ? entity.date.toISOString() : ''),
      location: location,
      requirements: requirements
    };
    if (!isLead) {
      envelope.bookingId = entity._id.toString();
    } else {
      envelope.leadId = entity._id.toString();
    }
    envelope.crm = {
      provider: entity.crm?.provider || 'zoho',
      recordId: entity.crm?.zohoLeadId || null
    };
  }

  // Determine delivery field prefix (n8n vs portfolio vs quotation vs followup)
  let fieldPrefix = 'n8n';
  const isPaymentEvent = eventType.startsWith('payment.');
  if (isPaymentEvent) {
    fieldPrefix = null;
  } else if (eventType === 'portfolio.requested') {
    fieldPrefix = 'portfolio';
  } else if (eventType === 'quotation.requested') {
    fieldPrefix = 'quotation';
  } else if (eventType === 'followup.requested') {
    fieldPrefix = 'followup';
  }

  // Timeout controller (5s)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  const nextAttempts = fieldPrefix ? ((entity[fieldPrefix]?.attempts || 0) + 1) : 0;
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

    if (fieldPrefix) {
      const updatePayload = {
        [`${fieldPrefix}.status`]: 'sent',
        [`${fieldPrefix}.sentAt`]: new Date(),
        [`${fieldPrefix}.lastAttemptAt`]: lastAttemptAt,
        [`${fieldPrefix}.attempts`]: nextAttempts,
        [`${fieldPrefix}.lastError`]: null
      };

      if (isLead) {
        await Lead.findByIdAndUpdate(entity._id, { $set: updatePayload });
      } else {
        await Booking.findByIdAndUpdate(entity._id, { $set: updatePayload });
      }
    }

    console.log(`[n8n Automation] Event ${eventType} delivered successfully.`);
    return { success: true };

  } catch (error) {
    clearTimeout(timeoutId);
    const errorMessage = error.name === 'AbortError' ? 'Webhook request timed out (5s)' : error.message;

    console.error(`[n8n Automation] Failed to deliver event ${eventType}:`, errorMessage);

    if (fieldPrefix) {
      const updatePayload = {
        [`${fieldPrefix}.status`]: 'failed',
        [`${fieldPrefix}.lastAttemptAt`]: lastAttemptAt,
        [`${fieldPrefix}.attempts`]: nextAttempts,
        [`${fieldPrefix}.lastError`]: errorMessage
      };

      if (isLead) {
        await Lead.findByIdAndUpdate(entity._id, { $set: updatePayload });
      } else {
        await Booking.findByIdAndUpdate(entity._id, { $set: updatePayload });
      }
    }

    return { success: false, error: errorMessage };
  }
};
