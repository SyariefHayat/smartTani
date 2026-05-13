import midtransClient from 'midtrans-client';
import { env } from '../config/env';

class MidtransManager {
  private static snapInstance: unknown;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static getSnap(): any {
    if (!this.snapInstance) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.snapInstance = new (midtransClient as any).Snap({
        isProduction: env.MIDTRANS_IS_PRODUCTION,
        serverKey: env.MIDTRANS_SERVER_KEY,
        clientKey: env.MIDTRANS_CLIENT_KEY,
      });
    }
    return this.snapInstance;
  }
}

export default MidtransManager;
