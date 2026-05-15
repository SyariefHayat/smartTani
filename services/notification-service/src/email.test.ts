import emailService from './services/email.service';
import nodemailer from 'nodemailer';
import * as Sentry from '@sentry/node';

jest.mock('nodemailer');
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

describe('Email Service', () => {
  let mockSendMail: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSendMail = jest.fn();
    
    // Inject the mock transporter into the singleton instance
    (emailService as any).transporter = {
      sendMail: mockSendMail,
    };
  });

  it('should send email successfully on first attempt', async () => {
    mockSendMail.mockResolvedValue({ messageId: '123' });

    const result = await emailService.send({
      to: 'test@example.com',
      subject: 'Test',
      html: '<p>Hello</p>',
    });

    expect(result.messageId).toBe('123');
    expect(mockSendMail).toHaveBeenCalledTimes(1);
  });

  it('should retry 3 times and succeed on the 3rd attempt', async () => {
    mockSendMail
      .mockRejectedValueOnce(new Error('SMTP Error'))
      .mockRejectedValueOnce(new Error('SMTP Error'))
      .mockResolvedValueOnce({ messageId: 'success' });

    // Use a small delay for tests
    jest.spyOn(global, 'setTimeout').mockImplementation((fn: any) => {
      fn();
      return {} as any;
    });

    const result = await emailService.send({
      to: 'test@example.com',
      subject: 'Test Retry',
      html: '<p>Hello</p>',
    });

    expect(result.messageId).toBe('success');
    expect(mockSendMail).toHaveBeenCalledTimes(3);
  });

  it('should log to Sentry after 3 failed attempts and not throw', async () => {
    mockSendMail.mockRejectedValue(new Error('Persistent Error'));

    // Mock setTimeout to speed up test
    jest.spyOn(global, 'setTimeout').mockImplementation((fn: any) => {
      fn();
      return {} as any;
    });

    const result = await emailService.send({
      to: 'fail@example.com',
      subject: 'Persistent Failure',
      html: '<p>Hello</p>',
    });

    expect(result).toBeUndefined();
    expect(mockSendMail).toHaveBeenCalledTimes(3);
    expect(Sentry.captureException).toHaveBeenCalled();
  });
});
