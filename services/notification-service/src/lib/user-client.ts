import { logger } from '../../../../shared/utils/logger';
import axios from 'axios';
import { env } from '../config/env';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  role: string;
  fcm_token?: string;
}

class UserClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = env.AUTH_SERVICE_URL;
  }

  async getUser(userId: string): Promise<User | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/auth/users/${userId}`);
      if (response.data && response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      logger.error(`❌ Error fetching user ${userId} from auth service:`, error.message);
      return null;
    }
  }
}

export default new UserClient();
