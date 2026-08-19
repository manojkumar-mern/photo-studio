import Lead from '../../models/Lead.js';

/**
 * Sends a newly created wedding lead payload to n8n Webhook asynchronously.
 * Updates the lead document with delivery outcome.
 *
 * @param {Object} lead - The Mongoose Lead document.
 */
export const sendLeadToN8n = async (lead) => {
  const webhookUrl = process.env.N8N_LEAD_WEBHOOK_URL;
  const webhookSecret = process.env.N8N_WEBHOOK_SECRET;

  if (!webhookUrl) {
    console.warn('[n8n Service] N8N_LEAD_WEBHOOK_URL is not configured. n8n delivery skipped.');
    return { success: false, error: 'Webhook URL not configured' };
  }

  // Increment attempts counter
  const nextAttempts = (lead.n8n?.attempts || 0) + 1;
  const lastAttemptAt = new Date();

  // Prepare payload
  const payload = {
    event: 'wedding_lead.created',
    eventId: lead._id.toString(),
    occurredAt: new Date().toISOString(),
    lead: {
      id: lead._id.toString(),
      name: lead.name,
      phone: lead.phone,
      email: lead.email || '',
      weddingDate: lead.weddingDate.toISOString(),
      weddingLocation: lead.weddingLocation,
      guestCount: lead.guestCount !== undefined ? lead.guestCount : null,
      packageInterest: lead.packageInterest,
      requirements: lead.requirements || '',
      // Attribution
      source: lead.source || '',
      sourceMedium: lead.sourceMedium || '',
      sourceCampaign: lead.sourceCampaign || '',
      sourceContent: lead.sourceContent || '',
      sourceTerm: lead.sourceTerm || ''
    }
  };

  // Setup abort controller for 5s timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (webhookSecret) {
      headers['X-N8N-Webhook-Secret'] = webhookSecret;
    }

    console.log(`[n8n Service] Triggering delivery for Lead ID ${lead._id} to ${webhookUrl}...`);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Webhook responded with status ${response.status} ${response.statusText}`);
    }

    // Success response handling
    await Lead.findByIdAndUpdate(lead._id, {
      $set: {
        'n8n.status': 'sent',
        'n8n.sentAt': new Date(),
        'n8n.lastAttemptAt': lastAttemptAt,
        'n8n.attempts': nextAttempts,
        'n8n.lastError': null
      }
    });

    console.log(`[n8n Service] Lead ID ${lead._id} delivered successfully.`);
    return { success: true };

  } catch (error) {
    clearTimeout(timeoutId);
    const errorMessage = error.name === 'AbortError' ? 'Webhook request timed out (5s)' : error.message;

    console.error(`[n8n Service] Failed to deliver Lead ID ${lead._id}:`, errorMessage);

    // Save failure back to primary MongoDB record
    await Lead.findByIdAndUpdate(lead._id, {
      $set: {
        'n8n.status': 'failed',
        'n8n.lastAttemptAt': lastAttemptAt,
        'n8n.attempts': nextAttempts,
        'n8n.lastError': errorMessage
      }
    });

    return { success: false, error: errorMessage };
  }
};
