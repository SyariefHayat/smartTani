'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getStoredAuthUser } from '@/lib/auth-storage';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import {
  User,
  ShieldAlert,
  Sprout,
  Save,
  KeyRound,
  Lock,
  Mail,
  Phone,
  Bookmark,
} from 'lucide-react';

// Form Validation Schemas
const profileSchema = z.object({
  name: z.string().min(3, { message: 'Nama lengkap minimal 3 karakter.' }),
  email: z.string().email({ message: 'Alamat email tidak valid.' }),
  phone: z.string().min(10, { message: 'Nomor telepon minimal 10 digit.' }),
  bio: z.string().max(200, { message: 'Bio maksimal 200 karakter.' }).optional(),
});

const securitySchema = z
  .object({
    currentPassword: z.string().min(6, { message: 'Kata sandi saat ini minimal 6 karakter.' }),
    newPassword: z.string().min(6, { message: 'Kata sandi baru minimal 6 karakter.' }),
    confirmPassword: z.string().min(6, { message: 'Konfirmasi kata sandi minimal 6 karakter.' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Konfirmasi kata sandi tidak cocok.',
    path: ['confirmPassword'],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type SecurityFormData = z.infer<typeof securitySchema>;

const INTEREST_CATEGORIES = [
  { id: 'budidaya', label: 'Budidaya Hidroponik & Organik' },
  { id: 'agrotech', label: 'Agroteknologi & IoT Pertanian' },
  { id: 'bisnis', label: 'Manajemen Keuangan & Agribisnis' },
  { id: 'ekspor', label: 'Logistik & Perdagangan Ekspor' },
  { id: 'hama', label: 'Proteksi Tanaman & Organisme Pengganggu' },
];

export default function StudentSettingsPage() {
  const user = getStoredAuthUser();

  // Load profile from localStorage or default
  const [profileData, setProfileData] = React.useState<ProfileFormData>({
    name: user?.name || 'Siswa SiTani',
    email: user?.email || 'siswa@smarttani.com',
    phone: '081234567890',
    bio: 'Saya tertarik mempelajari pertanian pintar (smart farming) dan pemanfaatan IoT untuk irigasi hemat air.',
  });

  const [interests, setInterests] = React.useState<string[]>(['budidaya', 'agrotech']);

  // Profile Form Hook
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: profileData,
  });

  // Security Form Hook
  const {
    register: registerSecurity,
    handleSubmit: handleSecuritySubmit,
    reset: resetSecurity,
    formState: { errors: securityErrors, isSubmitting: isSecuritySubmitting },
  } = useForm<SecurityFormData>({
    resolver: zodResolver(securitySchema),
  });

  const onProfileSave = (data: ProfileFormData) => {
    // Save to localStorage simulation
    setProfileData(data);
    localStorage.setItem(`profile-${user?.id}`, JSON.stringify(data));

    // Attempt update auth store name if applicable
    try {
      const authKey = 'auth-storage';
      const stored = localStorage.getItem(authKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.state && parsed.state.user) {
          parsed.state.user.name = data.name;
          parsed.state.user.email = data.email;
          localStorage.setItem(authKey, JSON.stringify(parsed));
        }
      }
    } catch {
      // Ignore
    }

    toast.success('Profil Anda berhasil diperbarui!');
  };

  const onInterestsSave = () => {
    localStorage.setItem(`interests-${user?.id}`, JSON.stringify(interests));
    toast.success('Minat belajar berhasil disimpan!');
  };

  const onSecuritySave = (_data: SecurityFormData) => {
    // Simulate API update
    setTimeout(() => {
      resetSecurity();
      toast.success('Kata sandi berhasil diperbarui!');
    }, 800);
  };

  const toggleInterest = (id: string) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full space-y-6 text-slate-900 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 md:text-3xl">
          Pengaturan Akun
        </h1>
        <p className="text-sm text-slate-500">
          Kelola profil publik, preferensi minat belajar, dan keamanan akun Anda.
        </p>
      </div>

      <div className="h-[1px] w-full bg-slate-200" />

      <Tabs defaultValue="profile" className="flex flex-col md:flex-row gap-6 w-full items-start">
        {/* Sidebar Nav Card */}
        <div className="w-full md:w-64 shrink-0 rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
          <TabsList className="flex flex-row md:flex-col h-auto bg-transparent p-0 gap-1 items-start w-full overflow-x-auto md:overflow-x-visible">
            <TabsTrigger
              value="profile"
              className="flex items-center gap-3 w-full justify-start px-3 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer text-slate-600 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 data-[state=active]:shadow-none hover:bg-slate-50 hover:text-slate-900"
            >
              <User className="h-4 w-4 shrink-0 text-slate-500" />
              <span>Profil Saya</span>
            </TabsTrigger>
            <TabsTrigger
              value="interests"
              className="flex items-center gap-3 w-full justify-start px-3 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer text-slate-600 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 data-[state=active]:shadow-none hover:bg-slate-50 hover:text-slate-900"
            >
              <Sprout className="h-4 w-4 shrink-0 text-slate-500" />
              <span>Minat Belajar</span>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="flex items-center gap-3 w-full justify-start px-3 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer text-slate-600 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 data-[state=active]:shadow-none hover:bg-slate-50 hover:text-slate-900"
            >
              <KeyRound className="h-4 w-4 shrink-0 text-slate-500" />
              <span>Keamanan</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Active Content Panel */}
        <div className="flex-1 w-full max-w-2xl">
          {/* Tab 1: Profile Settings */}
          <TabsContent value="profile" className="m-0 focus-visible:outline-none">
            <form onSubmit={handleProfileSubmit(onProfileSave)}>
              <Card className="border-slate-200 bg-white rounded-xl shadow-xs text-slate-900">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-slate-800">
                    Data Diri & Profil
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Informasi ini digunakan untuk penerbitan sertifikat kelulusan sah Anda.
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-6 pt-0 space-y-5">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="name"
                      className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider"
                    >
                      Nama Lengkap (Sesuai Sertifikat)
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="name"
                        placeholder="Masukkan nama lengkap Anda..."
                        {...registerProfile('name')}
                        className="pl-10 h-11 text-xs font-semibold border-slate-200 focus-visible:ring-slate-800 rounded-lg"
                      />
                    </div>
                    {profileErrors.name && (
                      <p className="text-xs text-red-500">{profileErrors.name.message}</p>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Email */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="email"
                        className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider"
                      >
                        Alamat Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="email"
                          placeholder="nama@email.com"
                          {...registerProfile('email')}
                          className="pl-10 h-11 text-xs font-semibold border-slate-200 focus-visible:ring-slate-800 rounded-lg"
                        />
                      </div>
                      {profileErrors.email && (
                        <p className="text-xs text-red-500">{profileErrors.email.message}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="phone"
                        className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider"
                      >
                        Nomor WhatsApp
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="phone"
                          placeholder="08xxxxxxxxxx"
                          {...registerProfile('phone')}
                          className="pl-10 h-11 text-xs font-semibold border-slate-200 focus-visible:ring-slate-800 rounded-lg"
                        />
                      </div>
                      {profileErrors.phone && (
                        <p className="text-xs text-red-500">{profileErrors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="bio"
                      className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider"
                    >
                      Biografi Singkat
                    </label>
                    <Textarea
                      id="bio"
                      rows={4}
                      placeholder="Ceritakan sedikit tentang ketertarikan Anda di bidang pertanian..."
                      {...registerProfile('bio')}
                      className="bg-white border-slate-200 text-xs font-semibold focus-visible:ring-slate-800 rounded-lg resize-none"
                    />
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Maksimal 200 karakter.</span>
                      {profileErrors.bio && (
                        <span className="text-red-500 font-bold">{profileErrors.bio.message}</span>
                      )}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="bg-slate-50/50 border-t border-slate-100 p-4 flex justify-end gap-3">
                  <Button
                    type="submit"
                    disabled={isProfileSubmitting}
                    className="cursor-pointer bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs h-10 shadow-sm rounded-lg px-5 gap-1.5"
                  >
                    <Save className="h-3.5 w-3.5" />
                    Simpan Perubahan
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </TabsContent>

          {/* Tab 2: Interests Selection */}
          <TabsContent value="interests" className="m-0 focus-visible:outline-none">
            <Card className="border-slate-200 bg-white rounded-xl shadow-xs text-slate-900">
              <CardHeader>
                <CardTitle className="text-sm font-bold text-slate-800">
                  Topik Pembelajaran Favorit
                </CardTitle>
                <CardDescription className="text-xs">
                  Rekomendasi kelas di katalog dan halaman utama disesuaikan berdasarkan minat Anda.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 pt-0 space-y-4">
                <div className="space-y-3">
                  {INTEREST_CATEGORIES.map((cat) => {
                    const isChecked = interests.includes(cat.id);
                    return (
                      <div
                        key={cat.id}
                        onClick={() => toggleInterest(cat.id)}
                        className={`flex items-start gap-3.5 p-3.5 rounded-xl border transition-all duration-300 cursor-pointer select-none ${
                          isChecked
                            ? 'border-slate-800 bg-slate-50/50'
                            : 'border-slate-100 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <Checkbox
                          id={cat.id}
                          checked={isChecked}
                          onCheckedChange={() => {}} // toggling handled on parent click
                          className="mt-0.5 border-slate-300 data-[state=checked]:bg-slate-800 data-[state=checked]:border-slate-800"
                        />
                        <div className="space-y-0.5">
                          <label
                            htmlFor={cat.id}
                            className="text-xs font-bold text-slate-800 cursor-pointer"
                          >
                            {cat.label}
                          </label>
                          <p className="text-[10px] font-semibold text-slate-400">
                            Mendapatkan update modul, kuis terhubung, dan info webinar terkait.
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>

              <CardFooter className="bg-slate-50/50 border-t border-slate-100 p-4 flex justify-end">
                <Button
                  onClick={onInterestsSave}
                  className="cursor-pointer bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs h-10 shadow-sm rounded-lg px-5 gap-1.5"
                >
                  <Bookmark className="h-3.5 w-3.5" />
                  Simpan Minat
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Tab 3: Security & Password */}
          <TabsContent value="security" className="m-0 focus-visible:outline-none">
            <form onSubmit={handleSecuritySubmit(onSecuritySave)}>
              <Card className="border-slate-200 bg-white rounded-xl shadow-xs text-slate-900">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-slate-800">
                    Kata Sandi & Kredensial
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Demi keamanan akun, pastikan Anda menggunakan kata sandi yang unik dan kuat.
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-6 pt-0 space-y-5">
                  {/* Current Password */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="currentPassword"
                      className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider"
                    >
                      Kata Sandi Saat Ini
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="currentPassword"
                        type="password"
                        placeholder="••••••••"
                        {...registerSecurity('currentPassword')}
                        className="pl-10 h-11 text-xs font-semibold border-slate-200 focus-visible:ring-slate-800 rounded-lg"
                      />
                    </div>
                    {securityErrors.currentPassword && (
                      <p className="text-xs text-red-500">
                        {securityErrors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* New Password */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="newPassword"
                        className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider"
                      >
                        Kata Sandi Baru
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="newPassword"
                          type="password"
                          placeholder="Minimal 6 karakter"
                          {...registerSecurity('newPassword')}
                          className="pl-10 h-11 text-xs font-semibold border-slate-200 focus-visible:ring-slate-800 rounded-lg"
                        />
                      </div>
                      {securityErrors.newPassword && (
                        <p className="text-xs text-red-500">{securityErrors.newPassword.message}</p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="confirmPassword"
                        className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider"
                      >
                        Konfirmasi Kata Sandi Baru
                      </label>
                      <div className="relative">
                        <ShieldAlert className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Ulangi kata sandi baru"
                          {...registerSecurity('confirmPassword')}
                          className="pl-10 h-11 text-xs font-semibold border-slate-200 focus-visible:ring-slate-800 rounded-lg"
                        />
                      </div>
                      {securityErrors.confirmPassword && (
                        <p className="text-xs text-red-500">
                          {securityErrors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="bg-slate-50/50 border-t border-slate-100 p-4 flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSecuritySubmitting}
                    className="cursor-pointer bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs h-10 shadow-sm rounded-lg px-5 gap-1.5"
                  >
                    <Lock className="h-3.5 w-3.5" />
                    Perbarui Kata Sandi
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
