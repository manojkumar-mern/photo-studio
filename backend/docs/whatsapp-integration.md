# WhatsApp Booking Automation Integration Guide

This guide details the integration details, environment setup, and verification guidelines for the WhatsApp Booking Automation system implemented in Phase 1.

---

## 1. Overview of Phase 1 Architecture

We have established a robust, persistent state-machine based WhatsApp booking assistant integrated directly into the Express backend.

```
WhatsApp Event (User Message)
        │
        ▼
POST /api/whatsapp/webhook (Fast Acknowledge HTTP 200)
        │
        ▼ (Async processing in background)
conversation.service.js (State Machine) ◄───► Mongoose: WhatsAppConversation (MongoDB)
        │
        ├──► Forms Booking: Mongoose: Booking (MongoDB)
        └──► Outgoing Meta Call: message.service.js
```

---

## 2. Environment Variables Configuration

Tomorrow, configure the following variables in your `.env` (local) and Render Dashboard (production):

| Variable Name | Description | Example / Target Value |
| :--- | :--- | :--- |
| `WHATSAPP_ACCESS_TOKEN` | Meta Graph System User Access Token | `EAAG...` |
| `WHATSAPP_PHONE_NUMBER_ID` | Phone ID linked to WhatsApp Business | `382749210982` |
| `WHATSAPP_BUSINESS_ACCOUNT_ID` | Meta Business account ID | `12984729104` |
| `WHATSAPP_VERIFY_TOKEN` | Arbitrary secure string for webhook validation | `my_secure_token_123` |
| `WHATSAPP_API_VERSION` | Currently supported Meta Graph API version | `v20.0` |

---

## 3. Webhook Endpoints

### Verification (GET)
* **URL:** `https://your-domain.com/api/whatsapp/webhook`
* **Purpose:** Handles the subscription confirmation handshake from Meta.
* **Logic:** Matches request's `hub.verify_token` against our environment's `WHATSAPP_VERIFY_TOKEN` and returns the `hub.challenge` plain string upon success.

### Event Processing (POST)
* **URL:** `https://your-domain.com/api/whatsapp/webhook`
* **Purpose:** Processes incoming user events (texts, interactive button clicks, list rows selections). Acknowledges Meta immediately with `200 OK` (within 3 seconds) to prevent webhook timeouts.

---

## 4. Conversation States

The chatbot guides the customer through a step-by-step state machine:

1. `WELCOME`: Interactive buttons presenting options (Book Session, Gallery, Talk to Us).
2. `SERVICE_SELECTION`: Interactive list options for photo categories (Wedding, Portrait, etc.).
3. `PACKAGE_SELECTION`: Interactive reply buttons to select standard, premium, or elite tiers.
4. `DATE`: Expects a text input representing the preferred event date (validated for format `YYYY-MM-DD`).
5. `LOCATION`: Expects text location.
6. `NAME`: Expects client's full contact name.
7. `REQUIREMENTS`: Gathers visual concepts or notes (user replies with requirements or "none").
8. `CONFIRMATION`: Generates a custom booking summary showing selections and options to **Confirm Booking**, **Change Details**, or **Cancel**.
9. `CHANGE_DETAILS`: Interactive list allowing the user to select any field to edit. After the change, they are jumped back to `CONFIRMATION` instead of starting over.
10. `COMPLETED`: Save record in MongoDB `Booking` collection, sends confirmation template, triggers Resend email workflow.
11. `HUMAN_SUPPORT`: Bot automation is paused for this customer, allowing admin manual response. Users can reply `restart` to re-trigger the bot.

---

## 5. Mock Sandbox Testing (Local Validation)

Since Meta credentials are not available for this phase, you can test the conversation state machine locally.

### Start the Backend
```bash
npm run dev
```

### Simulated Webhook Payload Tests (curl)

#### 1. Simulate Welcome (Send "Hi")
```bash
curl -X POST http://localhost:5000/api/whatsapp/mock-webhook \
  -H "Content-Type: application/json" \
  -d '{"from": "1234567890", "type": "text", "text": "Hi"}'
```

#### 2. Select "Book a Session" Button Select
```bash
curl -X POST http://localhost:5000/api/whatsapp/mock-webhook \
  -H "Content-Type: application/json" \
  -d '{"from": "1234567890", "type": "interactive", "buttonPayload": "menu_book_session"}'
```

#### 3. Select "Wedding Documentary" List Select
```bash
curl -X POST http://localhost:5000/api/whatsapp/mock-webhook \
  -H "Content-Type: application/json" \
  -d '{"from": "1234567890", "type": "interactive", "listPayload": "service_wedding"}'
```

#### 4. Select "Premium" Package Tier Button
```bash
curl -X POST http://localhost:5000/api/whatsapp/mock-webhook \
  -H "Content-Type: application/json" \
  -d '{"from": "1234567890", "type": "interactive", "buttonPayload": "package_premium"}'
```

#### 5. Provide Date ("2026-10-15")
```bash
curl -X POST http://localhost:5000/api/whatsapp/mock-webhook \
  -H "Content-Type: application/json" \
  -d '{"from": "1234567890", "type": "text", "text": "2026-10-15"}'
```

#### 6. Provide Venue Location
```bash
curl -X POST http://localhost:5000/api/whatsapp/mock-webhook \
  -H "Content-Type: application/json" \
  -d '{"from": "1234567890", "type": "text", "text": "Heritage Hall, Bangalore"}'
```

#### 7. Provide Name
```bash
curl -X POST http://localhost:5000/api/whatsapp/mock-webhook \
  -H "Content-Type: application/json" \
  -d '{"from": "1234567890", "type": "text", "text": "John Doe"}'
```

#### 8. Provide Requirements (or "none")
```bash
curl -X POST http://localhost:5000/api/whatsapp/mock-webhook \
  -H "Content-Type: application/json" \
  -d '{"from": "1234567890", "type": "text", "text": "Candid cinematic highlight film focus"}'
```

#### 9. Confirm Booking
```bash
curl -X POST http://localhost:5000/api/whatsapp/mock-webhook \
  -H "Content-Type: application/json" \
  -d '{"from": "1234567890", "type": "interactive", "buttonPayload": "confirm_booking_yes"}'
```

*Note: After step 9, check the `Booking` collection in MongoDB. You will see a newly created booking record matching the inputs.*

---

## 6. Security Considerations
- The mock webhook endpoint `/mock-webhook` strictly throws `403 Forbidden` if `NODE_ENV` is set to `production`.
- Sensitive tokens and phone identifiers are kept out of frontend bundles and static asset trees.
- Raw database error stack traces and internal secrets are suppressed from user-facing error response payloads.
