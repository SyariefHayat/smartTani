import { logger } from '../../../../shared/utils/logger';
import nodemailer from 'nodemailer';
import { env } from '../config/env';

let transporter: nodemailer.Transporter;

if (env.SMTP_HOST) {
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
} else {
  // Mock or default transporter for development if no SMTP config
  transporter = nodemailer.createTransport({
    jsonTransport: true,
  });
}

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    logger.info('📧 Email sent:', info.messageId);
    return info;
  } catch (error) {
    logger.error('❌ Failed to send email:', error);
    throw error;
  }
};

export default transporter;
