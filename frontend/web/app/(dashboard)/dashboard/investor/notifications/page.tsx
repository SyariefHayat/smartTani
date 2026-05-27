'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Sprout, Landmark, ArrowRight, CheckCheck, Trash2 } from 'lucide-react';

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-01',
    title: 'Peluang Investasi Baru Tersedia!',
    message:
      'Proposal "Budidaya Melon Alisha Berkualitas Tinggi" telah disetujui. Raih potensi ROI +16% sekarang!',
    time: '5 menit yang lalu',
    type: 'proposal',
    isRead: false,
  },
  {
    id: 'notif-02',
    title: 'Imbal Hasil Panen Tomat Organik Telah Cair 💰',
    message:
      'Selamat! Investasi Anda di proyek Tomat Organik selesai. Rp 9.280.000 telah masuk dompet Anda.',
    time: '2 jam yang lalu',
    type: 'payout',
    isRead: false,
  },
  {
    id: 'notif-03',
    title: 'Dana Modal Diserahkan ke Petani',
    message:
      'Modal investasi sebesar Rp 15.000.000 untuk Cabai Merah Hidroponik telah ditransfer ke Ahmad Sodikin.',
    time: 'Yesterday',
    type: 'farming',
    isRead: true,
  },
  {
    id: 'notif-04',
    title: 'Modernisasi Lahan Dimulai',
    message: 'Petani Ahmad Sodikin telah selesai merakit greenhouse hidroponik baru di Cianjur.',
    time: '2 hari yang lalu',
    type: 'farming',
    isRead: true,
  },
];

export default function InvestorNotificationsPage() {
  const [notifications, setNotifications] = React.useState(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success('Semua notifikasi ditandai sudah dibaca');
  };

  const handleToggleRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n)));
  };

  const handleDeleteNotif = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success('Notifikasi berhasil dihapus');
  };

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Notifikasi</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Lacak kabar terbaru seputar pencairan modal, info komoditas baru, dan progress panen.
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            onClick={handleMarkAllRead}
            variant="outline"
            size="sm"
            className="h-8 text-xs font-bold border-slate-200 hover:border-green-300 text-slate-700 hover:text-green-700 bg-white cursor-pointer flex items-center gap-1.5"
          >
            <CheckCheck className="h-4 w-4" /> Tandai Semua Dibaca
          </Button>
        )}
      </div>

      {/* Notifications List Container */}
      <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-800">Alert Center & Updates</CardTitle>
          <CardDescription className="text-xs mt-0.5">
            Anda memiliki {unreadCount} pesan belum dibaca.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-slate-100">
          {notifications.length === 0 ? (
            <div className="py-24 text-center text-slate-500">
              <Bell className="w-12 h-12 mx-auto mb-4 text-slate-300 opacity-60" />
              <p className="text-xs font-bold text-slate-700">Kotak Masuk Kosong</p>
              <p className="text-[10px] text-slate-400 font-medium mt-1">
                Semua notifikasi Anda telah dihapus.
              </p>
            </div>
          ) : (
            notifications.map((n) => {
              const isProposal = n.type === 'proposal';
              const isPayout = n.type === 'payout';

              return (
                <div
                  key={n.id}
                  className={`p-5 flex items-start justify-between gap-4 hover:bg-slate-50/50 transition-colors ${
                    !n.isRead ? 'bg-green-50/15' : ''
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Circle Icon */}
                    <div
                      className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 border ${
                        isPayout
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          : isProposal
                            ? 'bg-blue-50 text-blue-600 border-blue-100'
                            : 'bg-slate-50 text-slate-600 border-slate-100'
                      }`}
                    >
                      {isPayout ? (
                        <Landmark className="h-4 w-4" />
                      ) : isProposal ? (
                        <Sprout className="h-4 w-4" />
                      ) : (
                        <Bell className="h-4 w-4" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4
                          className={`text-xs font-bold ${!n.isRead ? 'text-slate-800' : 'text-slate-600'}`}
                        >
                          {n.title}
                        </h4>
                        {!n.isRead && (
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                        )}
                      </div>
                      <p className="text-xs font-medium text-slate-500 leading-relaxed max-w-xl">
                        {n.message}
                      </p>
                      <span className="text-[9px] text-slate-400 font-bold block pt-0.5">
                        {n.time}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-slate-400 hover:text-slate-800 cursor-pointer"
                      onClick={() => handleToggleRead(n.id)}
                      title={n.isRead ? 'Tandai Belum Dibaca' : 'Tandai Sudah Dibaca'}
                    >
                      <CheckCheck className={`h-4 w-4 ${n.isRead ? 'text-green-600' : ''}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-slate-400 hover:text-rose-600 cursor-pointer"
                      onClick={() => handleDeleteNotif(n.id)}
                      title="Hapus Notifikasi"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
