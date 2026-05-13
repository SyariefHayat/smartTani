import crypto from 'crypto';
import { env } from '../config/env';

/**
 * Verifies the signature from Midtrans notification
 */
export const verifyMidtransSignature = (data: {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
}) => {
  const { order_id, status_code, gross_amount, signature_key } = data;
  const serverKey = env.MIDTRANS_SERVER_KEY;

  const payload = order_id + status_code + gross_amount + serverKey;
  const hash = crypto.createHash('sha512').update(payload).digest('hex');

  return hash === signature_key;
};
