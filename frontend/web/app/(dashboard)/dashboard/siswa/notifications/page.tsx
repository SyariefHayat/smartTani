'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStoredAuthUser } from '@/lib/auth-storage';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Bell, Check, Trash2, Award, Video, BookOpen, Info, Clock, CheckCheck } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  content: string;
  type: 'system' | 'learning' | 'webinar' | 'certificate';
  is_read: boolean;
  created_at: string;
  action_url?: string;
  action_label?: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    title: 'Sertifikat Kelulusan Diterbitkan! 🏆',
    content:
      'Selamat! Anda telah menyelesaikan kelas "Pencegahan Hama Organik Terpadu" dengan progres 100%. Sertifikat digital Anda siap diunduh.',
    type: 'certificate',
    is_read: false,
    created_at: '2 jam yang lalu',
    action_url: '/dashboard/siswa/certificates',
    action_label: 'Lihat Sertifikat',
  },
  {
    id: 'notif-2',
    title: 'Pengingat Webinar Terdaftar 🎤',
    content:
      'Webinar "Peluang Ekspor Hortikultura Premium ke Jepang" akan dimulai besok jam 09:00 WIB. Jangan lupa siapkan catatan!',
    type: 'webinar',
    is_read: false,
    created_at: '1 hari yang lalu',
    action_url: '/dashboard/siswa/webinars',
    action_label: 'Detail Webinar',
  },
  {
    id: 'notif-3',
    title: 'Rekomendasi Modul Baru Dirilis 📚',
    content:
      'Instruktur Dr. Ir. Heri Susanto menambahkan kuis interaktif baru di kelas "Budidaya Hidroponik Modern untuk Pemula".',
    type: 'learning',
    is_read: true,
    created_at: '2 hari yang lalu',
    action_url: '/dashboard/siswa/courses/course-001/learn',
    action_label: 'Mulai Kuis',
  },
  {
    id: 'notif-4',
    title: 'Pembaruan Sistem SiTani Academy ⚙️',
    content:
      'SmartTani Academy melakukan peningkatan performa pemutar video pembelajaran untuk mempercepat streaming di jaringan pedesaan.',
    type: 'system',
    is_read: true,
    created_at: '5 hari yang lalu',
  },
];

export default function StudentNotificationsPage() {
  const user = getStoredAuthUser();
  const queryClient = useQueryClient();
  const [filter, setFilter] = React.useState<'all' | 'unread'>('all');

  const { data: notifications, isLoading } = useQuery<Notification[]>({
    queryKey: ['student-notifications', user?.id],
    queryFn: async () => {
      const key = `notifications-${user?.id}`;
      const saved = localStorage.getItem(key);
      if (!saved) {
        localStorage.setItem(key, JSON.stringify(MOCK_NOTIFICATIONS));
        return MOCK_NOTIFICATIONS;
      }
      return JSON.parse(saved);
    },
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const key = `notifications-${user?.id}`;
      const current = notifications || [];
      const updated = current.map((n) => (n.id === id ? { ...n, is_read: true } : n));
      localStorage.setItem(key, JSON.stringify(updated));
      return updated;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['student-notifications', user?.id], data);
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      const key = `notifications-${user?.id}`;
      const current = notifications || [];
      const updated = current.map((n) => ({ ...n, is_read: true }));
      localStorage.setItem(key, JSON.stringify(updated));
      return updated;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['student-notifications', user?.id], data);
      toast.success('Semua notifikasi ditandai telah dibaca.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const key = `notifications-${user?.id}`;
      const current = notifications || [];
      const updated = current.filter((n) => n.id !== id);
      localStorage.setItem(key, JSON.stringify(updated));
      return updated;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['student-notifications', user?.id], data);
      toast.success('Notifikasi berhasil dihapus.');
    },
  });

  const filteredNotifs = React.useMemo(() => {
    if (!notifications) return [];
    if (filter === 'unread') {
      return notifications.filter((n) => !n.is_read);
    }
    return notifications;
  }, [notifications, filter]);

  const unreadCount = React.useMemo(() => {
    if (!notifications) return 0;
    return notifications.filter((n) => !n.is_read).length;
  }, [notifications]);

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'certificate':
        return (
          <div className="h-9 w-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Award className="h-4.5 w-4.5" />
          </div>
        );
      case 'webinar':
        return (
          <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Video className="h-4.5 w-4.5" />
          </div>
        );
      case 'learning':
        return (
          <div className="h-9 w-9 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-green-600">
            <BookOpen className="h-4.5 w-4.5" />
          </div>
        );
      default:
        return (
          <div className="h-9 w-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500">
            <Info className="h-4.5 w-4.5" />
          </div>
        );
    }
  };

  return (
    <div className="w-full space-y-6 text-slate-900 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Pusat Notifikasi 🔔</h1>
        <p className="text-xs font-semibold text-slate-500">
          Kelola pemberitahuan, jadwal webinar, kuis baru, dan pengumuman sertifikasi Anda.
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

        {unreadCount > 0 && (
          <Button
            variant="ghost"
            onClick={() => markAllReadMutation.mutate()}
            size="sm"
            className="text-xs font-semibold text-slate-500 hover:text-green-700 hover:bg-green-50 rounded-xl ml-auto sm:ml-0"
          >
            <CheckCheck className="h-4 w-4 mr-1.5" />
            Tandai semua dibaca
          </Button>
        )}
      </div>

      {/* Notifications list */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 w-full bg-slate-100 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : filteredNotifs.length === 0 ? (
        <Card className="border-dashed border-slate-200 bg-slate-50/50 py-16 flex flex-col items-center justify-center text-center">
          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2.5">
            <Bell className="h-5 w-5" />
          </div>
          <h3 className="text-xs font-bold text-slate-700">Kotak Masuk Kosong</h3>
          <p className="text-[10px] font-semibold text-slate-400 max-w-xs mt-0.5 px-4">
            Anda tidak memiliki pemberitahuan baru saat ini. Semua sistem berjalan normal.
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

                  {/* Actions buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    {notif.action_url && notif.action_label && (
                      <Link href={notif.action_url} passHref legacyBehavior>
                        <Button
                          onClick={() => {
                            if (!notif.is_read) {
                              markReadMutation.mutate(notif.id);
                            }
                          }}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold px-3 py-1 h-7 rounded-lg shadow-sm"
                        >
                          {notif.action_label}
                        </Button>
                      </Link>
                    )}

                    {!notif.is_read && (
                      <Button
                        variant="ghost"
                        onClick={() => markReadMutation.mutate(notif.id)}
                        size="sm"
                        className="text-[10px] font-semibold text-slate-400 hover:text-green-700 hover:bg-green-50 px-2.5 h-7 rounded-lg"
                      >
                        <Check className="h-3.5 w-3.5 mr-1" />
                        Tandai dibaca
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      onClick={() => deleteMutation.mutate(notif.id)}
                      size="sm"
                      className="text-[10px] font-semibold text-slate-400 hover:text-red-600 hover:bg-red-50 px-2.5 h-7 rounded-lg ml-auto"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
