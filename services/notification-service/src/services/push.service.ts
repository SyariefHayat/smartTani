import { logger } from '../../../../shared/utils/logger';
import admin from 'firebase-admin';
import * as Sentry from '@sentry/node';
import RedisClient from '../lib/redis';

class PushService {
  /**
   * Send a push notification to a specific user.
   * Fetches token from Redis.
   */
  async sendToUser(params: { userId: string; title: string; body: string; data?: Record<string, string> }) {
    const { userId, title, body, data } = params;

    // 1. Fetch token from Redis
    const token = await RedisClient.get<string>(`user:fcm_token:${userId}`);

    if (!token) {
      logger.warn(`⚠️ No FCM token found for user ${userId}. Skipping push notification.`);
      return;
    }

    return this.sendToToken({ token, title, body, data, userId });
  }

  /**
   * Send a push notification to a specific FCM token.
   * Includes 3x retry and backoff.
   */
  async sendToToken(params: { token: string; title: string; body: string; data?: Record<string, string>; userId?: string }) {
    const { token, title, body, data, userId } = params;
    const maxRetries = 3;
    let delay = 1000;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await admin.messaging().send({
          token,
          notification: {
            title,
            body,
          },
          data,
        });

        logger.info(`📱 Push notification sent successfully on attempt ${attempt}:`, response);
        return response;
      } catch (error: any) {
        logger.error(`❌ Failed to send push notification (attempt ${attempt}/${maxRetries}):`, error);

        // Handle specific FCM errors
        if (error.code === 'messaging/registration-token-not-registered' || error.code === 'messaging/invalid-registration-token') {
          logger.warn(`🚨 Invalid FCM token detected for user ${userId || 'unknown'}. Removing from cache.`);
          if (userId) {
            await RedisClient.del(`user:fcm_token:${userId}`);
          }
          return; // Don't retry for invalid tokens
        }

        if (attempt < maxRetries) {
          logger.info(`🔄 Retrying push in ${delay / 1000}s...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2;
        } else {
          logger.error(`🚨 Permanent failure sending push to ${userId || 'unknown'}. Logging to Sentry.`);
          Sentry.captureException(error, {
            extra: { userId, title, attempt },
          });
        }
      }
    }
  }
}

export default new PushService();
