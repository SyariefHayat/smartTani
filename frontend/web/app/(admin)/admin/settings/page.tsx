'use client';
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Settings,
  User,
  ShieldAlert,
  Percent,
  DollarSign,
  Save,
  KeyRound,
  Mail,
  Phone,
  ShieldCheck,
  AlertTriangle,
  BookOpen,
} from 'lucide-react';

// Profile validation schema
const profileSchema = z.object({
  fullName: z.string().min(3, 'Nama lengkap minimal harus 3 karakter'),
  email: z.string().email('Format email tidak valid'),
  phone: z.string().min(10, 'Nomor telepon minimal harus 10 digit'),
  adminRole: z.string(),
});
type ProfileFormData = z.infer<typeof profileSchema>;

// Password validation schema
const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, 'Password saat ini harus diisi'),
    newPassword: z.string().min(6, 'Password baru minimal harus 6 karakter'),
    confirmPassword: z.string().min(6, 'Konfirmasi password harus diisi'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Konfirmasi password baru tidak cocok',
    path: ['confirmPassword'],
  });
type PasswordFormData = z.infer<typeof passwordSchema>;

// Platform fees validation schema
const feesSchema = z.object({
  marketplaceCommission: z.number().min(0).max(100),
  investmentFee: z.number().min(0).max(100),
  academyCommission: z.number().min(0).max(100),
  flatLogisticsSurcharge: z.number().min(0),
});
type FeesFormData = z.infer<typeof feesSchema>;

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = React.useState<'profile' | 'security' | 'fees'>('profile');

  // Pre-load or set default platform fees
  React.useEffect(() => {
    if (!localStorage.getItem('admin-platform-fees')) {
      localStorage.setItem(
        'admin-platform-fees',
        JSON.stringify({
          marketplaceCommission: 5.0,
          investmentFee: 2.0,
          academyCommission: 10.0,
          flatLogisticsSurcharge: 5000,
        })
      );
    }
    if (!localStorage.getItem('admin-profile')) {
      localStorage.setItem(
        'admin-profile',
        JSON.stringify({
          fullName: 'Super Admin SmartTani',
          email: 'admin@smarttani.com',
          phone: '082326952833',
          adminRole: 'Super Administrator',
        })
      );
    }
  }, []);

  // Form Profile initialization
  const defaultProfile = (() => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('admin-profile');
      if (data) return JSON.parse(data);
    }
    return {
      fullName: 'Super Admin SmartTani',
      email: 'admin@smarttani.com',
      phone: '082326952833',
      adminRole: 'Super Administrator',
    };
  })();

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema) as any,
    defaultValues: defaultProfile,
  });

  // Form Password initialization
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema) as any,
  });

  // Form Fees initialization
  const defaultFees = (() => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('admin-platform-fees');
      if (data) return JSON.parse(data);
    }
    return {
      marketplaceCommission: 5.0,
      investmentFee: 2.0,
      academyCommission: 10.0,
      flatLogisticsSurcharge: 5000,
    };
  })();

  const feesForm = useForm<FeesFormData>({
    resolver: zodResolver(feesSchema) as any,
    defaultValues: defaultFees,
  });

  // On submit profile change
  const onSubmitProfile = (data: ProfileFormData) => {
    localStorage.setItem('admin-profile', JSON.stringify(data));
    toast.success('Profil admin berhasil diperbarui!');
  };

  // On submit change password
  const onSubmitPassword = (data: PasswordFormData) => {
    toast.success('Kata sandi keamanan berhasil diubah!');
    passwordForm.reset();
  };

  // On submit platform fees change
  const onSubmitFees = (data: FeesFormData) => {
    localStorage.setItem('admin-platform-fees', JSON.stringify(data));
    toast.success('Konfigurasi skema biaya platform diperbarui secara nasional!');
  };

  return (
    <div className="w-full space-y-6 text-slate-900 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-1.5 md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Pengaturan Sistem ⚙️</h1>
          <p className="text-xs font-semibold text-slate-500">
            Konfigurasi tarif komisi transaksi, profil akun administrator, and setelan otentikasi
            keamanan sistem.
          </p>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'profile'
              ? 'border-green-600 text-green-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="h-4 w-4" /> Profil Admin
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'security'
              ? 'border-green-600 text-green-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <KeyRound className="h-4 w-4" /> Keamanan
        </button>
        <button
          onClick={() => setActiveTab('fees')}
          className={`pb-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'fees'
              ? 'border-green-600 text-green-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Percent className="h-4 w-4" /> Biaya Platform
        </button>
      </div>

      {/* Tab Contents */}
      <div className="w-full">
        {/* Tab 1: Profile Settings */}
        {activeTab === 'profile' && (
          <Card className="border-slate-200 bg-white rounded-2xl shadow-sm max-w-2xl">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-slate-800">Ubah Profil Admin</CardTitle>
              <CardDescription className="text-[11px] font-semibold text-slate-500">
                Informasi dasar akun administrator aktif platform SmartTani.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-600">Nama Lengkap</label>
                    <Input
                      {...profileForm.register('fullName')}
                      placeholder="Contoh: Bambang Sugiharto"
                      className="bg-white border-slate-200 text-xs font-semibold focus:ring-green-500 rounded-xl h-10 w-full"
                    />
                    {profileForm.formState.errors.fullName && (
                      <p className="text-[10px] text-red-600 font-bold">
                        {profileForm.formState.errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-600">Role Sistem</label>
                    <Input
                      {...profileForm.register('adminRole')}
                      disabled
                      className="bg-slate-50 border-slate-200 text-xs font-bold text-slate-500 rounded-xl h-10 w-full"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-600">Alamat Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        {...profileForm.register('email')}
                        placeholder="admin@smarttani.com"
                        className="bg-white border-slate-200 text-xs font-semibold focus:ring-green-500 rounded-xl pl-9.5 h-10 w-full"
                      />
                    </div>
                    {profileForm.formState.errors.email && (
                      <p className="text-[10px] text-red-600 font-bold">
                        {profileForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-600">Nomor Telepon</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        {...profileForm.register('phone')}
                        placeholder="082326952833"
                        className="bg-white border-slate-200 text-xs font-semibold focus:ring-green-500 rounded-xl pl-9.5 h-10 w-full"
                      />
                    </div>
                    {profileForm.formState.errors.phone && (
                      <p className="text-[10px] text-red-600 font-bold">
                        {profileForm.formState.errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Save className="h-4 w-4" /> Simpan Profil
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Tab 2: Security Settings */}
        {activeTab === 'security' && (
          <Card className="border-slate-200 bg-white rounded-2xl shadow-sm max-w-2xl">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-slate-800">Ubah Kata Sandi</CardTitle>
              <CardDescription className="text-[11px] font-semibold text-slate-500">
                Jaga kerahasiaan hak akses panel administrasi dengan mengubah kata sandi berkala.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600">
                    Kata Sandi Saat Ini
                  </label>
                  <Input
                    type="password"
                    {...passwordForm.register('currentPassword')}
                    placeholder="••••••••"
                    className="bg-white border-slate-200 text-xs font-semibold focus:ring-green-500 rounded-xl h-10 w-full"
                  />
                  {passwordForm.formState.errors.currentPassword && (
                    <p className="text-[10px] text-red-600 font-bold">
                      {passwordForm.formState.errors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-600">Kata Sandi Baru</label>
                    <Input
                      type="password"
                      {...passwordForm.register('newPassword')}
                      placeholder="Minimal 6 karakter"
                      className="bg-white border-slate-200 text-xs font-semibold focus:ring-green-500 rounded-xl h-10 w-full"
                    />
                    {passwordForm.formState.errors.newPassword && (
                      <p className="text-[10px] text-red-600 font-bold">
                        {passwordForm.formState.errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-600">
                      Konfirmasi Kata Sandi Baru
                    </label>
                    <Input
                      type="password"
                      {...passwordForm.register('confirmPassword')}
                      placeholder="Ketik ulang password baru"
                      className="bg-white border-slate-200 text-xs font-semibold focus:ring-green-500 rounded-xl h-10 w-full"
                    />
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="text-[10px] text-red-600 font-bold">
                        {passwordForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold gap-1.5 cursor-pointer shadow-sm"
                  >
                    <ShieldCheck className="h-4 w-4" /> Perbarui Password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Tab 3: Platform Fees Config */}
        {activeTab === 'fees' && (
          <Card className="border-slate-200 bg-white rounded-2xl shadow-sm max-w-2xl">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-slate-800">
                Skema Biaya & Komisi Platform SmartTani
              </CardTitle>
              <CardDescription className="text-[11px] font-semibold text-slate-500">
                Atur persentase keuntungan platform untuk keberlanjutan pemeliharaan ekosistem.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={feesForm.handleSubmit(onSubmitFees)} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Commission Marketplace */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-600">
                      Komisi Marketplace (%)
                    </label>
                    <div className="relative">
                      <Percent className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        type="number"
                        step="0.1"
                        {...feesForm.register('marketplaceCommission', { valueAsNumber: true })}
                        placeholder="Contoh: 5.0"
                        className="bg-white border-slate-200 text-xs font-bold text-slate-800 focus:ring-green-500 rounded-xl pl-9.5 h-10 w-full"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Beban komisi per transaksi penjualan distributor/buyer.
                    </p>
                    {feesForm.formState.errors.marketplaceCommission && (
                      <p className="text-[10px] text-red-600 font-bold">
                        {feesForm.formState.errors.marketplaceCommission.message}
                      </p>
                    )}
                  </div>

                  {/* Fee Permodalan */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-600">
                      Biaya Pengelolaan Investasi (%)
                    </label>
                    <div className="relative">
                      <Percent className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        type="number"
                        step="0.1"
                        {...feesForm.register('investmentFee', { valueAsNumber: true })}
                        placeholder="Contoh: 2.0"
                        className="bg-white border-slate-200 text-xs font-bold text-slate-800 focus:ring-green-500 rounded-xl pl-9.5 h-10 w-full"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Biaya komisi dari total pencairan dana permodalan tani.
                    </p>
                    {feesForm.formState.errors.investmentFee && (
                      <p className="text-[10px] text-red-600 font-bold">
                        {feesForm.formState.errors.investmentFee.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {/* Academy Platform commission */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-600">
                      Komisi SiTani Academy (%)
                    </label>
                    <div className="relative">
                      <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        type="number"
                        step="0.1"
                        {...feesForm.register('academyCommission', { valueAsNumber: true })}
                        placeholder="Contoh: 10.0"
                        className="bg-white border-slate-200 text-xs font-bold text-slate-800 focus:ring-green-500 rounded-xl pl-9.5 h-10 w-full"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Potongan revenue per pendaftaran kursus berbayar.
                    </p>
                    {feesForm.formState.errors.academyCommission && (
                      <p className="text-[10px] text-red-600 font-bold">
                        {feesForm.formState.errors.academyCommission.message}
                      </p>
                    )}
                  </div>

                  {/* Surcharges Logistics Flat */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-600">
                      Surcharge Logistik SmartTani (Rp)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        type="number"
                        {...feesForm.register('flatLogisticsSurcharge', { valueAsNumber: true })}
                        placeholder="Contoh: 5000"
                        className="bg-white border-slate-200 text-xs font-bold text-slate-800 focus:ring-green-500 rounded-xl pl-9.5 h-10 w-full"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Biaya flat penanganan ekspedisi kurir internal.
                    </p>
                    {feesForm.formState.errors.flatLogisticsSurcharge && (
                      <p className="text-[10px] text-red-600 font-bold">
                        {feesForm.formState.errors.flatLogisticsSurcharge.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200/50 rounded-xl p-4 flex gap-3 text-amber-800 font-bold text-[10px] leading-relaxed">
                  <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                  <p>
                    PERINGATAN: Perubahan komisi platform di atas akan langsung diaplikasikan ke
                    semua transaksi pembelian, invoice, course enrollments, dan pencairan dana baru
                    yang berlangsung di platform.
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Save className="h-4 w-4" /> Terapkan Tarif Biaya
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
