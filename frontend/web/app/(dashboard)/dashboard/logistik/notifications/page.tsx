'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, AlertTriangle, CheckCircle, Trash2, Sprout, Info } from 'lucide-react';

interface CourierNotification {
  id: string;
  title: string;
  message: string;
  type: 'job' | 'system' | 'alert';
  read: boolean;
  timestamp: string;
}

const INITIAL_NOTIFICATIONS: CourierNotification[] = [
  {
    id: 'NOT-L01',
    title: 'Tugas Pengiriman Baru Di-assign',
    message:
      'Anda mendapatkan tugas pengiriman #ORD-98831 asal Paciran tujuan Genteng Surabaya. Silakan ambil paket di greenhouse Budi Santoso.',
    type: 'job',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
  },
  {
    id: 'NOT-L02',
    title: 'Pembaruan Daur Hidup Pengiriman',
    message: 'Paket #ORD-98822 terdeteksi telah diambil oleh kurir logistik dari greenhouse asal.',
    type: 'system',
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: 'NOT-L03',
    title: 'Tips Berkendara Musim Hujan',
    message:
      'Tetap waspada dan hati-hati saat berkendara membawa bibit tanaman sayuran. Pastikan pelindung terpal/kardus terpasang erat.',
    type: 'alert',
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
];

export default function LogisticsNotificationsPage() {
  const [notifications, setNotifications] = React.useState<CourierNotification[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('smarttani_logistics_notifications');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    }
    return INITIAL_NOTIFICATIONS;
  });

  const saveToStorage = (list: CourierNotification[]) => {
    setNotifications(list);
    localStorage.setItem('smarttani_logistics_notifications', JSON.stringify(list));
  };

  const markAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    saveToStorage(updated);
    toast.success('Semua notifikasi ditandai sudah dibaca.');
  };

  const toggleRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: !n.read } : n));
    saveToStorage(updated);
  };

  const deleteNotification = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    saveToStorage(updated);
    toast.success('Notifikasi berhasil dihapus.');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'job':
        return <Sprout className="w-4 h-4 text-green-600 shrink-0" />;
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-600 shrink-0" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Notifikasi Kurir</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Pantau rincian tugas masuk, peringatan jalan, dan pembaruan sistem SmartTani.
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            onClick={markAllRead}
            variant="outline"
            size="sm"
            className="text-xs font-bold border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer shrink-0"
          >
            <CheckCircle className="w-4 h-4 mr-1 text-green-600" /> Tandai Semua Dibaca
          </Button>
        )}
      </div>

      {/* Notifications grid list */}
      {notifications.length === 0 ? (
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardContent className="py-20 text-center text-slate-500">
            <Bell className="w-12 h-12 mx-auto mb-4 text-slate-300 opacity-60 animate-bounce" />
            <p className="text-xs font-bold text-slate-700">Kotak Masuk Bersih! 🎉</p>
            <p className="text-[10px] text-slate-400 font-medium mt-1">
              Anda tidak memiliki notifikasi baru saat ini.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((not) => {
            const dateStr = new Date(not.timestamp).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <Card
                key={not.id}
                className={`border-slate-200 shadow-sm transition-all relative overflow-hidden group ${
                  not.read ? 'bg-white' : 'bg-green-50/15 border-green-200/50'
                }`}
              >
                {!not.read && <div className="absolute left-0 top-0 w-1 h-full bg-green-500" />}
                <CardContent className="p-5 flex gap-4 items-start">
                  <div
                    className={`p-2 rounded-lg shrink-0 border ${
                      not.type === 'job'
                        ? 'bg-green-50 border-green-100'
                        : not.type === 'alert'
                          ? 'bg-amber-50 border-amber-100'
                          : 'bg-blue-50 border-blue-100'
                    }`}
                  >
                    {getIcon(not.type)}
                  </div>

                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                      <h4
                        className={`text-xs font-bold truncate ${
                          not.read ? 'text-slate-800' : 'text-green-800'
                        }`}
                      >
                        {not.title}
                      </h4>
                      <span className="text-[9.5px] text-slate-400 font-bold shrink-0">
                        {dateStr} WIB
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                      {not.message}
                    </p>

                    <div className="flex items-center gap-3 pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRead(not.id)}
                        className="h-6 text-[9.5px] font-bold text-slate-400 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
                      >
                        {not.read ? 'Tandai Belum Dibaca' : 'Tandai Sudah Dibaca'}
                      </Button>
                      <span className="text-slate-200">|</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(not.id)}
                        className="h-6 text-[9.5px] font-bold text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
