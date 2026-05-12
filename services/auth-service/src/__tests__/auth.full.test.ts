import request from 'supertest';
import { app } from '../index';
import prisma from '../lib/prisma';
import RedisClient from '../lib/redis';
import MessageBroker from '../lib/broker';

// Mock MessageBroker to avoid real RabbitMQ connections during tests
jest.mock('../lib/broker');

describe('Auth Service Full Integration', () => {
  const registerData = {
    email: 'integration_full@example.com',
    password: 'password123',
    role: 'petani',
    full_name: 'Integration Full Test',
  };

  const loginData = {
    email: 'integration_full@example.com',
    password: 'password123',
  };

  beforeAll(async () => {
    // Cleanup test database and redis
    await prisma.user.deleteMany();
    await RedisClient.getInstance().flushdb();
    // Connect MessageBroker mock
    (MessageBroker.publish as jest.Mock).mockResolvedValue(undefined);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await RedisClient.getInstance().quit();
  });

  it('should complete full auth flow: register -> verify -> login -> refresh -> logout', async () => {
    // 1. Register
    const regRes = await request(app).post('/auth/register').send(registerData);
    expect(regRes.status).toBe(201);
    expect(regRes.body.success).toBe(true);
    expect(regRes.body.data.email).toBe(registerData.email);
    expect(regRes.body.data.status).toBe('pending_verification');

    // Get token from redis (we can't get it from response as per AC)
    const keys = await RedisClient.getInstance().keys('verify:*');
    const token = keys[0].replace('verify:', '');

    // 2. Verify Email
    const verifyRes = await request(app).post('/auth/verify-email').send({ token });
    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body.data.message).toBe('Email berhasil diverifikasi');

    // 3. Login
    const loginRes = await request(app).post('/auth/login').send(loginData);
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.data).toHaveProperty('accessToken');
    expect(loginRes.body.data).toHaveProperty('refreshToken');
    const refreshToken = loginRes.body.data.refreshToken;

    // 4. Refresh Token
    const refreshRes = await request(app).post('/auth/refresh').send({ refreshToken });
    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body.data).toHaveProperty('accessToken');
    expect(refreshRes.body.data).toHaveProperty('refreshToken');
    const newAccessToken = refreshRes.body.data.accessToken;
    const newRefreshToken = refreshRes.body.data.refreshToken;

    // 5. Logout
    const logoutRes = await request(app)
      .post('/auth/logout')
      .set('Authorization', `Bearer ${newAccessToken}`)
      .send({ refreshToken: newRefreshToken });
    expect(logoutRes.status).toBe(200);
    expect(logoutRes.body.data.message).toBe('Berhasil logout');
  });

  it('should complete profile update and admin verification flow', async () => {
    // 1. Login as Admin
    // (Register admin first)
    const adminData = {
      email: 'admin_full@example.com',
      password: 'password123',
      role: 'admin',
      full_name: 'Admin User',
    };
    await request(app).post('/auth/register').send(adminData);
    const loginRes = await request(app).post('/auth/login').send({
      email: adminData.email,
      password: adminData.password,
    });
    const adminToken = loginRes.body.data.accessToken;

    // 2. Get Me
    const meRes = await request(app).get('/auth/me').set('Authorization', `Bearer ${adminToken}`);
    expect(meRes.status).toBe(200);
    expect(meRes.body.data.email).toBe(adminData.email);

    // 3. Update Profile
    const updateRes = await request(app)
      .patch('/auth/me')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ full_name: 'New Admin Name' });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.full_name).toBe('New Admin Name');

    // 4. List Users
    const usersRes = await request(app)
      .get('/auth/users')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(usersRes.status).toBe(200);
    expect(Array.isArray(usersRes.body.data)).toBe(true);

    // 5. Verify a User (Petani)
    const petaniData = {
      email: 'petani_to_verify@test.com',
      password: 'password123',
      role: 'petani',
      full_name: 'Petani Test',
    };
    const regRes = await request(app).post('/auth/register').send(petaniData);
    const petaniId = regRes.body.data.id;

    const verifyRes = await request(app)
      .patch(`/auth/users/${petaniId}/verify`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body.data.status).toBe('active');
  });

  it('should return 401 for non-existent email login', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'notfound@example.com',
      password: 'password123',
    });
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('AUTH_001');
  });

  it('should return 401 for unauthorized access to protected route', async () => {
    const res = await request(app).get('/auth/me');
    expect(res.status).toBe(401);
  });

  it('should return 403 for RBAC (buyer accessing admin route)', async () => {
    // Register a buyer
    const buyerData = {
      email: 'buyer_test@example.com',
      password: 'password123',
      role: 'buyer',
      full_name: 'Buyer User',
    };
    await request(app).post('/auth/register').send(buyerData);

    // Login as buyer
    const loginRes = await request(app).post('/auth/login').send({
      email: buyerData.email,
      password: buyerData.password,
    });
    const accessToken = loginRes.body.data.accessToken;

    // Access admin route
    const res = await request(app).get('/auth/users').set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('AUTH_011');
  });

  it('should return 429 after 5 failed login attempts', async () => {
    // We hit 5 times with wrong password
    for (let i = 0; i < 5; i++) {
      await request(app).post('/auth/login').send({
        email: 'any@test.com',
        password: 'wrong',
      });
    }
    // 6th attempt should be 429
    const res = await request(app).post('/auth/login').send({
      email: 'any@test.com',
      password: 'wrong',
    });
    expect(res.status).toBe(429);
    expect(res.body.error.code).toBe('AUTH_006');
  });
});
