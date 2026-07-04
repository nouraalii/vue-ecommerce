const fs = require('fs');
const path = require('path');

let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch (err) {
  // nodemailer not installed
}

exports.sendEmail = async ({ to, subject, html }) => {
  console.log('\n' + '='.repeat(60));
  console.log(`[EMAIL SIMULATION]`);
  console.log(`To:      ${to}`);
  console.log(`Subject: ${subject}`);
  console.log('-'.repeat(60));
  // Clean HTML from tags for console view
  const textMsg = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  console.log(`Body (Plain): ${textMsg}`);
  console.log('='.repeat(60) + '\n');

  // Save email to simulated file for high-fidelity viewing
  try {
    const logDir = path.join(__dirname, '../../logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    const logPath = path.join(logDir, 'simulated_emails.html');
    const timeStamp = new Date().toLocaleString();
    const emailEntry = `
<div style="border: 2px solid #4f46e5; border-radius: 16px; padding: 24px; margin-bottom: 24px; font-family: system-ui, sans-serif; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
  <div style="background-color: #4f46e5; color: white; padding: 12px 24px; border-radius: 12px 12px 0 0; margin: -24px -24px 20px -24px; display: flex; justify-content: space-between;">
    <strong>Simulated Notification</strong>
    <span style="font-size: 0.875rem; opacity: 0.85;">${timeStamp}</span>
  </div>
  <p><strong>To:</strong> <span style="color: #4f46e5;">${to}</span></p>
  <p><strong>Subject:</strong> <strong>${subject}</strong></p>
  <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
  <div>${html}</div>
</div>
`;
    fs.appendFileSync(logPath, emailEntry);
  } catch (err) {
    console.error('Failed to log simulated email to file:', err.message);
  }

  // Attempt real nodemailer send if configured
  if (nodemailer && process.env.SMTP_HOST && process.env.SMTP_USER) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.FROM_EMAIL || '"eShop Store" <no-reply@eshop.com>',
        to,
        subject,
        html,
      });
      console.log(`[EMAIL SUCCESS] Real email sent to ${to}`);
    } catch (err) {
      console.warn(`[EMAIL WARNING] Could not send real email via SMTP: ${err.message}`);
    }
  }
};
