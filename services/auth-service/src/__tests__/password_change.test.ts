import request from 'supertest';
import { app } from '../index';
import prisma from '../lib/prisma';
import RedisClient from '../lib/redis';
import MessageBroker from '../lib/broker';

// Mock MessageBroker to avoid real RabbitMQ connections during tests
jest.mock('../lib/broker');

describe('Auth Service - Password Change', () => {
  const userData = {
    email: 'change_pw@example.com',
    password: 'oldpassword123',
    role: 'buyer',
    full_name: 'Change PW User',
  };

  let accessToken: string;
  let refreshToken: string;

  beforeAll(async () => {
    // Cleanup test database and redis
    await prisma.user.deleteMany();
    await RedisClient.getInstance().flushdb();
    // Connect MessageBroker mock
    (MessageBroker.publish as jest.Mock).mockResolvedValue(undefined);

    // Register and login to get tokens
    await request(app).post('/auth/register').send(userData);
    const loginRes = await request(app).post('/auth/login').send({
      email: userData.email,
      password: userData.password,
    });
    accessToken = loginRes.body.data.accessToken;
    refreshToken = loginRes.body.data.refreshToken;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await RedisClient.getInstance().quit();
  });

  it('should return 422 for short new password', async () => {
    const res = await request(app)
      .post('/auth/change-password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        currentPassword: 'oldpassword123',
        newPassword: 'short',
      });
    expect(res.status).toBe(422);
  });

  it('should return 401 for wrong current password', async () => {
    const res = await request(app)
      .post('/auth/change-password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        currentPassword: 'wrongpassword',
        newPassword: 'newpassword123',
      });
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('AUTH_011');
  });

  it('should change password successfully and invalidate old tokens', async () => {
    // 1. Change password
    const res = await request(app)
      .post('/auth/change-password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        currentPassword: 'oldpassword123',
        newPassword: 'newpassword123',
      });
    expect(res.status).toBe(200);
    expect(res.body.data.message).toBe('Password berhasil diubah');

    // 2. Try to refresh with old refresh token - should fail (401)
    const refreshRes = await request(app).post('/auth/refresh').send({ refreshToken });
    expect(refreshRes.status).toBe(401);

    // 3. Try to login with new password - should succeed
    const loginRes = await request(app).post('/auth/login').send({
      email: userData.email,
      password: 'newpassword123',
    });
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.data).toHaveProperty('accessToken');
  });
});
