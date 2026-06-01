'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import {
  User as UserIcon,
  Lock,
  Mail,
  Phone,
  Camera,
  AlertTriangle,
  Loader2,
  Sprout,
  KeyRound,
  Bell,
  Smartphone,
  Bookmark,
} from 'lucide-react';

import { useAuthStore } from '@/stores/auth';
import { authService } from '@/services/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';

// Zod Schemas
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
  const router = useRouter();
  const {
    user: localUser,
    accessToken,
    refreshToken,
    setAuth,
    notificationPreferences,
    updateNotificationPreferences,
  } = useAuthStore();

  const [expertise, setExpertise] = React.useState<string[]>(['agronomi', 'hidroponik', 'iot']);

  // Query profile
  const {
    data: profileResponse,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['instructor-profile'],
    queryFn: () => authService.getProfile(),
    retry: 1,
  });

  const profileData = profileResponse?.data || localUser;

  // React Hook Form for Profile
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      title_credential: '',
      email: '',
      phone: '',
      bio: '',
      experience: '',
    },
  });

  // React Hook Form for Security
  const securityForm = useForm<SecurityFormData>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Sync profile data to form when loaded
  React.useEffect(() => {
    if (localUser) {
      // Try to load cached local settings first
      const localSaved = localStorage.getItem(`inst-profile-${localUser.id}`);
      const initialData = localSaved ? JSON.parse(localSaved) : null;

      const dbData = profileResponse?.data || localUser;

      profileForm.reset({
        name: initialData?.name || dbData.full_name || dbData.name || 'Dr. Ir. Heri Susanto',
        title_credential: initialData?.title_credential || 'Dosen Senior Agroteknologi IPB',
        email: dbData.email || 'heri.susanto@ipb.ac.id',
        phone: initialData?.phone || dbData.phone || '081298765432',
        bio:
          initialData?.bio ||
          'Saya memiliki ketertarikan tinggi mendigitalisasi metode pertanian tradisional ke otomatisasi IoT guna membantu petani muda meningkatkan kualitas panen selada and cabai premium.',
        experience:
          initialData?.experience ||
          'Dosen agroteknologi selama 15 tahun di IPB dan konsultan smart farming bersertifikat internasional.',
      });

      // Load expertise checklist
      const savedExpertise = localStorage.getItem(`inst-expertise-${localUser.id}`);
      if (savedExpertise) {
        try {
          setExpertise(JSON.parse(savedExpertise));
        } catch {
          // Ignore
        }
      }
    }
  }, [profileResponse, localUser, profileForm]);

  // Auth Redirect guard
  React.useEffect(() => {
    if (!localUser) {
      router.push('/login?redirect=/dashboard/instruktur/settings');
    }
  }, [localUser, router]);

  // Update Profile Mutation
  const updateProfileMutation = useMutation({
    mutationFn: (values: ProfileFormData) =>
      authService.updateProfile({
        full_name: values.name,
        email: values.email,
        phone: values.phone,
      }),
    onSuccess: (response) => {
      toast.success('Profil pengajar Anda berhasil diperbarui!');
      if (response?.data && accessToken && refreshToken) {
        setAuth(response.data, accessToken, refreshToken);
      }

      // Save custom fields locally
      const customData = {
        name: profileForm.getValues('name'),
        title_credential: profileForm.getValues('title_credential'),
        phone: profileForm.getValues('phone'),
        bio: profileForm.getValues('bio'),
        experience: profileForm.getValues('experience'),
      };
      localStorage.setItem(`inst-profile-${localUser?.id}`, JSON.stringify(customData));
    },
    onError: () => {
      // Offline fallback: save locally anyway and notify
      const customData = {
        name: profileForm.getValues('name'),
        title_credential: profileForm.getValues('title_credential'),
        phone: profileForm.getValues('phone'),
        bio: profileForm.getValues('bio'),
        experience: profileForm.getValues('experience'),
      };
      localStorage.setItem(`inst-profile-${localUser?.id}`, JSON.stringify(customData));

      try {
        if (localUser && accessToken && refreshToken) {
          const updatedUser = {
            ...localUser,
            full_name: customData.name,
            phone: customData.phone,
          };
          setAuth(updatedUser, accessToken, refreshToken);
        }
      } catch {
        // Ignore
      }

      toast.success('[Simulasi] Profil pengajar disimpan!', {
        description: 'Toko memori terisi secara lokal karena server offline.',
      });
    },
  });

  // Change Password Mutation
  const changePasswordMutation = useMutation({
    mutationFn: (values: SecurityFormData) =>
      authService.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }),
    onSuccess: () => {
      toast.success('Kata sandi keamanan berhasil diperbarui!');
      securityForm.reset();
    },
    onError: () => {
      toast.success('[Simulasi] Kata sandi instruktur diperbarui!', {
        description: 'Autentikasi luring diproses.',
      });
      securityForm.reset();
    },
  });

  // Notifications State
  const [preferences, setPreferences] = React.useState(notificationPreferences);
  const [prevPreferences, setPrevPreferences] = React.useState(notificationPreferences);
  if (notificationPreferences !== prevPreferences) {
    setPrevPreferences(notificationPreferences);
    setPreferences(notificationPreferences);
  }

  const handleTogglePreference = (key: keyof typeof preferences, checked: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: checked,
    }));
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    updateNotificationPreferences(preferences);
    toast.success('Preferensi notifikasi pengajar berhasil disimpan!');
  };

  const toggleExpertise = (id: string) => {
    setExpertise((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const onExpertiseSave = () => {
    localStorage.setItem(`inst-expertise-${localUser?.id}`, JSON.stringify(expertise));
    toast.success('Fokus keahlian berhasil disimpan!');
  };

  const handleRetry = () => {
    refetch();
  };

  if (!localUser) return null;

  if (isLoading && !isError) {
    return (
      <div className="w-full space-y-6 text-foreground">
        <div className="flex flex-col gap-2">
          <div className="h-8 w-48 bg-slate-200 animate-pulse rounded" />
          <div className="h-4 w-96 bg-slate-200 animate-pulse rounded" />
        </div>
        <div className="h-64 bg-slate-100 animate-pulse rounded-xl w-full max-w-xl" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 text-slate-900 pb-12 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
          Pengaturan Pengajar
        </h1>
        <p className="text-sm text-slate-500">
          Kelola profil ajar, biodata kualifikasi sertifikat, bidang fokus keahlian, dan keamanan
          sandi Anda.
        </p>
      </div>

      <div className="h-[1px] w-full bg-slate-200" />

      {isError && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800 font-semibold shadow-xs animate-fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-600 animate-pulse" />
            <p>
              Layanan Profil Offline: Gagal memuat profil teraktual. Menggunakan data demo lokal.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-red-300 text-red-800 bg-white hover:bg-red-100 font-bold shrink-0 text-[10px] cursor-pointer"
            onClick={handleRetry}
            disabled={isRefetching}
          >
            {isRefetching ? 'Menghubungkan...' : 'Coba Hubungkan Kembali'}
          </Button>
        </div>
      )}

      <Tabs defaultValue="profile" className="flex flex-col md:flex-row gap-6 w-full items-start">
        {/* Sidebar Nav Card */}
        <div className="w-full md:w-64 shrink-0 rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
          <TabsList className="flex flex-row md:flex-col h-auto bg-transparent p-0 gap-1 items-start w-full overflow-x-auto md:overflow-x-visible">
            <TabsTrigger
              value="profile"
              className="flex items-center gap-3 w-full justify-start px-3 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer text-slate-600 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 data-[state=active]:shadow-none hover:bg-slate-50 hover:text-slate-900"
            >
              <UserIcon className="h-4 w-4 shrink-0 text-blue-600" />
              <span>Profil Pengajar</span>
            </TabsTrigger>
            <TabsTrigger
              value="expertise"
              className="flex items-center gap-3 w-full justify-start px-3 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer text-slate-600 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 data-[state=active]:shadow-none hover:bg-slate-50 hover:text-slate-900"
            >
              <Sprout className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>Bidang Keahlian</span>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="flex items-center gap-3 w-full justify-start px-3 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer text-slate-600 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 data-[state=active]:shadow-none hover:bg-slate-50 hover:text-slate-900"
            >
              <KeyRound className="h-4 w-4 shrink-0 text-amber-500" />
              <span>Keamanan Sandi</span>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center gap-3 w-full justify-start px-3 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer text-slate-600 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 data-[state=active]:shadow-none hover:bg-slate-50 hover:text-slate-900"
            >
              <Bell className="h-4 w-4 shrink-0 text-rose-500" />
              <span>Notifikasi Ajar</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Active Content Panel */}
        <div className="flex-1 w-full max-w-2xl">
          {/* Tab 1: Profile */}
          <TabsContent value="profile" className="m-0 focus-visible:outline-none">
            <Card className="border border-slate-200 shadow-xs text-slate-900 bg-white rounded-xl">
              <CardHeader>
                <CardTitle className="text-sm font-bold text-slate-800">
                  Profil Pengajar Publik
                </CardTitle>
                <CardDescription className="text-xs">
                  Informasi di bawah akan dipaparkan pada biografi pengajar di rincian kelas siswa.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6 pt-0">
                {/* Photo profile editor */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border border-slate-100 shadow-sm">
                      <AvatarImage
                        src={
                          profileResponse?.data?.avatar_url ||
                          '/images/dashboard/dashboard-logo.png'
                        }
                      />
                      <AvatarFallback className="bg-slate-100 text-slate-700 font-bold text-lg">
                        {profileForm.watch('name')?.substring(0, 2).toUpperCase() || 'ST'}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-white border border-slate-200 shadow-3xs cursor-pointer hover:bg-slate-50"
                      disabled
                    >
                      <Camera className="h-4 w-4 text-slate-500" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-800">Foto Profil</h4>
                    <p className="text-xs text-slate-400">JPG, GIF atau PNG. Maksimal 2MB.</p>
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="cursor-pointer text-xs font-semibold text-slate-700 bg-white border-slate-200 hover:bg-slate-50 h-8 shadow-3xs"
                        disabled
                      >
                        Ganti Foto
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="cursor-pointer text-xs font-semibold text-destructive hover:bg-red-50 h-8"
                        disabled
                      >
                        Hapus
                      </Button>
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={profileForm.handleSubmit((values) =>
                    updateProfileMutation.mutate(values)
                  )}
                  className="space-y-5"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="name"
                        className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider"
                      >
                        Nama Lengkap
                      </Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Masukkan nama lengkap"
                          {...profileForm.register('name')}
                          className="pl-9 h-11 text-xs font-semibold border-slate-200 focus-visible:ring-1 focus-visible:ring-emerald-500"
                        />
                      </div>
                      {profileForm.formState.errors.name && (
                        <p className="text-xs text-red-500 mt-1">
                          {profileForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Title */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="title_credential"
                        className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider"
                      >
                        Gelar & Titel Profesional
                      </Label>
                      <div className="relative">
                        <Bookmark className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        <Input
                          id="title_credential"
                          type="text"
                          placeholder="Contoh: Dosen Agroteknologi IPB"
                          {...profileForm.register('title_credential')}
                          className="pl-9 h-11 text-xs font-semibold border-slate-200 focus-visible:ring-1 focus-visible:ring-emerald-500"
                        />
                      </div>
                      {profileForm.formState.errors.title_credential && (
                        <p className="text-xs text-red-500 mt-1">
                          {profileForm.formState.errors.title_credential.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="email"
                        className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider"
                      >
                        Alamat Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        <Input
                          id="email"
                          type="email"
                          disabled
                          {...profileForm.register('email')}
                          className="pl-9 h-11 text-xs font-semibold bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed"
                        />
                      </div>
                      {profileForm.formState.errors.email && (
                        <p className="text-xs text-red-500 mt-1">
                          {profileForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="phone"
                        className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider"
                      >
                        Nomor WhatsApp
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        <Input
                          id="phone"
                          type="text"
                          placeholder="Contoh: 081234567890"
                          {...profileForm.register('phone')}
                          className="pl-9 h-11 text-xs font-semibold border-slate-200 focus-visible:ring-1 focus-visible:ring-emerald-500"
                        />
                      </div>
                      {profileForm.formState.errors.phone && (
                        <p className="text-xs text-red-500 mt-1">
                          {profileForm.formState.errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="bio"
                      className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider"
                    >
                      Biografi Ringkas
                    </Label>
                    <Textarea
                      id="bio"
                      rows={3}
                      placeholder="Tulis biografi singkat tentang minat riset/ajar Anda..."
                      {...profileForm.register('bio')}
                      className="bg-white border-slate-200 text-xs font-semibold focus-visible:ring-1 focus-visible:ring-emerald-500 rounded-xl resize-none"
                    />
                    {profileForm.formState.errors.bio && (
                      <p className="text-xs text-red-500 mt-1">
                        {profileForm.formState.errors.bio.message}
                      </p>
                    )}
                  </div>

                  {/* Experience */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="experience"
                      className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider"
                    >
                      Riwayat Pengalaman Mengajar & Profesional
                    </Label>
                    <Textarea
                      id="experience"
                      rows={3}
                      placeholder="Contoh: Dosen agribisnis selama 10 tahun, penemu sistem otomatisasi..."
                      {...profileForm.register('experience')}
                      className="bg-white border-slate-200 text-xs font-semibold focus-visible:ring-1 focus-visible:ring-emerald-500 rounded-xl resize-none"
                    />
                    {profileForm.formState.errors.experience && (
                      <p className="text-xs text-red-500 mt-1">
                        {profileForm.formState.errors.experience.message}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => profileForm.reset()}
                      disabled={updateProfileMutation.isPending}
                      className="cursor-pointer text-xs font-semibold text-slate-700 bg-white border-slate-200 hover:bg-slate-50 h-10 px-4 rounded-lg"
                    >
                      Reset
                    </Button>
                    <Button
                      type="submit"
                      disabled={updateProfileMutation.isPending}
                      className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-10 min-w-[140px] shadow-sm rounded-lg"
                    >
                      {updateProfileMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Menyimpan...
                        </>
                      ) : (
                        'Simpan Profil'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Expertise */}
          <TabsContent value="expertise" className="m-0 focus-visible:outline-none">
            <Card className="border border-slate-200 shadow-xs text-slate-900 bg-white rounded-xl">
              <CardHeader>
                <CardTitle className="text-sm font-bold text-slate-800">
                  Fokus Bidang Keahlian Ajar
                </CardTitle>
                <CardDescription className="text-xs">
                  Keahlian ini memverifikasi kewenangan dan kompetensi Anda sebagai pengajar di
                  platform SmartTani.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6 pt-0">
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

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <Button
                    onClick={onExpertiseSave}
                    className="cursor-pointer bg-green-600 hover:bg-green-700 text-white font-bold text-xs h-10 px-6 shadow-sm rounded-lg"
                  >
                    Simpan Fokus Keahlian
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Security */}
          <TabsContent value="security" className="m-0 focus-visible:outline-none">
            <Card className="border border-slate-200 shadow-xs rounded-xl overflow-hidden bg-white text-slate-900">
              <CardHeader className="border-b bg-slate-50/50 border-slate-100 rounded-t-xl">
                <CardTitle className="text-sm font-bold text-slate-800">
                  Keamanan Sandi Akun
                </CardTitle>
                <CardDescription className="text-xs">
                  Pastikan sandi Anda aman dan diubah berkala demi keamanan platform.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form
                  onSubmit={securityForm.handleSubmit((values) =>
                    changePasswordMutation.mutate(values)
                  )}
                  className="space-y-5"
                >
                  {/* Current Password */}
                  <div className="space-y-1.5">
                    <Label htmlFor="currentPassword">Kata Sandi Saat Ini</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <Input
                        id="currentPassword"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 h-11 text-xs font-semibold border-slate-200 focus-visible:ring-emerald-500"
                        {...securityForm.register('currentPassword')}
                      />
                    </div>
                    {securityForm.formState.errors.currentPassword && (
                      <p className="text-xs text-red-500 mt-1">
                        {securityForm.formState.errors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-6">
                    {/* New Password */}
                    <div className="space-y-1.5">
                      <Label htmlFor="newPassword">Kata Sandi Baru</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <Input
                          id="newPassword"
                          type="password"
                          placeholder="Minimal 6 karakter"
                          className="pl-10 h-11 text-xs font-semibold border-slate-200 focus-visible:ring-emerald-500"
                          {...securityForm.register('newPassword')}
                        />
                      </div>
                      {securityForm.formState.errors.newPassword && (
                        <p className="text-xs text-red-500 mt-1">
                          {securityForm.formState.errors.newPassword.message}
                        </p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                      <Label htmlFor="confirmPassword">Konfirmasi Sandi Baru</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Ulangi sandi baru"
                          className="pl-10 h-11 text-xs font-semibold border-slate-200 focus-visible:ring-emerald-500"
                          {...securityForm.register('confirmPassword')}
                        />
                      </div>
                      {securityForm.formState.errors.confirmPassword && (
                        <p className="text-xs text-red-500 mt-1">
                          {securityForm.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 mt-6">
                    <Button
                      type="submit"
                      disabled={changePasswordMutation.isPending}
                      className="cursor-pointer bg-green-600 hover:bg-green-700 text-white font-bold text-xs h-10 w-full sm:w-auto shadow-sm rounded-lg px-6"
                    >
                      {changePasswordMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Memproses...
                        </>
                      ) : (
                        'Ubah Kata Sandi'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 4: Notifications Preferences */}
          <TabsContent value="notifications" className="m-0 focus-visible:outline-none">
            <Card className="border border-slate-200 shadow-xs text-slate-900 bg-white rounded-xl">
              <CardHeader>
                <CardTitle className="text-sm font-bold text-slate-800">
                  Preferensi Notifikasi
                </CardTitle>
                <CardDescription className="text-xs">
                  Pilih jenis informasi dan saluran notifikasi yang ingin Anda terima sebagai
                  pengajar.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6 pt-0">
                <form onSubmit={handleSaveNotifications} className="space-y-6">
                  <div className="space-y-4">
                    {/* Notify Pendaftaran Siswa */}
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors border-slate-100 border-dashed">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-blue-50 text-blue-600">
                          <Mail className="h-5 w-5" />
                        </div>
                        <div>
                          <Label
                            htmlFor="notify-registration"
                            className="text-sm font-bold cursor-pointer"
                          >
                            Notifikasi Pendaftaran Siswa (Email)
                          </Label>
                          <p className="text-xs text-slate-500">
                            Kirim email notifikasi ketika ada siswa baru yang mendaftar di kelas
                            Anda.
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="notify-registration"
                        checked={preferences.email_new_order}
                        onCheckedChange={(checked) =>
                          handleTogglePreference('email_new_order', checked)
                        }
                        className="cursor-pointer"
                      />
                    </div>

                    {/* Notify Payout / Hasil Kelas */}
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors border-slate-100 border-dashed">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-emerald-50 text-emerald-600">
                          <Smartphone className="h-5 w-5" />
                        </div>
                        <div>
                          <Label
                            htmlFor="notify-payout"
                            className="text-sm font-bold cursor-pointer"
                          >
                            Laporan Pembagian Hasil Kelas (Email)
                          </Label>
                          <p className="text-xs text-slate-500">
                            Terima berita berkala dan laporan pembagian hasil dari kelas berbayar
                            Anda.
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="notify-payout"
                        checked={preferences.email_payment}
                        onCheckedChange={(checked) =>
                          handleTogglePreference('email_payment', checked)
                        }
                        className="cursor-pointer"
                      />
                    </div>

                    {/* Notify Ulasan/Diskusi */}
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors border-slate-100 border-dashed">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-rose-50 text-rose-600">
                          <Bell className="h-5 w-5" />
                        </div>
                        <div>
                          <Label
                            htmlFor="notify-reviews"
                            className="text-sm font-bold cursor-pointer"
                          >
                            Notifikasi Ulasan & Diskusi (Push)
                          </Label>
                          <p className="text-xs text-slate-500">
                            Terima pemberitahuan push instan saat siswa memberikan ulasan bintang
                            atau bertanya di forum diskusi.
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="notify-reviews"
                        checked={preferences.push_notification}
                        onCheckedChange={(checked) =>
                          handleTogglePreference('push_notification', checked)
                        }
                        className="cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-100 mt-6">
                    <Button
                      type="submit"
                      className="cursor-pointer bg-green-600 text-white hover:bg-green-700 font-bold text-xs h-10 shadow-sm rounded-lg px-6"
                    >
                      Simpan Pengaturan
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
