'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStoredAuthUser } from '@/lib/auth-storage';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Bell, Check, Trash2, Users, Star, Globe, Wallet, Clock, CheckCheck } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  content: string;
  type: 'enrollment' | 'review' | 'publish' | 'system';
  is_read: boolean;
  created_at: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    title: 'Murid Baru Mendaftar! 👥',
    content: 'Farhan Setiawan mendaftar di kelas "Budidaya Hidroponik Modern untuk Pemula".',
    type: 'enrollment',
    is_read: false,
    created_at: '2 jam yang lalu',
  },
  {
    id: 'notif-2',
    title: 'Ulasan Murid Diterima ⭐',
    content:
      'Dian Permana memberikan bintang 5 di kelas "Budidaya Hidroponik Modern untuk Pemula" dengan komentar: "Sangat praktis!"',
    type: 'review',
    is_read: false,
    created_at: '1 hari yang lalu',
  },
  {
    id: 'notif-3',
    title: 'Kelas Draf Berhasil Terpublikasi 🌐',
    content:
      'Kelas "Pencegahan Hama Organik Terpadu" telah lolos standardisasi kurikulum dan dipublikasikan.',
    type: 'publish',
    is_read: true,
    created_at: '3 hari yang lalu',
  },
];

export default function InstructorNotificationsPage() {
  const user = getStoredAuthUser();
  const [filter, setFilter] = React.useState<'all' | 'unread'>('all');

  const { data: notifications, isLoading } = useQuery<Notification[]>({
    queryKey: ['instructor-notifications', user?.id],
    queryFn: async () => {
      const key = `inst-notifications-${user?.id}`;
      const saved = localStorage.getItem(key);
      if (!saved) {
        localStorage.setItem(key, JSON.stringify(MOCK_NOTIFICATIONS));
        return MOCK_NOTIFICATIONS;
      }
      return JSON.parse(saved);
    },
  });

  const activeNotifs = notifications || MOCK_NOTIFICATIONS;

  const filteredNotifs = React.useMemo(() => {
    if (filter === 'unread') {
      return activeNotifs.filter((n) => !n.is_read);
    }
    return activeNotifs;
  }, [activeNotifs, filter]);

  const unreadCount = React.useMemo(() => {
    return activeNotifs.filter((n) => !n.is_read).length;
  }, [activeNotifs]);

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'enrollment':
        return (
          <div className="h-9 w-9 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-green-600">
            <Users className="h-4.5 w-4.5" />
          </div>
        );
      case 'review':
        return (
          <div className="h-9 w-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
            <Star className="h-4.5 w-4.5 fill-amber-500 text-amber-500" />
          </div>
        );
      case 'publish':
        return (
          <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Globe className="h-4.5 w-4.5" />
          </div>
        );
      default:
        return (
          <div className="h-9 w-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500">
            <Bell className="h-4.5 w-4.5" />
          </div>
        );
    }
  };

  return (
    <div className="w-full space-y-6 text-slate-900 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Notifikasi Ajar 🔔</h1>
        <p className="text-xs font-semibold text-slate-500">
          Pantau pemberitahuan pendaftaran murid baru, ulasan siswa, and persetujuan kurikulum ajar
          Anda.
        </p>
      </div>

      {/* Control bar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            size="sm"
            className={`text-xs font-bold rounded-xl ${
              filter === 'all'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Semua
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            onClick={() => setFilter('unread')}
            size="sm"
            className={`text-xs font-bold rounded-xl gap-1.5 ${
              filter === 'unread'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Belum Dibaca
            {unreadCount > 0 && (
              <Badge className="bg-amber-500 border-none text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                {unreadCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Notifications list */}
      {filteredNotifs.length === 0 ? (
        <Card className="border-dashed border-slate-200 bg-slate-50/50 py-16 flex flex-col items-center justify-center text-center">
          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2.5">
            <Bell className="h-5 w-5" />
          </div>
          <h3 className="text-xs font-bold text-slate-700">Kotak Masuk Kosong</h3>
          <p className="text-[10px] font-semibold text-slate-400 max-w-xs mt-0.5 px-4">
            Anda tidak memiliki pemberitahuan baru saat ini.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredNotifs.map((notif) => (
            <Card
              key={notif.id}
              className={`border-slate-200 hover:shadow-sm transition-all duration-300 rounded-2xl overflow-hidden ${
                notif.is_read
                  ? 'bg-white opacity-80'
                  : 'bg-green-50/20 border-l-4 border-l-green-600'
              }`}
            >
              <CardContent className="p-5 flex items-start gap-4">
                {/* Visual Icon */}
                {getNotifIcon(notif.type)}

                {/* Content */}
                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-800">{notif.title}</h4>
                      {!notif.is_read && (
                        <span className="h-1.5 w-1.5 rounded-full bg-green-600 shrink-0" />
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
                      <Clock className="h-3 w-3" />
                      {notif.created_at}
                    </span>
                  </div>

                  <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">
                    {notif.content}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
