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
  Award,
} from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(3, { message: 'Nama lengkap minimal 3 karakter.' }),
  title_credential: z.string().min(2, { message: 'Gelar/Titel minimal 2 karakter.' }),
  email: z.string().email({ message: 'Alamat email tidak valid.' }),
  phone: z.string().min(10, { message: 'Nomor telepon minimal 10 digit.' }),
  bio: z.string().max(300, { message: 'Bio maksimal 300 karakter.' }),
  experience: z.string().min(10, { message: 'Ketik ringkasan pengalaman mengajar Anda.' }),
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

const EXPERTISE_TAGS = [
  { id: 'agronomi', label: 'Agronomi & Nutrisi Tanaman' },
  { id: 'hidroponik', label: 'Sistem Hidroponik NFT/DFT' },
  { id: 'iot', label: 'IoT & Otomatisasi Irigasi' },
  { id: 'agribisnis', label: 'Kelayakan Bisnis & HPP Tani' },
  { id: 'hama', label: 'Pestisida Hayati Organik' },
];

export default function InstructorSettingsPage() {
  const user = getStoredAuthUser();

  const [profileData, setProfileData] = React.useState<ProfileFormData>({
    name: user?.name || 'Dr. Ir. Heri Susanto',
    title_credential: 'Dosen Senior Agroteknologi IPB',
    email: user?.email || 'heri.susanto@ipb.ac.id',
    phone: '081298765432',
    bio: 'Saya memiliki ketertarikan tinggi mendigitalisasi metode pertanian tradisional ke otomatisasi IoT guna membantu petani muda meningkatkan kualitas panen selada and cabai premium.',
    experience:
      'Dosen agroteknologi selama 15 tahun di IPB dan konsultan smart farming bersertifikat internasional.',
  });

  const [expertise, setExpertise] = React.useState<string[]>(['agronomi', 'hidroponik', 'iot']);

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
    setProfileData(data);
    localStorage.setItem(`inst-profile-${user?.id}`, JSON.stringify(data));

    // Update auth store name if applicable
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

    toast.success('Profil pengajar Anda berhasil diperbarui!');
  };

  const onExpertiseSave = () => {
    localStorage.setItem(`inst-expertise-${user?.id}`, JSON.stringify(expertise));
    toast.success('Fokus keahlian berhasil disimpan!');
  };

  const onSecuritySave = (data: SecurityFormData) => {
    setTimeout(() => {
      resetSecurity();
      toast.success('Kata sandi keamanan berhasil diperbarui!');
    }, 800);
  };

  const toggleExpertise = (id: string) => {
    setExpertise((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full space-y-6 text-slate-900 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Pengaturan Pengajar ⚙️</h1>
        <p className="text-xs font-semibold text-slate-500">
          Kelola profil ajar, biodata kualifikasi sertifikat, bidang fokus keahlian, and keamanan
          sandi.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full space-y-6">
        <TabsList className="bg-slate-100 rounded-xl p-1 max-w-fit flex flex-wrap gap-1">
          <TabsTrigger
            value="profile"
            className="rounded-lg text-xs font-bold px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-1.5"
          >
            <User className="h-3.5 w-3.5 text-slate-500" />
            Profil Pengajar
          </TabsTrigger>
          <TabsTrigger
            value="expertise"
            className="rounded-lg text-xs font-bold px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-1.5"
          >
            <Sprout className="h-3.5 w-3.5 text-slate-500" />
            Bidang Keahlian
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="rounded-lg text-xs font-bold px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-1.5"
          >
            <KeyRound className="h-3.5 w-3.5 text-slate-500" />
            Keamanan Sandi
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Profile */}
        <TabsContent value="profile" className="mt-0">
          <form onSubmit={handleProfileSubmit(onProfileSave)} className="max-w-2xl">
            <Card className="border-slate-200 bg-white rounded-2xl shadow-sm">
              <CardHeader className="pb-4 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-slate-800">
                  Kualifikasi Profil Publik
                </CardTitle>
                <CardDescription className="text-[11px] font-semibold text-slate-400 mt-0.5">
                  Informasi di bawah akan dipaparkan pada biografi pengajar di rincian kelas siswa.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4 text-xs font-semibold text-slate-700">
                {/* Name and title */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-xs font-bold text-slate-700">
                      Nama Lengkap
                    </label>
                    <Input
                      id="name"
                      {...registerProfile('name')}
                      className="bg-white border-slate-200 text-xs font-semibold focus:ring-green-500 rounded-xl"
                    />
                    {profileErrors.name && (
                      <p className="text-[10px] font-bold text-red-500 mt-1">
                        {profileErrors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="title_credential" className="text-xs font-bold text-slate-700">
                      Gelar & Titel Profesional
                    </label>
                    <Input
                      id="title_credential"
                      placeholder="Contoh: Dosen Agroteknologi IPB"
                      {...registerProfile('title_credential')}
                      className="bg-white border-slate-200 text-xs font-semibold focus:ring-green-500 rounded-xl"
                    />
                    {profileErrors.title_credential && (
                      <p className="text-[10px] font-bold text-red-500 mt-1">
                        {profileErrors.title_credential.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email and Phone */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-bold text-slate-700">
                      Alamat Email Pengajar
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="email"
                        {...registerProfile('email')}
                        className="pl-10 bg-white border-slate-200 text-xs font-semibold focus:ring-green-500 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="text-xs font-bold text-slate-700">
                      Nomor WhatsApp WhatsApp
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="phone"
                        {...registerProfile('phone')}
                        className="pl-10 bg-white border-slate-200 text-xs font-semibold focus:ring-green-500 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-1.5">
                  <label htmlFor="bio" className="text-xs font-bold text-slate-700">
                    Biografi Ringkas
                  </label>
                  <Textarea
                    id="bio"
                    rows={3}
                    {...registerProfile('bio')}
                    className="bg-white border-slate-200 text-xs font-semibold focus:ring-green-500 rounded-xl resize-none"
                  />
                  {profileErrors.bio && (
                    <p className="text-[10px] font-bold text-red-500 mt-1">
                      {profileErrors.bio.message}
                    </p>
                  )}
                </div>

                {/* Experience */}
                <div className="space-y-1.5">
                  <label htmlFor="experience" className="text-xs font-bold text-slate-700">
                    Riwayat Pengalaman Mengajar & Profesional
                  </label>
                  <Textarea
                    id="experience"
                    rows={3}
                    placeholder="Contoh: Dosen agribisnis selama 10 tahun, penemu sistem otomatisasi pupuk sayur..."
                    {...registerProfile('experience')}
                    className="bg-white border-slate-200 text-xs font-semibold focus:ring-green-500 rounded-xl resize-none"
                  />
                  {profileErrors.experience && (
                    <p className="text-[10px] font-bold text-red-500 mt-1">
                      {profileErrors.experience.message}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50/50 border-t border-slate-100 p-4 flex justify-end">
                <Button
                  type="submit"
                  disabled={isProfileSubmitting}
                  className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl shadow-sm gap-1.5"
                >
                  <Save className="h-3.5 w-3.5" />
                  Simpan Perubahan Profil
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>

        {/* Tab 2: Expertise */}
        <TabsContent value="expertise" className="mt-0">
          <Card className="max-w-2xl border-slate-200 bg-white rounded-2xl shadow-sm">
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-800">
                Fokus Bidang Keahlian Ajar
              </CardTitle>
              <CardDescription className="text-[11px] font-semibold text-slate-400 mt-0.5">
                Keahlian ini memverifikasi kewenangan and kompetensi Anda sebagai pengajar di
                platform SmartTani.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                {EXPERTISE_TAGS.map((tag) => {
                  const isChecked = expertise.includes(tag.id);
                  return (
                    <div
                      key={tag.id}
                      onClick={() => toggleExpertise(tag.id)}
                      className={`flex items-start gap-3.5 p-3.5 rounded-xl border transition-all duration-300 cursor-pointer select-none ${
                        isChecked
                          ? 'border-green-600 bg-green-50/20'
                          : 'border-slate-100 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <Checkbox
                        id={tag.id}
                        checked={isChecked}
                        onCheckedChange={() => {}}
                        className="mt-0.5 border-slate-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                      />
                      <div className="space-y-0.5">
                        <label
                          htmlFor={tag.id}
                          className="text-xs font-bold text-slate-800 cursor-pointer"
                        >
                          {tag.label}
                        </label>
                        <p className="text-[10px] font-semibold text-slate-400">
                          Memperoleh wewenang ajar di bidang materi terkait.
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50/50 border-t border-slate-100 p-4 flex justify-end">
              <Button
                onClick={onExpertiseSave}
                className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl shadow-sm gap-1.5"
              >
                <Bookmark className="h-3.5 w-3.5" />
                Simpan Fokus Keahlian
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Tab 3: Security */}
        <TabsContent value="security" className="mt-0">
          <form onSubmit={handleSecuritySubmit(onSecuritySave)} className="max-w-2xl">
            <Card className="border-slate-200 bg-white rounded-2xl shadow-sm">
              <CardHeader className="pb-4 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-slate-800">Ubah Kata Sandi</CardTitle>
                <CardDescription className="text-[11px] font-semibold text-slate-400 mt-0.5">
                  Pastikan sandi Anda aman and diubah berkala demi keamanan platform.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4 text-xs font-semibold text-slate-700">
                {/* Current Password */}
                <div className="space-y-1.5">
                  <label htmlFor="currentPassword" className="text-xs font-bold text-slate-700">
                    Kata Sandi Saat Ini
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="••••••••"
                      {...registerSecurity('currentPassword')}
                      className="pl-10 bg-white border-slate-200 text-xs font-semibold focus:ring-green-500 rounded-xl"
                    />
                  </div>
                  {securityErrors.currentPassword && (
                    <p className="text-[10px] font-bold text-red-500 mt-1">
                      {securityErrors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* New Password */}
                  <div className="space-y-1.5">
                    <label htmlFor="newPassword" className="text-xs font-bold text-slate-700">
                      Kata Sandi Baru
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="Minimal 6 karakter"
                        {...registerSecurity('newPassword')}
                        className="pl-10 bg-white border-slate-200 text-xs font-semibold focus:ring-green-500 rounded-xl"
                      />
                    </div>
                    {securityErrors.newPassword && (
                      <p className="text-[10px] font-bold text-red-500 mt-1">
                        {securityErrors.newPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <label htmlFor="confirmPassword" className="text-xs font-bold text-slate-700">
                      Konfirmasi Sandi Baru
                    </label>
                    <div className="relative">
                      <ShieldAlert className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Ulangi sandi baru"
                        {...registerSecurity('confirmPassword')}
                        className="pl-10 bg-white border-slate-200 text-xs font-semibold focus:ring-green-500 rounded-xl"
                      />
                    </div>
                    {securityErrors.confirmPassword && (
                      <p className="text-[10px] font-bold text-red-500 mt-1">
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
                  className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl shadow-sm gap-1.5"
                >
                  <Lock className="h-3.5 w-3.5" />
                  Perbarui Kata Sandi
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
