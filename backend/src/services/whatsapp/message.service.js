/**
 * Service to interact with Meta WhatsApp Business Cloud API.
 * Handles formatting and sending text, buttons, and list payloads.
 */

// Helper to check if WhatsApp environment is properly configured
const isWhatsAppConfigured = () => {
  return !!(
    process.env.WHATSAPP_ACCESS_TOKEN &&
    process.env.WHATSAPP_PHONE_NUMBER_ID
  );
};

// Central helper to send HTTP request to Meta API
const sendMetaRequest = async (payload) => {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const version = process.env.WHATSAPP_API_VERSION || 'v20.0';

  if (!isWhatsAppConfigured()) {
    const errorMsg = '[WhatsApp Service] Missing Meta credentials in environment variables (WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID).';
    
    // In production, fail strictly
    if (process.env.NODE_ENV === 'production') {
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    // In development/testing, simulate delivery by printing to console
    console.warn(`${errorMsg} Simulating message delivery in development mode.`);
    console.log('📱 [WhatsApp Sandbox Outbound Message]:');
    console.log(JSON.stringify(payload, null, 2));
    return {
      messaging_product: 'whatsapp',
      contacts: [{ input: payload.to, wa_id: payload.to }],
      messages: [{ id: `mock-wamid-${Math.random().toString(36).substr(2, 9)}` }]
    };
  }

  const url = `https://graph.facebook.com/${version}/${phoneId}/messages`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[WhatsApp Service] Meta Cloud API Error Response:', data);
      throw new Error(`Meta Cloud API responded with status ${response.status}: ${JSON.stringify(data.error || data)}`);
    }

    console.log(`[WhatsApp Service] Message successfully queued via Meta. Msg ID: ${data.messages?.[0]?.id}`);
    return data;
  } catch (error) {
    console.error('[WhatsApp Service] Network or API connection exception:', error.message);
    throw error;
  }
};

/**
 * Sends a generic text message to a specific number.
 */
export const sendTextMessage = async (to, text) => {
  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'text',
    text: { body: text }
  };
  return sendMetaRequest(payload);
};

/**
 * Sends the welcome message with main menu interactive reply buttons.
 */
export const sendWelcomeMessage = async (to) => {
  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'text',
        text: 'Pixelbees Photography 📸'
      },
      body: {
        text: 'Welcome to Pixelbees Photography!\nEmotion through Photos. How can we assist you today?'
      },
      footer: {
        text: 'Select an option below'
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'menu_book_session',
              title: 'Book a Session 🗓️'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'menu_gallery',
              title: 'View Gallery 🖼️'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'menu_talk_to_us',
              title: 'Talk to Us 💬'
            }
          }
        ]
      }
    }
  };
  return sendMetaRequest(payload);
};

/**
 * Sends a gallery links message or visual portfolio highlight link.
 */
export const sendGalleryMessage = async (to) => {
  const clientUrl = process.env.CLIENT_URL || 'https://photo-studio-1-7fjw.onrender.com';
  const text = `Explore our stunning photography portfolios online:\n\n🔗 *Full Gallery:* ${clientUrl}/gallery\n🔗 *Services details:* ${clientUrl}/services\n\nTo start a booking, reply "book" or select "Book a Session" from the menu.`;
  return sendTextMessage(to, text);
};

/**
 * Sends the photography service selection list.
 */
export const sendServiceSelection = async (to) => {
  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'interactive',
    interactive: {
      type: 'list',
      header: {
        type: 'text',
        text: 'Format Selection'
      },
      body: {
        text: 'What type of photography format do you need for your session?'
      },
      footer: {
        text: 'Tap to view options'
      },
      action: {
        button: 'Select Service',
        sections: [
          {
            title: 'Photography Formats',
            rows: [
              {
                id: 'service_wedding',
                title: 'Wedding Documentary',
                description: 'Full ceremony & candid storytelling'
              },
              {
                id: 'service_pre_wedding',
                title: 'Pre-Wedding Shoot',
                description: 'Creative couples portraiture outdoor'
              },
              {
                id: 'service_portrait',
                title: 'Fine Art Portraiture',
                description: 'Aesthetic studio or ambient capture'
              },
              {
                id: 'service_event',
                title: 'Commercial Event',
                description: 'Corporate conferences, dance, fashion'
              }
            ]
          }
        ]
      }
    }
  };
  return sendMetaRequest(payload);
};

/**
 * Sends the experience package tier selection buttons.
 */
export const sendPackageSelection = async (to) => {
  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'interactive',
    interactive: {
      type: 'button',
      header: {
        type: 'text',
        text: 'Experience Tier'
      },
      body: {
        text: 'Select your preferred photography package tier:\n\n*Standard:* Essential value, main director\n*Premium:* Highly recommended, dual team\n*Elite:* Production multi-crew, signature setups'
      },
      footer: {
        text: 'Choose package tier'
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'package_standard',
              title: 'Standard'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'package_premium',
              title: 'Premium'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'package_elite',
              title: 'Elite'
            }
          }
        ]
      }
    }
  };
  return sendMetaRequest(payload);
};

/**
 * Asks for event date.
 */
export const sendDateQuestion = async (to) => {
  const text = `📅 *What is your event date?*\n\nPlease reply with the date in YYYY-MM-DD format (e.g. 2026-09-25) or specify your preferred timing.`;
  return sendTextMessage(to, text);
};

/**
 * Asks for event location.
 */
export const sendLocationQuestion = async (to) => {
  const text = `📍 *What is the event location?*\n\nPlease reply with the venue name or city (e.g. Bangalore, Heritage Hall).`;
  return sendTextMessage(to, text);
};

/**
 * Asks for customer's name.
 */
export const sendNameQuestion = async (to) => {
  const text = `👤 *Please enter your full name:*`;
  return sendTextMessage(to, text);
};

/**
 * Asks for additional requirements/concept notes.
 */
export const sendRequirementsQuestion = async (to) => {
  const text = `✨ *Any additional requirements or concept notes?*\n\nTell us about your visual goals, or reply "none" to proceed.`;
  return sendTextMessage(to, text);
};

/**
 * Sends booking summary interactive message.
 */
export const sendBookingSummary = async (to, details) => {
  const text = `📋 *BOOKING SUMMARY*\n\n` +
    `*Name:* ${details.customerName}\n` +
    `*Service:* ${details.service}\n` +
    `*Package:* ${details.package}\n` +
    `*Date:* ${details.eventDate ? new Date(details.eventDate).toDateString() : 'TBD'}\n` +
    `*Location:* ${details.location}\n` +
    `*Requirements:* ${details.requirements || 'None'}\n\n` +
    `Is everything correct?`;

  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'interactive',
    interactive: {
      type: 'button',
      body: {
        text
      },
      footer: {
        text: 'Please confirm'
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'confirm_booking_yes',
              title: 'Confirm Booking ✅'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'confirm_booking_change',
              title: 'Change Details ✏️'
            }
          },
          {
            type: 'reply',
            reply: {
              id: 'confirm_booking_cancel',
              title: 'Cancel Booking ❌'
            }
          }
        ]
      }
    }
  };
  return sendMetaRequest(payload);
};

/**
 * Sends change details selection.
 */
export const sendChangeOptions = async (to) => {
  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'interactive',
    interactive: {
      type: 'list',
      header: {
        type: 'text',
        text: 'Edit Details'
      },
      body: {
        text: 'Which detail would you like to update?'
      },
      footer: {
        text: 'Tap to edit field'
      },
      action: {
        button: 'Choose Field',
        sections: [
          {
            title: 'Editable Fields',
            rows: [
              {
                id: 'change_field_service',
                title: 'Service Format',
                description: 'Change photography type'
              },
              {
                id: 'change_field_package',
                title: 'Package Tier',
                description: 'Change package level'
              },
              {
                id: 'change_field_date',
                title: 'Date Preference',
                description: 'Update the session date'
              },
              {
                id: 'change_field_location',
                title: 'Location',
                description: 'Change the venue detail'
              },
              {
                id: 'change_field_name',
                title: 'Name',
                description: 'Edit your contact name'
              },
              {
                id: 'change_field_requirements',
                title: 'Requirements',
                description: 'Update concept notes'
              }
            ]
          }
        ]
      }
    }
  };
  return sendMetaRequest(payload);
};

/**
 * Sends success booking confirmation.
 */
export const sendBookingConfirmation = async (to) => {
  const text = `🎉 *Your booking enquiry has been received successfully!*\n\nOur team will review your creative specifications and coordinate with you within 24 hours.\n\nThank you for choosing Pixelbees Photography!`;
  return sendTextMessage(to, text);
};

/**
 * Sends message when hand-off to human support is triggered.
 */
export const sendHumanSupportOption = async (to) => {
  const text = `Sure! A member of our team has been notified and will assist you directly shortly. 💬\n\nAutomated messages are now paused for this channel.`;
  return sendTextMessage(to, text);
};
