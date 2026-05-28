'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Bell,
  ShoppingCart,
  AlertTriangle,
  ShieldCheck,
  MailOpen,
  Trash2,
  CheckCircle2,
} from 'lucide-react';

const MOCK_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Pesanan #ORD-98822 Sedang Dikirim',
    message:
      'Kurir logistik MitraTani telah melakukan pickup barang. Paket sedang dalam perjalanan menuju Gudang Utama Anda.',
    type: 'order',
    time: '2026-05-27T09:00:00Z',
    is_read: false,
  },
  {
    id: 'notif-2',
    title: 'Peringatan Stok Kritis Gudang',
    message:
      'Persediaan komoditas "Wortel Brastagi Segar" di gudang distributor Anda tersisa kurang dari 20% (10 kg). Harap lakukan re-order pengadaan.',
    type: 'stock',
    time: '2026-05-26T14:30:00Z',
    is_read: false,
  },
  {
    id: 'notif-3',
    title: 'Pesanan #ORD-98755 Selesai',
    message:
      'Pembayaran tagihan invoice #ORD-98755 senilai Rp 6.000.000 telah berhasil diverifikasi oleh platform SmartTani.',
    type: 'payment',
    time: '2026-05-18T16:00:00Z',
    is_read: true,
  },
];

export default function DistributorNotificationsPage() {
  const [notifications, setNotifications] =
    React.useState<typeof MOCK_NOTIFICATIONS>(MOCK_NOTIFICATIONS);

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    toast.success('Semua notifikasi ditandai sebagai dibaca!');
  };

  const handleMarkOneAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    toast.success('Notifikasi ditandai dibaca.');
  };

  const handleDeleteOne = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success('Notifikasi berhasil dihapus.');
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Kotak Masuk Notifikasi
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Pantau arus pembaruan pengiriman bulk logistik, status verifikasi lunas, dan alert
            krisis stok gudang.
          </p>
        </div>
        {notifications.length > 0 && (
          <div className="flex gap-2">
            <Button
              onClick={handleMarkAllAsRead}
              className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs h-10 px-4 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm"
              disabled={unreadCount === 0}
            >
              <MailOpen className="h-4 w-4" /> Tandai Semua Dibaca
            </Button>
          </div>
        )}
      </div>

      {/* Notifications list */}
      <Card className="border-slate-200 shadow-sm bg-white overflow-hidden max-w-3xl">
        <CardContent className="p-0 divide-y divide-slate-100">
          {notifications.length === 0 ? (
            <div className="py-20 text-center">
              <Bell className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-xs font-bold text-slate-800">Kotak masuk kosong</h3>
              <p className="mt-1 text-[11px] text-slate-500 font-semibold">
                Semua pemberitahuan B2B Anda sudah bersih.
              </p>
            </div>
          ) : (
            notifications.map((notif) => {
              const icons: Record<string, React.ReactNode> = {
                order: <ShoppingCart className="h-4.5 w-4.5 text-indigo-600" />,
                stock: <AlertTriangle className="h-4.5 w-4.5 text-rose-500" />,
                payment: <ShieldCheck className="h-4.5 w-4.5 text-green-600" />,
              };

              const bgStyles: Record<string, string> = {
                order: 'bg-indigo-50/50 border-indigo-100/50',
                stock: 'bg-rose-50/30 border-rose-100/30',
                payment: 'bg-green-50/40 border-green-100/40',
              };

              return (
                <div
                  key={notif.id}
                  className={`p-4 flex items-start gap-4 transition-all hover:bg-slate-50/40 ${
                    !notif.is_read ? 'bg-green-50/10' : ''
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${bgStyles[notif.type] || 'bg-slate-50 border-slate-100 text-slate-600'}`}
                  >
                    {icons[notif.type] || <Bell className="h-4.5 w-4.5" />}
                  </div>

                  {/* Body details */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-4">
                      <h4
                        className={`text-xs font-bold ${!notif.is_read ? 'text-slate-800' : 'text-slate-500'}`}
                      >
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-semibold shrink-0">
                        {new Date(notif.time).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        -{' '}
                        {new Date(notif.time).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                      {notif.message}
                    </p>

                    {/* Quick inline buttons */}
                    <div className="flex gap-3 pt-2">
                      {!notif.is_read && (
                        <button
                          onClick={() => handleMarkOneAsRead(notif.id)}
                          className="text-[10.5px] font-bold text-green-600 hover:text-green-700 flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Tandai Dibaca
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteOne(notif.id)}
                        className="text-[10.5px] font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
