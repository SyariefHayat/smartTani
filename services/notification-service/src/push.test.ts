const mockSend = jest.fn();

jest.mock('firebase-admin', () => ({
  messaging: () => ({
    send: mockSend,
  }),
  credential: {
    cert: jest.fn(),
  },
  initializeApp: jest.fn(),
  apps: [],
}));

jest.mock('./lib/redis');
jest.mock('@sentry/node');

// Mock env
jest.mock('./config/env', () => ({
  env: {
    NODE_ENV: 'test',
    PORT: 3006,
    DATABASE_URL: 'postgresql://localhost:5432/test',
    REDIS_URL: 'redis://localhost:6379',
    SMTP_HOST: 'smtp.mailtrap.io',
    SMTP_PORT: 2525,
    SMTP_USER: 'user',
    SMTP_PASS: 'pass',
    EMAIL_FROM: 'noreply@smarttani.com',
    FIREBASE_PROJECT_ID: 'test-project',
    FIREBASE_PRIVATE_KEY: 'test-key',
    FIREBASE_CLIENT_EMAIL: 'test@example.com',
    RABBITMQ_URL: 'amqp://localhost',
  },
}));

import pushService from './services/push.service';
import RedisClient from './lib/redis';
import * as Sentry from '@sentry/node';

describe('Push Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send push notification successfully on first attempt', async () => {
    (RedisClient.get as jest.Mock).mockResolvedValue('fake-token');
    mockSend.mockResolvedValue('message-id-123');

    const result = await pushService.sendToUser({
      userId: 'user-1',
      title: 'Hello',
      body: 'World',
    });

    expect(result).toBe('message-id-123');
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it('should retry 3 times and succeed on the 3rd attempt', async () => {
    (RedisClient.get as jest.Mock).mockResolvedValue('fake-token');
    mockSend
      .mockRejectedValueOnce(new Error('FCM Timeout'))
      .mockRejectedValueOnce(new Error('FCM Timeout'))
      .mockResolvedValueOnce('success-id');

    jest.spyOn(global, 'setTimeout').mockImplementation((fn: any) => {
      fn();
      return {} as any;
    });

    const result = await pushService.sendToUser({
      userId: 'user-1',
      title: 'Retry Test',
      body: 'Body',
    });

    expect(result).toBe('success-id');
    expect(mockSend).toHaveBeenCalledTimes(3);
  });

  it('should remove invalid token from Redis and not retry', async () => {
    (RedisClient.get as jest.Mock).mockResolvedValue('invalid-token');
    const fcmError: any = new Error('Invalid token');
    fcmError.code = 'messaging/registration-token-not-registered';
    mockSend.mockRejectedValue(fcmError);

    await pushService.sendToUser({
      userId: 'user-invalid',
      title: 'Invalid Token',
      body: 'Body',
    });

    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(RedisClient.del).toHaveBeenCalledWith('user:fcm_token:user-invalid');
  });

  it('should log to Sentry after 3 persistent failures', async () => {
    (RedisClient.get as jest.Mock).mockResolvedValue('fake-token');
    mockSend.mockRejectedValue(new Error('Persistent FCM Error'));

    jest.spyOn(global, 'setTimeout').mockImplementation((fn: any) => {
      fn();
      return {} as any;
    });

    await pushService.sendToUser({
      userId: 'user-1',
      title: 'Fail Test',
      body: 'Body',
    });

    expect(mockSend).toHaveBeenCalledTimes(3);
    expect(Sentry.captureException).toHaveBeenCalled();
  });

  it('should skip if no token found in Redis', async () => {
    (RedisClient.get as jest.Mock).mockResolvedValue(null);

    await pushService.sendToUser({
      userId: 'user-no-token',
      title: 'No Token',
      body: 'Body',
    });

    expect(mockSend).not.toHaveBeenCalled();
  });
});
