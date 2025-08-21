const sgMail = require("@sendgrid/mail");

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || "no-reply@indifarm.local";
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || "IndiFarm";

const isEmailConfigured = Boolean(SENDGRID_API_KEY && EMAIL_FROM);

if (isEmailConfigured) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

/**
 * Send a single email
 * @param {string} to
 * @param {string} subject
 * @param {string} html
 */
async function sendEmail(to, subject, html) {
  if (!isEmailConfigured) return;
  const msg = {
    to,
    from: { email: EMAIL_FROM, name: EMAIL_FROM_NAME },
    subject,
    html,
  };
  await sgMail.send(msg);
}

/**
 * Send to many recipients (simple loop to avoid personalization complexity)
 * NOTE: For larger lists, use batch/personalizations or a queue.
 * @param {string[]} recipients
 * @param {string} subject
 * @param {string} html
 */
async function sendBulk(recipients, subject, html) {
  if (!isEmailConfigured || !Array.isArray(recipients) || recipients.length === 0) return;
  // Throttle very lightly to avoid rate limit in free tiers
  for (const to of recipients) {
    try {
      await sendEmail(to, subject, html);
    } catch (err) {
      // Log and continue
      console.error("sendBulk error to", to, err?.message || err);
    }
  }
}

module.exports = { isEmailConfigured, sendEmail, sendBulk };


