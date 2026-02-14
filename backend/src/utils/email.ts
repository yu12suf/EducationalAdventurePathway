import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// ✅ Create transporter with Gmail SMTP (or any provider)
const transporter = nodemailer.createTransport({
  host: process.env['EMAIL_HOST'] as string,
  port: parseInt(process.env['EMAIL_PORT'] as string, 10),
  secure: process.env['EMAIL_SECURE'] === 'true',
  auth: {
    user: process.env['EMAIL_USER'] as string,
    pass: process.env['EMAIL_PASS'] as string,
  },
  tls: {
    rejectUnauthorized: false, // Allow self-signed certs (Gmail)
    servername: process.env['EMAIL_HOST'] as string,
  },
});

// ✅ Verify connection configuration (optional, but helpful)
transporter.verify((error, _success) => {
  if (error) {
    console.error('❌ SMTP connection failed:', error.message);
  } else {
    console.log('✅ SMTP server is ready to send emails');
  }
});

export const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  try {
    await transporter.sendMail({
      from: process.env['EMAIL_FROM'] as string,
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent to ${to}`);
  } catch (error: any) {
    console.error('❌ Email send failed:', error.message);
    throw new Error('Email could not be sent');
  }
};