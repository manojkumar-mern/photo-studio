import WhatsAppConversation from '../../models/WhatsAppConversation.js';
import Booking from '../../models/Booking.js';
import { sendBookingEmails } from '../../config/emailService.js';
import { syncBookingToZoho } from '../zoho/zoho.service.js';
import * as msgService from './message.service.js';

/**
 * Main conversation entry point.
 * Processes incoming message payload (text or interactive button/list).
 */
export const handleIncomingMessage = async (incomingEvent) => {
  const { from, type, text, buttonPayload, listPayload } = incomingEvent;
  
  if (!from) {
    console.error('[Conversation Service] No sender phone number found in event.');
    return;
  }

  console.log(`[Conversation Service] Processing event from ${from}. Type: ${type}`);

  // 1. Fetch or create persistent conversation state in MongoDB
  let conversation = await WhatsAppConversation.findOne({ phoneNumber: from });

  if (!conversation) {
    conversation = new WhatsAppConversation({ phoneNumber: from });
  }

  // If conversation is human_support, bypass bot automation completely
  if (conversation.status === 'human_support') {
    // If user says "restart" or "bot", reactivate the bot
    const bodyText = (text || '').toLowerCase().trim();
    if (bodyText === 'restart' || bodyText === 'bot' || bodyText === 'activate') {
      conversation.status = 'active';
      conversation.currentStep = 'WELCOME';
      await conversation.save();
      await msgService.sendWelcomeMessage(from);
      return;
    }
    console.log(`[Conversation Service] Chat is in human support mode for ${from}. Automated response bypassed.`);
    return;
  }

  // Update last active timestamp
  conversation.lastMessageAt = new Date();

  // 2. Pre-process globally command cues (e.g. "hi", "hello", "menu", "cancel")
  const rawBody = (text || '').toLowerCase().trim();
  if (rawBody === 'hi' || rawBody === 'hello' || rawBody === 'menu' || rawBody === 'start') {
    conversation.currentStep = 'WELCOME';
    conversation.status = 'active';
    conversation.isEditing = false;
    await conversation.save();
    await msgService.sendWelcomeMessage(from);
    return;
  }

  if (rawBody === 'cancel' || buttonPayload === 'confirm_booking_cancel') {
    // Clear conversation selections and reset to main menu
    conversation.currentStep = 'WELCOME';
    conversation.service = undefined;
    conversation.package = undefined;
    conversation.eventDate = undefined;
    conversation.location = undefined;
    conversation.customerName = undefined;
    conversation.requirements = undefined;
    conversation.status = 'active';
    conversation.isEditing = false;
    await conversation.save();
    await msgService.sendTextMessage(from, 'Booking enquiry cancelled. Resetting to main menu.');
    await msgService.sendWelcomeMessage(from);
    return;
  }

  // 3. Process conversation based on state machine
  try {
    switch (conversation.currentStep) {
      
      case 'WELCOME':
        // User is at welcome screen, expecting button interaction
        if (buttonPayload === 'menu_book_session') {
          conversation.currentStep = 'SERVICE_SELECTION';
          await conversation.save();
          await msgService.sendServiceSelection(from);
        } else if (buttonPayload === 'menu_gallery') {
          await msgService.sendGalleryMessage(from);
        } else if (buttonPayload === 'menu_talk_to_us') {
          conversation.status = 'human_support';
          conversation.currentStep = 'HUMAN_SUPPORT';
          await conversation.save();
          await msgService.sendHumanSupportOption(from);
        } else {
          // Fallback or text instruction
          await msgService.sendWelcomeMessage(from);
        }
        break;

      case 'SERVICE_SELECTION':
        // Expecting list select selection (e.g., service_wedding)
        if (listPayload && listPayload.startsWith('service_')) {
          const serviceKey = listPayload.split('_').slice(1).join('_');
          const serviceNames = {
            wedding: 'Wedding Documentary',
            pre_wedding: 'Pre-Wedding Shoot',
            portrait: 'Fine Art Portraiture',
            event: 'Commercial Event'
          };
          
          conversation.service = serviceNames[serviceKey] || 'Other Studio Shoot';
          
          // Determine next step: if we are in editing mode, jump back to summary
          if (conversation.isEditing) {
            conversation.currentStep = 'CONFIRMATION';
            conversation.isEditing = false;
            await conversation.save();
            await msgService.sendBookingSummary(from, conversation);
          } else {
            conversation.currentStep = 'PACKAGE_SELECTION';
            await conversation.save();
            await msgService.sendPackageSelection(from);
          }
        } else {
          await msgService.sendTextMessage(from, '⚠️ Please select a photography format from the menu list.');
          await msgService.sendServiceSelection(from);
        }
        break;

      case 'PACKAGE_SELECTION':
        // Expecting package select buttons
        if (buttonPayload && buttonPayload.startsWith('package_')) {
          const packageKey = buttonPayload.split('_')[1];
          const packageNames = {
            standard: 'Standard',
            premium: 'Premium',
            elite: 'Elite'
          };

          conversation.package = packageNames[packageKey] || 'Standard';

          if (conversation.isEditing) {
            conversation.currentStep = 'CONFIRMATION';
            conversation.isEditing = false;
            await conversation.save();
            await msgService.sendBookingSummary(from, conversation);
          } else {
            conversation.currentStep = 'DATE';
            await conversation.save();
            await msgService.sendDateQuestion(from);
          }
        } else {
          await msgService.sendTextMessage(from, '⚠️ Please select a package tier option.');
          await msgService.sendPackageSelection(from);
        }
        break;

      case 'DATE':
        // Expecting text date input (YYYY-MM-DD)
        if (text) {
          // Basic date format validation check
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          let parsedDate;
          
          if (dateRegex.test(text.trim())) {
            parsedDate = new Date(text.trim());
          }

          if (parsedDate && !isNaN(parsedDate.getTime())) {
            conversation.eventDate = parsedDate;

            if (conversation.isEditing) {
              conversation.currentStep = 'CONFIRMATION';
              conversation.isEditing = false;
              await conversation.save();
              await msgService.sendBookingSummary(from, conversation);
            } else {
              conversation.currentStep = 'LOCATION';
              await conversation.save();
              await msgService.sendLocationQuestion(from);
            }
          } else {
            await msgService.sendTextMessage(from, '⚠️ Invalid date format. Please send a date using YYYY-MM-DD (e.g. 2026-09-25) or reply "cancel" to reset.');
          }
        } else {
          await msgService.sendDateQuestion(from);
        }
        break;

      case 'LOCATION':
        // Expecting text location input
        if (text && text.trim().length > 1) {
          conversation.location = text.trim();

          if (conversation.isEditing) {
            conversation.currentStep = 'CONFIRMATION';
            conversation.isEditing = false;
            await conversation.save();
            await msgService.sendBookingSummary(from, conversation);
          } else {
            conversation.currentStep = 'NAME';
            await conversation.save();
            await msgService.sendNameQuestion(from);
          }
        } else {
          await msgService.sendTextMessage(from, '⚠️ Please provide a valid location.');
          await msgService.sendLocationQuestion(from);
        }
        break;

      case 'NAME':
        // Expecting text name input
        if (text && text.trim().length > 1) {
          conversation.customerName = text.trim();

          if (conversation.isEditing) {
            conversation.currentStep = 'CONFIRMATION';
            conversation.isEditing = false;
            await conversation.save();
            await msgService.sendBookingSummary(from, conversation);
          } else {
            conversation.currentStep = 'REQUIREMENTS';
            await conversation.save();
            await msgService.sendRequirementsQuestion(from);
          }
        } else {
          await msgService.sendTextMessage(from, '⚠️ Please enter your name.');
          await msgService.sendNameQuestion(from);
        }
        break;

      case 'REQUIREMENTS':
        // Expecting text input or "none"
        if (text) {
          const reqText = text.trim();
          conversation.requirements = reqText.toLowerCase() === 'none' ? 'None' : reqText;
          
          conversation.currentStep = 'CONFIRMATION';
          conversation.isEditing = false;
          await conversation.save();
          await msgService.sendBookingSummary(from, conversation);
        } else {
          await msgService.sendRequirementsQuestion(from);
        }
        break;

      case 'CONFIRMATION':
        // Expecting confirm/change buttons
        if (buttonPayload === 'confirm_booking_yes') {
          // Double confirmation check/idempotency protection
          if (conversation.status === 'completed') {
            await msgService.sendTextMessage(from, 'This booking has already been submitted.');
            return;
          }

          // Mark state as completed immediately to block duplicate button clicks
          conversation.status = 'completed';
          conversation.currentStep = 'COMPLETED';
          conversation.isEditing = false;
          await conversation.save();

          // 1. Create a Booking record in database
          const bookingMessage = `WhatsApp Booking\nLocation: ${conversation.location}\nRequirements: ${conversation.requirements}`;
          const newBooking = new Booking({
            name: conversation.customerName,
            phone: from,
            service: `${conversation.service} (${conversation.package})`,
            date: conversation.eventDate,
            message: bookingMessage
          });

          const savedBooking = await newBooking.save();

          // 2. Trigger direct Zoho CRM synchronization in the background (non-blocking)
          syncBookingToZoho(savedBooking._id).catch((err) => {
            console.error('[Zoho Service] Asynchronous WhatsApp booking Zoho CRM sync failed:', err);
          });

          // 3. Trigger asynchronous Resend email notification
          try {
            await sendBookingEmails(savedBooking);
          } catch (emailErr) {
            console.error('[Conversation Service] Error triggering emails for WhatsApp booking:', emailErr);
          }

          // 4. Send booking confirmation message
          await msgService.sendBookingConfirmation(from);

        } else if (buttonPayload === 'confirm_booking_change') {
          conversation.currentStep = 'CHANGE_DETAILS';
          conversation.isEditing = true; // Turn on editing flag
          await conversation.save();
          await msgService.sendChangeOptions(from);
        } else {
          await msgService.sendBookingSummary(from, conversation);
        }
        break;

      case 'CHANGE_DETAILS':
        // Expecting choice row list selections
        if (listPayload && listPayload.startsWith('change_field_')) {
          const field = listPayload.replace('change_field_', '');
          
          const stepMap = {
            service: 'SERVICE_SELECTION',
            package: 'PACKAGE_SELECTION',
            date: 'DATE',
            location: 'LOCATION',
            name: 'NAME',
            requirements: 'REQUIREMENTS'
          };

          const selectedStep = stepMap[field];
          if (selectedStep) {
            conversation.currentStep = selectedStep;
            await conversation.save();

            // Ask the relevant question again
            if (selectedStep === 'SERVICE_SELECTION') await msgService.sendServiceSelection(from);
            else if (selectedStep === 'PACKAGE_SELECTION') await msgService.sendPackageSelection(from);
            else if (selectedStep === 'DATE') await msgService.sendDateQuestion(from);
            else if (selectedStep === 'LOCATION') await msgService.sendLocationQuestion(from);
            else if (selectedStep === 'NAME') await msgService.sendNameQuestion(from);
            else if (selectedStep === 'REQUIREMENTS') await msgService.sendRequirementsQuestion(from);
          }
        } else {
          await msgService.sendChangeOptions(from);
        }
        break;

      case 'COMPLETED':
        // Booking already completed. Restart if they send anything else.
        conversation.currentStep = 'WELCOME';
        conversation.status = 'active';
        conversation.isEditing = false;
        // Reset inputs
        conversation.service = undefined;
        conversation.package = undefined;
        conversation.eventDate = undefined;
        conversation.location = undefined;
        conversation.customerName = undefined;
        conversation.requirements = undefined;
        await conversation.save();
        await msgService.sendWelcomeMessage(from);
        break;

      default:
        // Fallback state recovery
        conversation.currentStep = 'WELCOME';
        conversation.isEditing = false;
        await conversation.save();
        await msgService.sendWelcomeMessage(from);
        break;
    }
  } catch (error) {
    console.error(`[Conversation Service] Error processing state ${conversation.currentStep}:`, error);
    await msgService.sendTextMessage(from, '⚠️ Sorry, we experienced an issue processing your request. Please try replying "menu" to start over.');
  }
};
