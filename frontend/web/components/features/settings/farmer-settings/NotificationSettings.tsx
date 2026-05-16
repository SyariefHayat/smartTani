'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, Mail, Smartphone, ShoppingBag, TrendingUp, ShieldCheck } from 'lucide-react';

export function NotificationSettings() {
  const notificationOptions = [
    {
      id: 'orders',
      title: 'Pesanan Masuk',
      description: 'Dapatkan notifikasi ketika ada pembeli memesan produk Anda.',
      icon: ShoppingBag,
      defaultChecked: true,
    },
    {
      id: 'investments',
      title: 'Update Investasi',
      description: 'Notifikasi mengenai progres pendanaan atau pencairan investasi.',
      icon: TrendingUp,
      defaultChecked: true,
    },
    {
      id: 'system',
      title: 'Keamanan Akun',
      description: 'Notifikasi penting mengenai login dan perubahan password.',
      icon: ShieldCheck,
      defaultChecked: true,
    },
  ];

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle>Preferensi Notifikasi</CardTitle>
        <CardDescription>Pilih jenis informasi yang ingin Anda terima.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-blue-500" />
              <div>
                <Label className="text-sm font-bold">Notifikasi Email</Label>
                <p className="text-xs text-muted-foreground">
                  Kirim laporan mingguan ke email Anda.
                </p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-green-500" />
              <div>
                <Label className="text-sm font-bold">Push Notification</Label>
                <p className="text-xs text-muted-foreground">
                  Notifikasi langsung ke perangkat mobile.
                </p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h4 className="text-sm font-bold">Jenis Aktivitas</h4>
          {notificationOptions.map((opt) => (
            <div key={opt.id} className="flex items-start justify-between">
              <div className="flex gap-3">
                <opt.icon className="h-5 w-5 text-slate-400 mt-1" />
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">{opt.title}</Label>
                  <p className="text-xs text-muted-foreground">{opt.description}</p>
                </div>
              </div>
              <Switch defaultChecked={opt.defaultChecked} />
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4">
          <Button className="bg-slate-900 text-white hover:bg-slate-800">Simpan Pengaturan</Button>
        </div>
      </CardContent>
    </Card>
  );
}
