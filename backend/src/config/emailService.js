import { Resend } from 'resend';

// Helper to format date
const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  try {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  } catch {
    return dateStr;
  }
};

export const sendBookingEmails = async (booking) => {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!apiKey || apiKey === 're_123456789') {
    console.warn('[Email Service] Resend API Key is not configured. Skipping email delivery.');
    return;
  }

  const resend = new Resend(apiKey);
  const formattedDate = formatDate(booking.date);

  // ─── CUSTOMER CONFIRMATION EMAIL ───────────────────────────────────────────
  const customerHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0C0C0D; color: #F4F1EA; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background-color: #161618; border: 1px solid rgba(244, 241, 234, 0.1); border-radius: 8px; overflow: hidden; margin-top: 40px; margin-bottom: 40px; }
          .header { padding: 40px 30px; text-align: center; border-bottom: 1px solid rgba(244, 241, 234, 0.1); }
          .logo-text { font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: #C5A880; font-weight: 300; display: block; margin-bottom: 8px; }
          .title { font-family: Georgia, serif; font-size: 26px; color: #F4F1EA; font-weight: 300; margin: 0; }
          .content { padding: 40px 30px; line-height: 1.6; font-size: 14px; color: #8E8E93; }
          .highlight { color: #F4F1EA; }
          .details-box { background-color: #0C0C0D; border: 1px solid rgba(244, 241, 234, 0.05); border-radius: 6px; padding: 24px; margin: 30px 0; }
          .footer { background-color: #0C0C0D; padding: 24px 30px; text-align: center; border-top: 1px solid rgba(244, 241, 234, 0.05); font-size: 11px; color: #8E8E93; }
          .disclaimer { font-size: 11px; line-height: 1.5; color: #8E8E93; font-style: italic; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="logo-text">Pixelbees Photography</span>
            <h1 class="title">Booking Enquiry Received</h1>
          </div>
          <div class="content">
            <p>Dear <span class="highlight">${booking.name}</span>,</p>
            <p>Thank you for reaching out to Pixelbees Photography. We have successfully received your creative session booking request.</p>
            
            <div class="details-box">
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid rgba(244, 241, 234, 0.05);">
                  <td style="padding: 10px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #C5A880; font-weight: bold;">Format</td>
                  <td style="padding: 10px 0; color: #F4F1EA; text-align: right;">${booking.service}</td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(244, 241, 234, 0.05);">
                  <td style="padding: 10px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #C5A880; font-weight: bold;">Preferred Date</td>
                  <td style="padding: 10px 0; color: #F4F1EA; text-align: right;">${formattedDate}</td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(244, 241, 234, 0.05);">
                  <td style="padding: 10px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #C5A880; font-weight: bold;">Contact</td>
                  <td style="padding: 10px 0; color: #F4F1EA; text-align: right;">${booking.phone}</td>
                </tr>
                ${booking.message ? `
                <tr>
                  <td colspan="2" style="padding-top: 15px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #C5A880; font-weight: bold; padding-bottom: 5px;">Concept Notes</td>
                </tr>
                <tr>
                  <td colspan="2" style="color: #F4F1EA; font-style: italic; background-color: #0C0C0D; padding: 12px; border-radius: 4px; font-size: 13px; line-height: 1.5;">${booking.message}</td>
                </tr>
                ` : ''}
              </table>
            </div>

            <p class="disclaimer">
              Please note: This email serves as confirmation that we have received your request. A final booking confirmation and schedule details will be sent after we review your visual concept.
            </p>
            <p>Our team will coordinate with you within 24 hours.</p>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} Pixelbees Photography. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `;

  // ─── ADMIN NOTIFICATION EMAIL ─────────────────────────────────────────────
  const adminHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0C0C0D; color: #F4F1EA; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background-color: #161618; border: 1px solid rgba(244, 241, 234, 0.1); border-radius: 8px; overflow: hidden; margin-top: 40px; margin-bottom: 40px; }
          .header { padding: 40px 30px; text-align: center; border-bottom: 1px solid rgba(244, 241, 234, 0.1); }
          .logo-text { font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: #C5A880; font-weight: 300; display: block; margin-bottom: 8px; }
          .title { font-family: Georgia, serif; font-size: 26px; color: #F4F1EA; font-weight: 300; margin: 0; }
          .content { padding: 40px 30px; line-height: 1.6; font-size: 14px; color: #8E8E93; }
          .highlight { color: #F4F1EA; }
          .details-box { background-color: #0C0C0D; border: 1px solid rgba(244, 241, 234, 0.05); border-radius: 6px; padding: 24px; margin: 20px 0; }
          .footer { background-color: #0C0C0D; padding: 20px 30px; text-align: center; border-top: 1px solid rgba(244, 241, 234, 0.05); font-size: 11px; color: #8E8E93; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="logo-text">Pixelbees Admin Console</span>
            <h1 class="title">New Client Enquiry</h1>
          </div>
          <div class="content">
            <p>You have received a new photography booking request. Here are the client submission details:</p>
            
            <div class="details-box">
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid rgba(244, 241, 234, 0.05);">
                  <td style="padding: 10px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #C5A880; font-weight: bold;">Client Name</td>
                  <td style="padding: 10px 0; color: #F4F1EA; text-align: right;">${booking.name}</td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(244, 241, 234, 0.05);">
                  <td style="padding: 10px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #C5A880; font-weight: bold;">Email</td>
                  <td style="padding: 10px 0; color: #F4F1EA; text-align: right;"><a href="mailto:${booking.email}" style="color: #C5A880; text-decoration: none;">${booking.email}</a></td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(244, 241, 234, 0.05);">
                  <td style="padding: 10px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #C5A880; font-weight: bold;">Phone</td>
                  <td style="padding: 10px 0; color: #F4F1EA; text-align: right;"><a href="tel:${booking.phone}" style="color: #C5A880; text-decoration: none;">${booking.phone}</a></td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(244, 241, 234, 0.05);">
                  <td style="padding: 10px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #C5A880; font-weight: bold;">Service Format</td>
                  <td style="padding: 10px 0; color: #F4F1EA; text-align: right;">${booking.service}</td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(244, 241, 234, 0.05);">
                  <td style="padding: 10px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #C5A880; font-weight: bold;">Session Date</td>
                  <td style="padding: 10px 0; color: #F4F1EA; text-align: right;">${formattedDate}</td>
                </tr>
                ${booking.message ? `
                <tr>
                  <td colspan="2" style="padding-top: 15px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #C5A880; font-weight: bold; padding-bottom: 5px;">Concept Notes</td>
                </tr>
                <tr>
                  <td colspan="2" style="color: #F4F1EA; font-style: italic; background-color: #0C0C0D; padding: 12px; border-radius: 4px; font-size: 13px; line-height: 1.5;">${booking.message}</td>
                </tr>
                ` : ''}
              </table>
            </div>
            
            <p>You can review this request in the <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/admin" style="color: #C5A880; text-decoration: underline;">Admin Dashboard</a>.</p>
          </div>
          <div class="footer">
            Pixelbees Photography Console.
          </div>
        </div>
      </body>
    </html>
  `;

  // Perform independent email deliveries
  // 1. Send to Customer (if email is provided)
  if (booking.email) {
    try {
      const isProd = process.env.NODE_ENV === 'production';
      const recipientEmail = (!isProd && process.env.RESEND_TEST_RECIPIENT) || booking.email;
      if (!isProd && process.env.RESEND_TEST_RECIPIENT) {
        console.log(`[Email Service] Sandbox Mode: Redirecting customer confirmation email from ${booking.email} to verified recipient: ${recipientEmail}`);
      } else {
        console.log(`[Email Service] Attempting to send customer confirmation email to: ${booking.email} from: ${fromEmail}`);
      }
      const res = await resend.emails.send({
        from: fromEmail,
        to: recipientEmail,
        subject: 'Booking Request Received - Pixelbees Photography',
        html: customerHtml,
      });
      
      if (res.error) {
        console.error(`[Email Service] Resend API returned error for customer confirmation:`, res.error);
      } else {
        console.log(`[Email Service] Confirmation sent to customer successfully. Message ID: ${res.data?.id}`);
      }
    } catch (error) {
      console.error(`[Email Service] Exception thrown while sending customer email:`, error.message);
    }
  } else {
    console.log('[Email Service] Booking has no email address. Skipping customer confirmation email.');
  }

  // 2. Send to Admin if email is configured
  if (adminEmail) {
    try {
      console.log(`[Email Service] Attempting to send admin notification email to: ${adminEmail} from: ${fromEmail}`);
      const res = await resend.emails.send({
        from: fromEmail,
        to: adminEmail,
        subject: `New Booking Request: ${booking.name} - ${booking.service}`,
        html: adminHtml,
      });
      
      if (res.error) {
        console.error(`[Email Service] Resend API returned error for admin notification:`, res.error);
      } else {
        console.log(`[Email Service] Notification sent to admin successfully. Message ID: ${res.data?.id}`);
      }
    } catch (error) {
      console.error(`[Email Service] Exception thrown while sending admin email:`, error.message);
    }
  } else {
    console.warn('[Email Service] ADMIN_EMAIL is not configured. Skipping admin notification.');
  }
};

export const sendContactEmail = async (contact) => {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!apiKey || apiKey === 're_123456789') {
    console.warn('[Email Service] Resend API Key is not configured. Skipping email delivery.');
    throw new Error('Resend API key not configured');
  }

  const resend = new Resend(apiKey);
  const dateStr = new Date().toLocaleString('en-US');

  const adminHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0C0C0D; color: #F4F1EA; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background-color: #161618; border: 1px solid rgba(244, 241, 234, 0.1); border-radius: 8px; overflow: hidden; margin-top: 40px; margin-bottom: 40px; }
          .header { padding: 40px 30px; text-align: center; border-bottom: 1px solid rgba(244, 241, 234, 0.1); }
          .logo-text { font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: #C5A880; font-weight: 300; display: block; margin-bottom: 8px; }
          .title { font-family: Georgia, serif; font-size: 26px; color: #F4F1EA; font-weight: 300; margin: 0; }
          .content { padding: 40px 30px; line-height: 1.6; font-size: 14px; color: #8E8E93; }
          .highlight { color: #F4F1EA; }
          .details-box { background-color: #0C0C0D; border: 1px solid rgba(244, 241, 234, 0.05); border-radius: 6px; padding: 24px; margin: 20px 0; }
          .footer { background-color: #0C0C0D; padding: 20px 30px; text-align: center; border-top: 1px solid rgba(244, 241, 234, 0.05); font-size: 11px; color: #8E8E93; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="logo-text">Pixelbees Admin Console</span>
            <h1 class="title">New Contact Enquiry</h1>
          </div>
          <div class="content">
            <p>You have received a new contact form message. Here are the submission details:</p>
            
            <div class="details-box">
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid rgba(244, 241, 234, 0.05);">
                  <td style="padding: 10px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #C5A880; font-weight: bold; width: 35%;">Client Name</td>
                  <td style="padding: 10px 0; color: #F4F1EA; text-align: right;">${contact.name}</td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(244, 241, 234, 0.05);">
                  <td style="padding: 10px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #C5A880; font-weight: bold;">Client Email</td>
                  <td style="padding: 10px 0; color: #F4F1EA; text-align: right;"><a href="mailto:${contact.email}" style="color: #C5A880; text-decoration: none;">${contact.email}</a></td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(244, 241, 234, 0.05);">
                  <td style="padding: 10px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #C5A880; font-weight: bold;">Submission Time</td>
                  <td style="padding: 10px 0; color: #F4F1EA; text-align: right;">${dateStr}</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top: 15px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #C5A880; font-weight: bold; padding-bottom: 5px;">Message</td>
                </tr>
                <tr>
                  <td colspan="2" style="color: #F4F1EA; font-style: italic; background-color: #0C0C0D; padding: 12px; border-radius: 4px; font-size: 13px; line-height: 1.5;">${contact.message}</td>
                </tr>
              </table>
            </div>
          </div>
          <div class="footer">
            Pixelbees Photography Console.
          </div>
        </div>
      </body>
    </html>
  `;

  if (adminEmail) {
    try {
      console.log(`[Email Service] Attempting to send admin contact notification email to: ${adminEmail} from: ${fromEmail}`);
      const res = await resend.emails.send({
        from: fromEmail,
        to: adminEmail,
        replyTo: contact.email,
        subject: `New Contact Enquiry — ${contact.name}`,
        html: adminHtml,
      });

      if (res.error) {
        console.error(`[Email Service] Resend API returned error for admin contact notification:`, res.error);
        throw new Error(res.error.message || 'Resend API returned error');
      } else {
        console.log(`[Email Service] Contact notification sent to admin successfully. Message ID: ${res.data?.id}`);
        return res.data;
      }
    } catch (error) {
      console.error(`[Email Service] Exception thrown while sending admin contact email:`, error.message);
      throw error;
    }
  } else {
    console.warn('[Email Service] ADMIN_EMAIL is not configured. Skipping admin notification.');
    throw new Error('ADMIN_EMAIL is not configured');
  }
};
