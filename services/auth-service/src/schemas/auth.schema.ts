import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  role: z.enum(['petani', 'buyer', 'investor', 'distributor', 'logistik', 'admin'], {
    message: 'Role tidak valid',
  }),
  full_name: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const VerifyEmailSchema = z.object({
  token: z.string().min(1, 'Token verifikasi wajib diisi'),
});

export type VerifyEmailInput = z.infer<typeof VerifyEmailSchema>;

export const LoginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token wajib diisi'),
});

export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;

export const LogoutSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token wajib diisi'),
});

export type LogoutInput = z.infer<typeof LogoutSchema>;

export const UpdateProfileSchema = z.object({
  full_name: z.string().min(3, 'Nama lengkap minimal 3 karakter').optional(),
  phone: z.string().min(10, 'Nomor telepon minimal 10 karakter').optional(),
  avatar_url: z.string().url('Format URL avatar tidak valid').optional().or(z.literal('')),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

export const GetUsersSchema = z.object({
  role: z.string().optional(),
  status: z.string().optional(),
  page: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 20)),
});

export const UpdateUserStatusSchema = z.object({
  status: z.enum(['active', 'suspended', 'pending_verification']),
});
