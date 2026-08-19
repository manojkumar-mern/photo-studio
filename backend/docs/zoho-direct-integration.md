# Zoho CRM Direct Backend Integration Documentation

This document describes the direct server-to-server Zoho CRM synchronization architecture implemented on the Express backend, replacing the legacy n8n synchronization pathway.

---

## 1. Flow Architecture

```mermaid
graph TD;
  User[Website Lead Form] -- Submit Lead --> API[POST /api/leads];
  API -- 1. Validate & Save Primary Record --> DB[(MongoDB Lead Collection)];
  API -- 2. Immediate Success Return --> User;
  API -- 3. Asynchronously Trigger Sync (Background) --> Service[zoho.service.js];
  Service -- 4. Fetch OAuth token --> TokenManager[zohoTokenManager.js];
  Service -- 5. Lookup existing lead by email/phone --> Zoho[Zoho CRM API];
  
  alt Lead Found (Duplicate)
    Service -- 6a. Update Lead (PUT) --> Zoho;
    Service -- 7a. Set status='updated' --> DB;
  else Lead Not Found
    Service -- 6b. Create Lead (POST) --> Zoho;
    Service -- 7b. Set status='synced' --> DB;
  end

  API -- 8. Trigger n8n Notification Flow (Background) --> n8n[n8n Webhook];
```

---

## 2. Environment Variables Configuration

Configure these parameters in your `.env` (local) and deployment settings:

```ini
# Zoho CRM Direct Integration Configuration
ZOHO_CLIENT_ID=your_zoho_client_id_here
ZOHO_CLIENT_SECRET=your_zoho_client_secret_here
ZOHO_REFRESH_TOKEN=your_zoho_refresh_token_here
ZOHO_REDIRECT_URI=http://localhost:5000/api/zoho/callback
ZOHO_ACCOUNTS_URL=https://accounts.zoho.com
ZOHO_API_BASE_URL=https://www.zohoapis.com/crm/v2

# Set to true to run in sandbox simulation mode (no real credentials needed)
ZOHO_MOCK=true
```

---

## 3. Zoho OAuth 2.0 Token Manager (`zohoTokenManager.js`)
* **Caching**: Access tokens are cached in memory alongside an expiration timestamp.
* **Auto-refresh**: When requesting the access token via `getAccessToken()`, if the token is missing or within 5 minutes of expiration, it automatically executes a refresh request to Zoho Accounts using the stored `ZOHO_REFRESH_TOKEN`.
* **Concurrency Lock**: If multiple lead submissions trigger simultaneously, a single shared refresh promise is awaited, preventing redundant token refresh calls.
* **Security**: Client secrets and tokens are kept strictly server-side and never exposed to the client or frontend assets.

---

## 4. Lead Field Mapping Specification

The backend maps Photo Studio Lead objects directly to the Zoho CRM Leads module fields:

| MongoDB Model Field | Zoho CRM API Name | Data Type | Transform / Mapping Rule |
| :--- | :--- | :--- | :--- |
| `_id` | `Internal_Lead_Id` | Text | MongoDB ID converted to String |
| `name` | `First_Name` | Text | First space-delimited word |
| `name` | `Last_Name` | Text | Remaining words (falls back to `.` if single word) |
| `phone` | `Phone` | Phone | Digits and `+` symbols only |
| `email` | `Email` | Email | Client email address |
| `weddingDate` | `Wedding_Date` | Date | ISO date representation (`YYYY-MM-DD`) |
| `weddingLocation`| `Wedding_Location` | Text | Event ceremony location |
| `guestCount` | `Guest_Count` | Number | Integer representation |
| `packageInterest`| `Package_Interest` | Picklist | Maps directly: Standard, Premium, Elite, Not Sure |
| `requirements` | `Description` | Textarea | Wedding concept requirements and notes |
| `source` | `Lead_Source` | Picklist | Referral source |
| `sourceCampaign` | `Ad_Campaign` | Text | UTM Campaign name |
| `sourceMedium` | `Ad_Medium` | Text | UTM Medium |

---

## 5. Duplicate Protection (Lookup-Before-Create)
To guarantee data cleanliness, the synchronization worker executes queries on Zoho CRM before creating records:
1. **Search by Phone**: Queries Zoho CRM using `GET /Leads/search?phone=...`.
2. **Search by Email**: If phone returns no matches and an email is present, queries `GET /Leads/search?email=...`.
3. If an existing record is returned, the backend performs a `PUT /Leads` update using the existing `zohoLeadId` instead of generating a new record.

---

## 6. Sync Lifecycle & MongoDB Status States
The integration tracks sync progression directly on the Lead's `crm` sub-document:
* `pending`: The lead has been saved and is currently undergoing background sync.
* `synced`: Sync completed and created a new Zoho CRM Lead record.
* `updated`: Sync completed and updated an existing Zoho CRM Lead record.
* `failed`: Sync failed after exhausted retries; check `crm.lastError` for troubleshooting.

---

## 7. Retry & Error Recovery Strategy
* **Transient Failures**: Network exceptions or transient Zoho HTTP status codes (e.g. `429`, `500`, `502`, `503`, `504`) are automatically retried up to **3 times** with exponential backoff delays (1s, 2s).
* **Unauthorized Token Expiry**: If Zoho returns a `401 Unauthorized` response (e.g. token expired prematurely), the Token Manager invalidates the cache, requests a fresh token, and retries the API operation immediately.
* **Recoverability**: If synchronization permanently fails, the Lead remains safely persisted in MongoDB with `crm.status = 'failed'` and can be updated/retried at any time without impacting client submissions.

---

## 8. Local Mock Testing Setup (`ZOHO_MOCK=true`)
When Zoho environment variables are set to local placeholders or `ZOHO_MOCK=true` is enabled, the backend runs simulated scenarios to test integration behaviors without needing real credentials:
* **Standard Success Test**: Submitting a normal phone number creates the lead and transitions status to `synced`.
* **Duplicate Lead Test**: Submitting phone `8888888888` matches an existing record and sets status to `updated` with `zohoLeadId = 'mock_zoho_lead_dup_555'`.
* **Permanent Failure Test**: Submitting phone `9999999999` throws an error, leaving the lead in MongoDB with status `failed` and logs the exception message.
* **Transient Retry Test**: Submitting phone `7777777777` simulates a transient error on the first attempt and demonstrates a successful resolution during the second attempt.
