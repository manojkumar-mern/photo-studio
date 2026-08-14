import * as convService from '../services/whatsapp/conversation.service.js';

/**
 * GET Verification Endpoint (Meta Webhook Verification)
 */
export const verifyWebhook = (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN;

  if (mode && token) {
    if (mode === 'subscribe' && token === expectedToken) {
      console.log('[WhatsApp Controller] Webhook verification success!');
      return res.status(200).send(challenge);
    } else {
      console.warn('[WhatsApp Controller] Webhook verification failed. Token mismatch.');
      return res.status(403).json({
        status: 'error',
        message: 'Verification token mismatch'
      });
    }
  }

  return res.status(400).json({
    status: 'error',
    message: 'Missing verification query parameters'
  });
};

/**
 * POST Webhook Endpoint (Receives Meta WhatsApp API webhook events)
 */
export const handleWebhook = (req, res) => {
  const { body } = req;

  // Acknowledge Meta immediately to avoid timeouts (Meta requires 200 within 3 seconds)
  res.status(200).send('EVENT_RECEIVED');

  // Perform processing asynchronously in the background
  try {
    if (body.object !== 'whatsapp_business_account') {
      return;
    }

    const entries = body.entry || [];
    for (const entry of entries) {
      const changes = entry.changes || [];
      for (const change of changes) {
        if (change.field !== 'messages') continue;

        const value = change.value || {};
        const messages = value.messages || [];

        for (const message of messages) {
          const from = message.from; // Sender phone number
          const type = message.type;
          
          let text = '';
          let buttonPayload = '';
          let listPayload = '';

          // Parse incoming payload based on message type
          if (type === 'text') {
            text = message.text?.body;
          } else if (type === 'interactive') {
            const interactive = message.interactive || {};
            if (interactive.type === 'button_reply') {
              buttonPayload = interactive.button_reply?.id;
              text = interactive.button_reply?.title;
            } else if (interactive.type === 'list_reply') {
              listPayload = interactive.list_reply?.id;
              text = interactive.list_reply?.title;
            }
          }

          // Pass parsed event data to conversation service
          convService.handleIncomingMessage({
            from,
            type,
            text,
            buttonPayload,
            listPayload
          }).catch(err => {
            console.error(`[WhatsApp Controller] Async processing error for message from ${from}:`, err);
          });
        }
      }
    }
  } catch (error) {
    console.error('[WhatsApp Controller] Exception in webhook parsing:', error);
  }
};

/**
 * POST Mock Webhook Endpoint (For testing/sandbox simulation)
 * Only allowed in development environments (NODE_ENV !== 'production')
 */
export const handleMockWebhook = async (req, res) => {
  // Prevent run on production environment
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      status: 'error',
      message: 'Mock webhook utility is disabled in production environments'
    });
  }

  const { from, type, text, buttonPayload, listPayload } = req.body;

  if (!from) {
    return res.status(400).json({
      status: 'error',
      message: 'Phone number ("from") is a required field for mock events'
    });
  }

  try {
    console.log(`[WhatsApp Controller] Simulating mock incoming event from: ${from}`);
    
    // Execute state machine directly (synchronously for testing responsiveness)
    await convService.handleIncomingMessage({
      from,
      type: type || 'text',
      text,
      buttonPayload,
      listPayload
    });

    return res.status(200).json({
      status: 'success',
      message: 'Mock webhook message processed successfully'
    });
  } catch (error) {
    console.error('[WhatsApp Controller] Mock webhook execution failed:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
