import { logger } from '../../../../shared/utils/logger';
import nodemailer from 'nodemailer';
import * as Sentry from '@sentry/node';
import { env } from '../config/env';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    if (env.SMTP_HOST) {
      this.transporter = nodemailer.createTransport({
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
      this.transporter = nodemailer.createTransport({
        jsonTransport: true,
      });
    }
  }

  /**
   * Send an email with 3x retry and exponential backoff (1s, 2s, 4s).
   * Does not throw error on final failure to prevent crashing the worker.
   */
  async send(params: { to: string; subject: string; html: string }) {
    const { to, subject, html } = params;
    const maxRetries = 3;
    let delay = 1000; // Start with 1 second

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const info = await this.transporter.sendMail({
          from: env.EMAIL_FROM,
          to,
          subject,
          html,
        });

        logger.info(`📧 Email sent successfully on attempt ${attempt}:`, info.messageId);
        return info;
      } catch (error) {
        logger.error(`❌ Failed to send email (attempt ${attempt}/${maxRetries}):`, error);

        if (attempt < maxRetries) {
          logger.info(`🔄 Retrying in ${delay / 1000}s...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
        } else {
          // Final failure
          logger.error(`🚨 Permanent failure sending email to ${to}. Logging to Sentry.`);
          Sentry.captureException(error, {
            extra: {
              to,
              subject,
              attempt,
            },
          });
        }
      }
    }
  }
}

export default new EmailService();
