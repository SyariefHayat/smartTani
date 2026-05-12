import authService from './auth.service';
import userRepository from '../repositories/user.repository';
import RedisClient from '../lib/redis';
import MessageBroker from '../lib/broker';
import bcrypt from 'bcrypt';

jest.mock('../repositories/user.repository');
jest.mock('../lib/redis', () => ({
  __esModule: true,
  default: {
    getInstance: jest.fn().mockReturnValue({
      call: jest.fn().mockImplementation((command, ...args) => {
        if (command === 'SCRIPT' && args[0] === 'LOAD') {
          return Promise.resolve('mock-sha');
        }
        if (command === 'evalsha') {
          return Promise.resolve(1); // successful increment
        }
        return Promise.resolve([0, 0]);
      }),
    }),
    get: jest.fn(),
    set: jest.fn(),
    setex: jest.fn(),
    del: jest.fn(),
  },
}));
jest.mock('../lib/broker');
jest.mock('bcrypt');

describe('AuthService - Register', () => {
  const mockInput = {
    email: 'test@example.com',
    password: 'password123',
    role: 'buyer' as const,
    full_name: 'Test User',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (MessageBroker.publish as jest.Mock).mockResolvedValue(undefined);
  });

  it('should register a new user successfully', async () => {
    (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
    (userRepository.create as jest.Mock).mockResolvedValue({
      id: 'user-id',
      email: mockInput.email,
      role: mockInput.role,
      full_name: mockInput.full_name,
      status: 'active',
    });

    const result = await authService.register(mockInput);

    expect(userRepository.findByEmail).toHaveBeenCalledWith(mockInput.email);
    expect(bcrypt.hash).toHaveBeenCalledWith(mockInput.password, 12);
    expect(userRepository.create).toHaveBeenCalled();
    expect(RedisClient.setex).toHaveBeenCalled();
    expect(MessageBroker.publish).toHaveBeenCalled();
    expect(result).not.toHaveProperty('password');
    expect(result.email).toBe(mockInput.email);
  });

  it('should throw error if email already exists', async () => {
    (userRepository.findByEmail as jest.Mock).mockResolvedValue({ id: 'existing' });

    await expect(authService.register(mockInput)).rejects.toThrow('Email sudah terdaftar');
  });

  it('should set status to pending_verification for role petani', async () => {
    const petaniInput = { ...mockInput, role: 'petani' as const };
    (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
    (userRepository.create as jest.Mock).mockResolvedValue({
      id: 'user-id',
      email: petaniInput.email,
      role: 'petani',
      status: 'pending_verification',
    });

    await authService.register(petaniInput);

    expect(userRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'pending_verification',
      })
    );
  });

  describe('verifyEmail', () => {
    it('should verify email successfully', async () => {
      const mockToken = 'valid-token';
      const mockUserId = 'user-id';
      (RedisClient.get as jest.Mock).mockResolvedValue(mockUserId);
      (userRepository.updateStatus as jest.Mock).mockResolvedValue({});
      (RedisClient.del as jest.Mock).mockResolvedValue({});

      const result = await authService.verifyEmail({ token: mockToken });

      expect(RedisClient.get).toHaveBeenCalledWith(`verify:${mockToken}`);
      expect(userRepository.updateStatus).toHaveBeenCalledWith(mockUserId, 'active');
      expect(RedisClient.del).toHaveBeenCalledWith(`verify:${mockToken}`);
      expect(result.message).toBe('Email berhasil diverifikasi');
    });

    it('should throw error if token is invalid', async () => {
      (RedisClient.get as jest.Mock).mockResolvedValue(null);

      await expect(authService.verifyEmail({ token: 'invalid' })).rejects.toThrow(
        'Token verifikasi tidak valid atau sudah kadaluarsa'
      );
    });
  });

  describe('login', () => {
    const loginInput = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login successfully', async () => {
      const mockUser = {
        id: 'user-id',
        email: loginInput.email,
        password: 'hashed_password',
        role: 'buyer',
        status: 'active',
      };
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (RedisClient.setex as jest.Mock).mockResolvedValue({});

      const result = await authService.login(loginInput);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(loginInput.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(loginInput.password, mockUser.password);
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user.email).toBe(loginInput.email);
    });

    it('should throw 401 if user not found', async () => {
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(authService.login(loginInput)).rejects.toThrow('Email atau password salah');
    });

    it('should throw 401 if password incorrect', async () => {
      (userRepository.findByEmail as jest.Mock).mockResolvedValue({ password: 'hash' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(loginInput)).rejects.toThrow('Email atau password salah');
    });

    it('should throw 403 if email not verified', async () => {
      (userRepository.findByEmail as jest.Mock).mockResolvedValue({
        password: 'hash',
        status: 'pending_verification',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(authService.login(loginInput)).rejects.toThrow('Email belum diverifikasi');
    });

    it('should throw 403 if account suspended', async () => {
      (userRepository.findByEmail as jest.Mock).mockResolvedValue({
        password: 'hash',
        status: 'suspended',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(authService.login(loginInput)).rejects.toThrow('Akun ditangguhkan');
    });
  });

  describe('refresh', () => {
    const refreshInput = { refreshToken: 'valid-refresh' };

    it('should refresh tokens successfully', async () => {
      const mockUserId = 'user-id';
      const mockUser = {
        id: mockUserId,
        email: 'test@example.com',
        role: 'buyer',
        status: 'active',
      };

      (RedisClient.get as jest.Mock).mockResolvedValue(mockUserId);
      (userRepository.findById as jest.Mock).mockResolvedValue(mockUser);
      (RedisClient.del as jest.Mock).mockResolvedValue({});
      (RedisClient.setex as jest.Mock).mockResolvedValue({});

      const result = await authService.refresh(refreshInput);

      expect(RedisClient.get).toHaveBeenCalledWith(`refresh:${refreshInput.refreshToken}`);
      expect(userRepository.findById).toHaveBeenCalledWith(mockUserId);
      expect(RedisClient.del).toHaveBeenCalledWith(`refresh:${refreshInput.refreshToken}`);
      expect(RedisClient.setex).toHaveBeenCalled();
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw 401 if refresh token not in redis', async () => {
      (RedisClient.get as jest.Mock).mockResolvedValue(null);

      await expect(authService.refresh(refreshInput)).rejects.toThrow(
        'Refresh token tidak valid atau sudah kadaluarsa'
      );
    });

    it('should throw 401 if user not found or inactive', async () => {
      (RedisClient.get as jest.Mock).mockResolvedValue('user-id');
      (userRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(authService.refresh(refreshInput)).rejects.toThrow(
        'User tidak aktif atau tidak ditemukan'
      );
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      const mockRefreshToken = 'refresh-token';
      (RedisClient.del as jest.Mock).mockResolvedValue({});

      const result = await authService.logout(mockRefreshToken);

      expect(RedisClient.del).toHaveBeenCalledWith(`refresh:${mockRefreshToken}`);
      expect(result.message).toBe('Berhasil logout');
    });
  });

  describe('getMe', () => {
    it('should return user profile successfully', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        role: 'buyer',
        status: 'active',
      };
      (userRepository.findById as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.getMe('user-id');

      expect(userRepository.findById).toHaveBeenCalledWith('user-id');
      expect(result.email).toBe(mockUser.email);
      expect(result).not.toHaveProperty('password');
    });

    it('should throw 404 if user not found', async () => {
      (userRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(authService.getMe('non-existent')).rejects.toThrow('User tidak ditemukan');
    });
  });

  describe('updateProfile', () => {
    const updateInput = {
      full_name: 'Updated Name',
      phone: '081234567890',
    };

    it('should update profile successfully', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        role: 'buyer',
        status: 'active',
      };
      const updatedUser = { ...mockUser, ...updateInput };

      (userRepository.findById as jest.Mock).mockResolvedValue(mockUser);
      (userRepository.update as jest.Mock).mockResolvedValue(updatedUser);

      const result = await authService.updateProfile('user-id', updateInput);

      expect(userRepository.findById).toHaveBeenCalledWith('user-id');
      expect(userRepository.update).toHaveBeenCalledWith('user-id', updateInput);
      expect(result.full_name).toBe(updateInput.full_name);
    });

    it('should throw 404 if user not found', async () => {
      (userRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(authService.updateProfile('non-existent', updateInput)).rejects.toThrow(
        'User tidak ditemukan'
      );
    });
  });

  describe('getAllUsers', () => {
    it('should return paginated users', async () => {
      const mockResult = {
        users: [{ id: '1', email: 'u1@test.com', password: 'hash' }],
        total: 1,
      };
      (userRepository.findAll as jest.Mock).mockResolvedValue(mockResult);

      const result = await authService.getAllUsers({ page: 1, limit: 10 });

      expect(userRepository.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        role: undefined,
        status: undefined,
      });
      expect(result.users[0]).not.toHaveProperty('password');
      expect(result.meta.total).toBe(1);
    });
  });

  describe('verifyUser', () => {
    it('should verify user successfully', async () => {
      const mockUser = {
        id: '1',
        email: 'p@test.com',
        status: 'pending_verification',
        role: 'petani',
        full_name: 'Test',
        phone: null,
        avatar_url: null,
        fcm_token: null,
        created_at: new Date(),
        updated_at: new Date(),
      };
      (userRepository.findById as jest.Mock).mockResolvedValue(mockUser);
      (userRepository.updateStatus as jest.Mock).mockResolvedValue({
        ...mockUser,
        status: 'active',
      });
      (MessageBroker.publish as jest.Mock).mockResolvedValue({});

      const result = await authService.verifyUser('1');

      expect(userRepository.updateStatus).toHaveBeenCalledWith('1', 'active');
      expect(MessageBroker.publish).toHaveBeenCalled();
      // @ts-expect-error - testing status existence
      expect(result.status).toBe('active');
    });

    it('should throw 404 if user not found', async () => {
      (userRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(authService.verifyUser('non-existent')).rejects.toThrow('User tidak ditemukan');
    });
  });
});
