'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Mail, Smartphone, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth';

export function NotificationSettings() {
  const { notificationPreferences, updateNotificationPreferences } = useAuthStore();
  const [preferences, setPreferences] = React.useState(notificationPreferences);

  const [prevPreferences, setPrevPreferences] = React.useState(notificationPreferences);
  if (notificationPreferences !== prevPreferences) {
    setPrevPreferences(notificationPreferences);
    setPreferences(notificationPreferences);
  }

  const handleToggle = (key: keyof typeof preferences, checked: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: checked,
    }));
  };

  const handleSave = () => {
    updateNotificationPreferences(preferences);
    toast.success('Preferensi notifikasi berhasil disimpan');
  };

  return (
    <Card className="border border-slate-200 shadow-xs text-slate-900 bg-white rounded-xl">
      <CardHeader>
        <CardTitle>Preferensi Notifikasi</CardTitle>
        <CardDescription>
          Pilih jenis informasi dan saluran notifikasi yang ingin Anda terima.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-blue-50 text-blue-600">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <Label className="text-sm font-bold cursor-pointer">Email Order Baru</Label>
                <p className="text-xs text-slate-500">
                  Terima notifikasi email setiap kali ada pesanan baru untuk produk pertanian Anda.
                </p>
              </div>
            </div>
            <Switch
              checked={preferences.email_new_order}
              onCheckedChange={(checked) => handleToggle('email_new_order', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-indigo-50 text-indigo-600">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <Label className="text-sm font-bold cursor-pointer">Email Pembayaran</Label>
                <p className="text-xs text-slate-500">
                  Terima notifikasi email ketika pembayaran dari pembeli telah berhasil konfirmasi.
                </p>
              </div>
            </div>
            <Switch
              checked={preferences.email_payment}
              onCheckedChange={(checked) => handleToggle('email_payment', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-green-50 text-green-600">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <Label className="text-sm font-bold cursor-pointer">Push Notification</Label>
                <p className="text-xs text-slate-500">
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

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <Button
            className="cursor-pointer bg-green-600 text-white hover:bg-green-700 font-semibold text-xs h-9 shadow-2xs"
            onClick={handleSave}
          >
            Simpan Pengaturan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
