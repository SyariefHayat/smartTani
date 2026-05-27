'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { getStoredAuthUser } from '@/lib/auth-storage';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Lock, Bell, Mail, Phone, LockKeyhole } from 'lucide-react';

export default function InvestorSettingsPage() {
  const router = useRouter();
  const user = getStoredAuthUser();

  // Profile Form States
  const [name, setName] = React.useState(user?.name || '');
  const [email] = React.useState(user?.email || '');
  const [phone, setPhone] = React.useState(
    (user as unknown as Record<string, string>)?.phone || '0812-7788-9900'
  );

  // Security Form States
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  // Notification Preferences States
  const [emailNotif, setEmailNotif] = React.useState(true);
  const [pushNotif, setPushNotif] = React.useState(true);
  const [promoNotif, setPromoNotif] = React.useState(false);

  React.useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/dashboard/investor/settings');
    }
  }, [user, router]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.loading('Menyimpan perubahan profil...');
    setTimeout(() => {
      toast.dismiss();
      toast.success('Profil berhasil diperbarui!');
    }, 1200);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Gagal', { description: 'Semua kolom kata sandi wajib diisi!' });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Gagal', { description: 'Konfirmasi kata sandi baru tidak cocok!' });
      return;
    }
    toast.loading('Mengubah kata sandi...');
    setTimeout(() => {
      toast.dismiss();
      toast.success('Kata sandi berhasil diubah!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1200);
  };

  const handleSaveNotifications = () => {
    toast.loading('Menyimpan preferensi notifikasi...');
    setTimeout(() => {
      toast.dismiss();
      toast.success('Preferensi notifikasi berhasil disimpan!');
    }, 1000);
  };

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Pengaturan</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Ubah identitas profil, atur keamanan kata sandi, dan konfigurasikan saluran notifikasi
          Anda.
        </p>
      </div>

      {/* Tabs Container */}
      <Tabs defaultValue="profile" className="w-full">
        <div className="flex justify-start mb-6">
          <TabsList className="bg-slate-100 p-1 border border-slate-200/50 rounded-lg">
            <TabsTrigger
              value="profile"
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-xs text-slate-500 hover:text-slate-800 cursor-pointer rounded-md"
            >
              <User className="h-4 w-4" /> Profil
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-xs text-slate-500 hover:text-slate-800 cursor-pointer rounded-md"
            >
              <Lock className="h-4 w-4" /> Keamanan
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-xs text-slate-500 hover:text-slate-800 cursor-pointer rounded-md"
            >
              <Bell className="h-4 w-4" /> Preferensi Notifikasi
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Profil */}
        <TabsContent value="profile" className="focus-visible:outline-none">
          <Card className="max-w-2xl border border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-800">Profil Pengguna</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Ubah informasi identitas publik akun Anda.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdateProfile}>
              <CardContent className="p-6 space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600">Nama Lengkap</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      className="pl-10 h-10 border-slate-200 text-xs font-medium focus:border-green-500"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600">Alamat Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      className="pl-10 h-10 border-slate-200 text-xs font-medium bg-slate-50 text-slate-400"
                      value={email}
                      disabled
                      title="Email tidak dapat diubah"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600">Nomor Telepon</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      className="pl-10 h-10 border-slate-200 text-xs font-medium focus:border-green-500"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50 border-t border-slate-100 p-4 flex justify-end">
                <Button
                  type="submit"
                  className="h-9 text-xs font-bold bg-green-600 hover:bg-green-700 text-white cursor-pointer shadow-xs"
                >
                  Simpan Perubahan
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Tab 2: Keamanan */}
        <TabsContent value="security" className="focus-visible:outline-none">
          <Card className="max-w-2xl border border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-800">Ubah Kata Sandi</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Amankan akun Anda dengan melakukan rotasi kata sandi secara berkala.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdatePassword}>
              <CardContent className="p-6 space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600">Kata Sandi Sekarang</label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="password"
                      placeholder="Masukkan kata sandi lama Anda"
                      className="pl-10 h-10 border-slate-200 text-xs font-medium focus:border-green-500"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-600">Kata Sandi Baru</label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="password"
                      placeholder="Kata sandi baru (minimal 8 karakter)"
                      className="pl-10 h-10 border-slate-200 text-xs font-medium focus:border-green-500"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600">
                    Konfirmasi Kata Sandi Baru
                  </label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="password"
                      placeholder="Masukkan kembali kata sandi baru Anda"
                      className="pl-10 h-10 border-slate-200 text-xs font-medium focus:border-green-500"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50 border-t border-slate-100 p-4 flex justify-end">
                <Button
                  type="submit"
                  className="h-9 text-xs font-bold bg-green-600 hover:bg-green-700 text-white cursor-pointer shadow-xs"
                >
                  Perbarui Kata Sandi
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Tab 3: Preferensi Notifikasi */}
        <TabsContent value="notifications" className="focus-visible:outline-none">
          <Card className="max-w-2xl border border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-800">
                Preferensi Notifikasi
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Atur ke mana notifikasi dan laporan imbal hasil panen dikirimkan.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800">Notifikasi Email</h4>
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                    Kirim laporan bagi hasil panen dan legalitas proyek baru langsung ke kotak
                    masuk.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotif}
                  onChange={(e) => setEmailNotif(e.target.checked)}
                  className="h-4 w-4 rounded-sm border-slate-300 text-green-600 focus:ring-green-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800">Push Notification Web</h4>
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                    Tampilkan banner notifikasi secara instan saat petani merilis info perkembangan
                    pertanian.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={pushNotif}
                  onChange={(e) => setPushNotif(e.target.checked)}
                  className="h-4 w-4 rounded-sm border-slate-300 text-green-600 focus:ring-green-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800">
                    Email Promosi & Diskon Proyek
                  </h4>
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                    Dapatkan info proyek pertanian bersponsor atau pendanaan bernilai tinggi
                    terlebih dahulu.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={promoNotif}
                  onChange={(e) => setPromoNotif(e.target.checked)}
                  className="h-4 w-4 rounded-sm border-slate-300 text-green-600 focus:ring-green-500 cursor-pointer"
                />
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50 border-t border-slate-100 p-4 flex justify-end">
              <Button
                onClick={handleSaveNotifications}
                className="h-9 text-xs font-bold bg-green-600 hover:bg-green-700 text-white cursor-pointer shadow-xs"
              >
                Simpan Konfigurasi
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
