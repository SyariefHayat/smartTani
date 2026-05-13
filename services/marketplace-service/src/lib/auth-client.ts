import axios from 'axios';
import { env } from '../config/env';

export interface IUserBasicInfo {
  id: string;
  full_name: string;
  role: string;
  status: string;
}

export class AuthServiceClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = env.AUTH_SERVICE_URL;
  }

  async getUserInfo(userId: string): Promise<IUserBasicInfo | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/auth/users/${userId}`);
      if (response.data && response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error(
        `❌ Failed to fetch user info for ${userId}:`,
        error instanceof Error ? error.message : error
      );
      return null;
    }
  }
}

export default new AuthServiceClient();
