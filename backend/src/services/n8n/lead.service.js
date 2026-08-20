import { sendAutomationEvent } from './automation.service.js';

/**
 * Sends a newly created wedding lead payload to n8n Webhook asynchronously.
 * Delegates to the generic automation service.
 *
 * @param {Object} lead - The Mongoose Lead document.
 */
export const sendLeadToN8n = async (lead) => {
  return sendAutomationEvent('lead.created', lead);
};
