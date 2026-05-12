import bcrypt from 'bcrypt';
import crypto from 'crypto';
import {
  RegisterInput,
  VerifyEmailInput,
  LoginInput,
  RefreshTokenInput,
  UpdateProfileInput,
} from '../schemas/auth.schema';
import userRepository from '../repositories/user.repository';
import RedisClient from '../lib/redis';
import MessageBroker from '../lib/broker';
import { BROKER_EXCHANGES, BROKER_ROUTING_KEYS } from '../../../../shared/constants/broker';
import { AppError } from '../../../../shared/types/express';
import { env } from '../config/env';
import { signAccessToken } from '../../../../shared/utils/jwt';

export class AuthService {
  async register(input: RegisterInput) {
    // 1. Cek email sudah terdaftar
    const existingUser = await userRepository.findByEmail(input.email);
    if (existingUser) {
      const error = new Error('Email sudah terdaftar') as AppError;
      error.statusCode = 409;
      error.code = 'AUTH_002';
      throw error;
    }

    // 2. Hash password with bcrypt (cost 12)
    const hashedPassword = await bcrypt.hash(input.password, 12);

    // 3. Insert user ke PostgreSQL
    // status: pending_verification untuk role petani, active untuk lainnya
    const status = input.role === 'petani' ? 'pending_verification' : 'active';

    const user = await userRepository.create({
      email: input.email,
      password: hashedPassword,
      role: input.role,
      full_name: input.full_name,
      status,
    });

    // 4. Generate email verification token (random 32 bytes -> hex)
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // 5. Simpan di Redis dengan TTL 24 jam (86400 detik)
    await RedisClient.setex(`verify:${verificationToken}`, 86400, user.id);

    // 6. Kirim email verifikasi (async, jangan await)
    // Publish ke RabbitMQ
    MessageBroker.publish(BROKER_EXCHANGES.EVENTS, BROKER_ROUTING_KEYS.AUTH_USER_REGISTERED, {
      userId: user.id,
      email: user.email,
      fullName: user.full_name,
      token: verificationToken,
    }).catch((err) => {
      console.error('❌ Failed to publish AUTH_USER_REGISTERED event:', err);
    });

    // 7. Return user data (tanpa password)
    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async verifyEmail(input: VerifyEmailInput) {
    // 1. Lookup token di Redis
    const userId = await RedisClient.get<string>(`verify:${input.token}`);

    // 2. 400 jika tidak ditemukan atau expired
    if (!userId) {
      const error = new Error('Token verifikasi tidak valid atau sudah kadaluarsa') as AppError;
      error.statusCode = 400;
      error.code = 'AUTH_003';
      throw error;
    }

    // 3. Update user status ke active
    await userRepository.updateStatus(userId, 'active');

    // 4. Hapus token dari Redis
    await RedisClient.del(`verify:${input.token}`);

    return { message: 'Email berhasil diverifikasi' };
  }

  async login(input: LoginInput) {
    // 1. Cari user by email
    const user = await userRepository.findByEmail(input.email);

    // 2. 401 jika tidak ada (pesan generic untuk keamanan)
    if (!user) {
      const error = new Error('Email atau password salah') as AppError;
      error.statusCode = 401;
      error.code = 'AUTH_001';
      throw error;
    }

    // 3. Compare password
    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) {
      const error = new Error('Email atau password salah') as AppError;
      error.statusCode = 401;
      error.code = 'AUTH_001';
      throw error;
    }

    // 4. Cek status user
    if (user.status === 'pending_verification') {
      const error = new Error('Email belum diverifikasi') as AppError;
      error.statusCode = 403;
      error.code = 'AUTH_004';
      throw error;
    }

    if (user.status === 'suspended') {
      const error = new Error('Akun ditangguhkan') as AppError;
      error.statusCode = 403;
      error.code = 'AUTH_005';
      throw error;
    }

    // 5. Generate access token (JWT, 1 jam)
    const accessToken = signAccessToken(
      { userId: user.id, role: user.role, email: user.email },
      env.JWT_SECRET,
      env.JWT_EXPIRES_IN
    );

    // 6. Generate refresh token (random 32 bytes)
    const refreshToken = crypto.randomBytes(32).toString('hex');

    // Simpan di Redis: key refresh:{token} -> userId, TTL 7 hari (604800 detik)
    await RedisClient.setex(`refresh:${refreshToken}`, 604800, user.id);

    // 7. Return tokens and user
    const { password: _password, ...userWithoutPassword } = user;

    return {
      accessToken,
      refreshToken,
      user: userWithoutPassword,
    };
  }

  async refresh(input: RefreshTokenInput) {
    // 1. Lookup di Redis
    const userId = await RedisClient.get<string>(`refresh:${input.refreshToken}`);

    // 2. 401 jika tidak ada
    if (!userId) {
      const error = new Error('Refresh token tidak valid atau sudah kadaluarsa') as AppError;
      error.statusCode = 401;
      error.code = 'AUTH_007';
      throw error;
    }

    // 3. Fetch user dari DB
    const user = await userRepository.findById(userId);
    if (!user || user.status !== 'active') {
      const error = new Error('User tidak aktif atau tidak ditemukan') as AppError;
      error.statusCode = 401;
      error.code = 'AUTH_008';
      throw error;
    }

    // 4. Generate access token baru
    const accessToken = signAccessToken(
      { userId: user.id, role: user.role, email: user.email },
      env.JWT_SECRET,
      env.JWT_EXPIRES_IN
    );

    // 5. Rotate refresh token (hapus lama, buat baru)
    await RedisClient.del(`refresh:${input.refreshToken}`);
    const newRefreshToken = crypto.randomBytes(32).toString('hex');
    await RedisClient.setex(`refresh:${newRefreshToken}`, 604800, user.id);

    // 6. Return new tokens
    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(refreshToken: string) {
    // 1. Hapus refresh token dari Redis
    await RedisClient.del(`refresh:${refreshToken}`);
    return { message: 'Berhasil logout' };
  }

  async getMe(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      const error = new Error('User tidak ditemukan') as AppError;
      error.statusCode = 404;
      error.code = 'AUTH_010';
      throw error;
    }

    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateProfile(userId: string, input: UpdateProfileInput) {
    // Ensure user exists
    const existingUser = await userRepository.findById(userId);
    if (!existingUser) {
      const error = new Error('User tidak ditemukan') as AppError;
      error.statusCode = 404;
      error.code = 'AUTH_010';
      throw error;
    }

    const updatedUser = await userRepository.update(userId, input);

    const { password: _password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async getAllUsers(params: { role?: string; status?: string; page?: number; limit?: number }) {
    const page = params.page || 1;
    const limit = params.limit || 20;

    const { users, total } = await userRepository.findAll({
      role: params.role,
      status: params.status,
      page,
      limit,
    });

    const usersWithoutPassword = users.map((user) => {
      const { password: _password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return {
      users: usersWithoutPassword,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async verifyUser(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      const error = new Error('User tidak ditemukan') as AppError;
      error.statusCode = 404;
      error.code = 'AUTH_010';
      throw error;
    }

    if (user.status === 'active') {
      return { message: 'User sudah aktif' };
    }

    const updatedUser = await userRepository.updateStatus(userId, 'active');

    // Kirim notifikasi email (async)
    MessageBroker.publish(BROKER_EXCHANGES.EVENTS, BROKER_ROUTING_KEYS.AUTH_USER_VERIFIED, {
      userId: updatedUser.id,
      email: updatedUser.email,
      fullName: updatedUser.full_name,
    }).catch((err) => {
      console.error('❌ Failed to publish AUTH_USER_VERIFIED event:', err);
    });

    const { password: _password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }
}

export default new AuthService();
