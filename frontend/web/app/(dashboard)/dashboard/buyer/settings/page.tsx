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
import { User, Lock, Bell, ShieldCheck, Mail, Phone, LockKeyhole } from 'lucide-react';

export default function BuyerSettingsPage() {
  const router = useRouter();
  const user = getStoredAuthUser();

  // Profile Form States
  const [name, setName] = React.useState(user?.name || '');
  const [email] = React.useState(user?.email || '');
  const [phone, setPhone] = React.useState(
    (user as unknown as Record<string, string>)?.phone || '0812-3456-7890'
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
      router.push('/login?redirect=/dashboard/buyer/settings');
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
    if (newPassword !== confirmPassword) {
      toast.error('Konfirmasi kata sandi baru tidak cocok');
      return;
    }
    toast.loading('Memperbarui kata sandi...');
    setTimeout(() => {
      toast.dismiss();
      toast.success('Kata sandi berhasil diperbarui!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1500);
  };

  const handleUpdateNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Preferensi notifikasi berhasil disimpan!');
  };

  if (!user) return null;

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl text-slate-800">
          Pengaturan Akun
        </h1>
        <p className="text-sm text-slate-500">
          Kelola profil, keamanan kata sandi, dan preferensi notifikasi Anda.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full space-y-4">
        {/* Tabs Bar List */}
        <TabsList className="bg-slate-100 p-0.5 rounded-lg flex w-fit">
          <TabsTrigger
            value="profile"
            className="px-4 py-2 text-xs font-semibold rounded-md cursor-pointer data-[state=active]:bg-white data-[state=active]:shadow-xs"
          >
            <User className="mr-2 h-4 w-4 text-slate-400" /> Profil Saya
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="px-4 py-2 text-xs font-semibold rounded-md cursor-pointer data-[state=active]:bg-white data-[state=active]:shadow-xs"
          >
            <Lock className="mr-2 h-4 w-4 text-slate-400" /> Keamanan
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="px-4 py-2 text-xs font-semibold rounded-md cursor-pointer data-[state=active]:bg-white data-[state=active]:shadow-xs"
          >
            <Bell className="mr-2 h-4 w-4 text-slate-400" /> Notifikasi
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Profile */}
        <TabsContent value="profile">
          <Card className="border-slate-200 shadow-sm bg-white overflow-hidden max-w-xl">
            <form onSubmit={handleUpdateProfile}>
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-slate-800">
                  Informasi Pribadi
                </CardTitle>
                <CardDescription className="text-xs">
                  Ubah data diri dan informasi kontak Anda.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4 text-xs font-semibold text-slate-700">
                <div className="space-y-1">
                  <label>Nama Lengkap</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="pl-9 h-9 text-xs focus-visible:ring-green-500"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label>Email (Readonly)</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <Input
                      value={email}
                      readOnly
                      className="pl-9 h-9 text-xs bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label>No. Telepon / WhatsApp</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="pl-9 h-9 text-xs focus-visible:ring-green-500"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0 flex justify-end">
                <Button
                  type="submit"
                  size="sm"
                  className="h-9 text-xs font-bold cursor-pointer bg-green-600 hover:bg-green-700"
                >
                  Simpan Perubahan
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Tab 2: Security */}
        <TabsContent value="security">
          <Card className="border-slate-200 shadow-sm bg-white overflow-hidden max-w-xl">
            <form onSubmit={handleUpdatePassword}>
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-slate-800">Ubah Kata Sandi</CardTitle>
                <CardDescription className="text-xs">
                  Pastikan Anda menggunakan kata sandi yang kuat dan unik.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4 text-xs font-semibold text-slate-700">
                <div className="space-y-1">
                  <label>Kata Sandi Saat Ini</label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <Input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="pl-9 h-9 text-xs focus-visible:ring-green-500"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label>Kata Sandi Baru</label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="pl-9 h-9 text-xs focus-visible:ring-green-500"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label>Konfirmasi Kata Sandi Baru</label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="pl-9 h-9 text-xs focus-visible:ring-green-500"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0 flex justify-end">
                <Button
                  type="submit"
                  size="sm"
                  className="h-9 text-xs font-bold cursor-pointer bg-green-600 hover:bg-green-700"
                >
                  Ubah Kata Sandi
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Tab 3: Notifications */}
        <TabsContent value="notifications">
          <Card className="border-slate-200 shadow-sm bg-white overflow-hidden max-w-xl">
            <form onSubmit={handleUpdateNotifications}>
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-slate-800">
                  Preferensi Notifikasi
                </CardTitle>
                <CardDescription className="text-xs">
                  Atur jenis email dan notifikasi push yang ingin Anda terima.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-5 text-xs text-slate-700 font-semibold">
                <div className="flex items-center justify-between gap-4 p-1">
                  <div className="space-y-0.5 flex-1">
                    <label className="text-slate-800">Notifikasi Transaksi (Email)</label>
                    <p className="text-[10px] text-slate-400 font-normal leading-relaxed">
                      Kirim faktur, konfirmasi kurir, dan riwayat belanja via email.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotif}
                    onChange={(e) => setEmailNotif(e.target.checked)}
                    className="h-4.5 w-4.5 rounded border-slate-200 text-green-600 focus:ring-green-500 accent-green-600 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between gap-4 p-1">
                  <div className="space-y-0.5 flex-1">
                    <label className="text-slate-800">Notifikasi Pelacakan Kurir (Push)</label>
                    <p className="text-[10px] text-slate-400 font-normal leading-relaxed">
                      Kirim pemberitahuan push langsung saat status transit paket berubah.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={pushNotif}
                    onChange={(e) => setPushNotif(e.target.checked)}
                    className="h-4.5 w-4.5 rounded border-slate-200 text-green-600 focus:ring-green-500 accent-green-600 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between gap-4 p-1">
                  <div className="space-y-0.5 flex-1">
                    <label className="text-slate-800">Promo & Penawaran Khusus</label>
                    <p className="text-[10px] text-slate-400 font-normal leading-relaxed">
                      Kirim newsletter diskon mingguan dan promo kemitraan pertanian.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={promoNotif}
                    onChange={(e) => setPromoNotif(e.target.checked)}
                    className="h-4.5 w-4.5 rounded border-slate-200 text-green-600 focus:ring-green-500 accent-green-600 cursor-pointer"
                  />
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0 flex justify-end">
                <Button
                  type="submit"
                  size="sm"
                  className="h-9 text-xs font-bold cursor-pointer bg-green-600 hover:bg-green-700"
                >
                  Simpan Preferensi
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
