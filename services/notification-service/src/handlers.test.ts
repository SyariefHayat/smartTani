jest.mock('./services/email.service');
jest.mock('./services/push.service');
jest.mock('./lib/user-client');
jest.mock('./lib/template', () => ({
  renderTemplate: jest.fn(() => '<html><body>Template</body></html>'),
}));

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
    AUTH_SERVICE_URL: 'http://auth-service:3001',
    FIREBASE_PROJECT_ID: 'test-project',
    FIREBASE_PRIVATE_KEY: 'test-key',
    FIREBASE_CLIENT_EMAIL: 'test@example.com',
    RABBITMQ_URL: 'amqp://localhost',
  },
}));

import * as handlers from './events/handlers';
import emailService from './services/email.service';
import pushService from './services/push.service';
import userClient from './lib/user-client';

describe('Notification Event Handlers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handleUserRegistered should send welcome email', async () => {
    const payload = {
      id: 'user-1',
      email: 'test@example.com',
      full_name: 'Test User',
      verification_token: 'token-123'
    };

    await handlers.handleUserRegistered(payload);

    expect(emailService.send).toHaveBeenCalledWith(expect.objectContaining({
      to: 'test@example.com',
      subject: expect.stringContaining('Selamat Datang'),
    }));
  });

  it('handleOrderPaid should send email and push to farmer', async () => {
    const payload = {
      order_id: 'order-1',
      total_amount: 500000,
      farmer_id: 'farmer-1'
    };

    (userClient.getUser as jest.Mock).mockResolvedValue({
      id: 'farmer-1',
      email: 'farmer@example.com',
      full_name: 'Farmer Joe'
    });

    await handlers.handleOrderPaid(payload);

    expect(userClient.getUser).toHaveBeenCalledWith('farmer-1');
    expect(emailService.send).toHaveBeenCalledWith(expect.objectContaining({
      to: 'farmer@example.com',
    }));
    expect(pushService.sendToUser).toHaveBeenCalledWith(expect.objectContaining({
      userId: 'farmer-1',
      title: expect.stringContaining('Berhasil'),
    }));
  });
});
