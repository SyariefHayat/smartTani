import { logger } from '../../../../shared/utils/logger';
import admin from 'firebase-admin';
import { env } from '../config/env';

export const initFirebase = () => {
  try {
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: env.FIREBASE_PROJECT_ID,
          clientEmail: env.FIREBASE_CLIENT_EMAIL,
          privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
      logger.info('✅ Firebase Admin SDK initialized');
    }
  } catch (error) {
    logger.error('❌ Failed to initialize Firebase Admin SDK:', error);
  }
};

export default admin;
