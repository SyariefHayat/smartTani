'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Mail, Smartphone, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

export function NotificationSettings() {
  const [preferences, setPreferences] = React.useState({
    email_new_order: true,
    email_payment: true,
    push_notification: true,
  });

  // Load preferences from localStorage on component mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('smarttani_notification_preferences');
      if (stored) {
        setTimeout(() => {
          setPreferences(JSON.parse(stored));
        }, 0);
      }
    } catch (e) {
      console.error('Failed to load notification preferences from localStorage', e);
    }
  }, []);

  const handleToggle = (key: keyof typeof preferences, checked: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: checked,
    }));
  };

  const handleSave = () => {
    try {
      localStorage.setItem('smarttani_notification_preferences', JSON.stringify(preferences));
      toast.success('Preferensi notifikasi berhasil disimpan');
    } catch (e) {
      console.error('Failed to save notification preferences', e);
      toast.error('Gagal menyimpan preferensi notifikasi');
    }
  };

  return (
    <Card className="border-none shadow-sm text-slate-900">
      <CardHeader>
        <CardTitle>Preferensi Notifikasi</CardTitle>
        <CardDescription>
          Pilih jenis informasi dan saluran notifikasi yang ingin Anda terima.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-blue-50 text-blue-600">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <Label className="text-sm font-bold cursor-pointer">Email Order Baru</Label>
                <p className="text-xs text-muted-foreground">
                  Terima notifikasi email setiap kali ada pesanan baru untuk produk pertanian Anda.
                </p>
              </div>
            </div>
            <Switch
              checked={preferences.email_new_order}
              onCheckedChange={(checked) => handleToggle('email_new_order', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-indigo-50 text-indigo-600">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <Label className="text-sm font-bold cursor-pointer">Email Pembayaran</Label>
                <p className="text-xs text-muted-foreground">
                  Terima notifikasi email ketika pembayaran dari pembeli telah berhasil
                  dikonfirmasi.
                </p>
              </div>
            </div>
            <Switch
              checked={preferences.email_payment}
              onCheckedChange={(checked) => handleToggle('email_payment', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-green-50 text-green-600">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <Label className="text-sm font-bold cursor-pointer">Push Notification</Label>
                <p className="text-xs text-muted-foreground">
                  Terima notifikasi instan langsung di peramban (browser) atau perangkat Anda.
                </p>
              </div>
            </div>
            <Switch
              checked={preferences.push_notification}
              onCheckedChange={(checked) => handleToggle('push_notification', checked)}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button
            className="bg-green-600 text-white hover:bg-green-700 font-medium"
            onClick={handleSave}
          >
            Simpan Pengaturan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
