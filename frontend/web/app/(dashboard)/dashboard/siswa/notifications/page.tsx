'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStoredAuthUser } from '@/lib/auth-storage';
import { notificationService, NotificationItem } from '@/services/notification';
import { formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  Bell,
  BellRing,
  Check,
  Trash2,
  Award,
  Video,
  BookOpen,
  Info,
  Clock,
  CheckCheck,
  Search,
} from 'lucide-react';

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
    created_at: new Date().toISOString(), // Today
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
    created_at: new Date().toISOString(), // Today
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
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
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
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // Older
  },
];

type NotificationType = 'all' | 'learning' | 'webinar' | 'certificate' | 'system';

export default function StudentNotificationsPage() {
  const user = getStoredAuthUser();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = React.useState<NotificationType>('all');
  const [searchQuery, setSearchQuery] = React.useState('');

  const [deletedIds, setDeletedIds] = React.useState<string[]>([]);

  const {
    data: notifications,
    isLoading,
    isError,
    refetch,
  } = useQuery<Notification[]>({
    queryKey: ['student-notifications', user?.id],
    queryFn: async () => {
      const res = await notificationService.getNotifications();
      return res.map((n: NotificationItem) => ({
        id: n.id,
        title: n.title,
        content: n.message,
        type: n.type === 'order' ? 'learning' : n.type === 'promo' ? 'webinar' : 'system',
        is_read: n.is_read,
        created_at: n.created_at,
      }));
    },
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await notificationService.markAsRead(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-notifications', user?.id] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      await notificationService.markAllAsRead();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-notifications', user?.id] });
      toast.success('Semua notifikasi ditandai telah dibaca.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      setDeletedIds((prev) => [...prev, id]);
    },
    onSuccess: () => {
      toast.success('Notifikasi berhasil dihapus.');
    },
  });

  const filteredNotifications = React.useMemo(() => {
    if (!notifications) return [];
    return notifications
      .filter((n) => !deletedIds.includes(n.id))
      .filter((item) => {
        const matchesTab = activeTab === 'all' ? true : item.type === activeTab;
        const matchesSearch =
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.content.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
      });
  }, [notifications, activeTab, searchQuery, deletedIds]);

  const groupedNotifications = React.useMemo(() => {
    const todayGroup: Notification[] = [];
    const yesterdayGroup: Notification[] = [];
    const olderGroup: Notification[] = [];

    filteredNotifications.forEach((item) => {
      const date = new Date(item.created_at);
      const validDate = isNaN(date.getTime()) ? new Date() : date;
      if (isToday(validDate)) {
        todayGroup.push(item);
      } else if (isYesterday(validDate)) {
        yesterdayGroup.push(item);
      } else {
        olderGroup.push(item);
      }
    });

    return [
      { title: 'Hari Ini', items: todayGroup },
      { title: 'Kemarin', items: yesterdayGroup },
      { title: 'Lebih Lama', items: olderGroup },
    ].filter((group) => group.items.length > 0);
  }, [filteredNotifications]);

  const unreadCount = React.useMemo(() => {
    if (!notifications) return 0;
    return notifications.filter((n) => !n.is_read).length;
  }, [notifications]);

  const getNotifIcon = (type: Notification['type']) => {
    switch (type) {
      case 'certificate':
        return (
          <div className="h-9 w-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 shadow-xs">
            <Award className="h-4.5 w-4.5" />
          </div>
        );
      case 'webinar':
        return (
          <div className="h-9 w-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 shadow-xs">
            <Video className="h-4.5 w-4.5" />
          </div>
        );
      case 'learning':
        return (
          <div className="h-9 w-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 shadow-xs">
            <BookOpen className="h-4.5 w-4.5" />
          </div>
        );
      case 'system':
      default:
        return (
          <div className="h-9 w-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 shadow-xs">
            <Info className="h-4.5 w-4.5" />
          </div>
        );
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 shadow-sm border border-slate-200">
            {unreadCount > 0 ? (
              <BellRing className="h-6 w-6 animate-swing text-slate-800" />
            ) : (
              <Bell className="h-6 w-6 text-slate-400" />
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight lg:text-2xl text-slate-800 flex items-center gap-2">
              Kotak Masuk Notifikasi
              {unreadCount > 0 && (
                <span className="inline-flex h-5 items-center justify-center rounded-full bg-slate-800 px-2 text-[10px] font-bold text-white shadow-sm">
                  {unreadCount} Baru
                </span>
              )}
            </h1>
            <p className="text-sm text-slate-500">
              Pantau info kelas, jadwal webinar, pengumuman sertifikasi, dan pembaruan sistem Anda.
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="font-bold text-xs cursor-pointer border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-xs rounded-xl"
            onClick={() => markAllReadMutation.mutate()}
          >
            <CheckCheck className="mr-2 h-4 w-4 text-slate-700" /> Tandai Semua Dibaca
          </Button>
        )}
      </div>

      {/* Control Card (Filter + Search) */}
      <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden rounded-2xl">
        <CardHeader className="pb-3 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100">
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'Semua' },
              { id: 'learning', label: 'Akademik' },
              { id: 'webinar', label: 'Webinar' },
              { id: 'certificate', label: 'Sertifikat' },
              { id: 'system', label: 'Sistem' },
            ].map((tab) => (
              <button
                key={tab.id}
                data-active={activeTab === tab.id}
                className="px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-200 bg-white text-slate-600 data-[active=true]:bg-slate-100 data-[active=true]:border-slate-300 data-[active=true]:text-slate-800 hover:bg-slate-50 cursor-pointer transition-colors shadow-2xs"
                onClick={() => setActiveTab(tab.id as NotificationType)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Input
              placeholder="Cari kata kunci notifikasi..."
              className="h-9 rounded-md border-slate-200 bg-white pl-9 pr-4 text-xs text-slate-900 focus-visible:ring-slate-800 shadow-2xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-16 w-full rounded-lg animate-pulse" />
              <Skeleton className="h-16 w-full rounded-lg animate-pulse" />
              <Skeleton className="h-16 w-full rounded-lg animate-pulse" />
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 text-center text-slate-400 gap-3 bg-white">
              <Bell className="h-10 w-10 text-slate-300 animate-pulse" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-700">Tidak Ada Notifikasi</p>
                <p className="text-xs text-slate-400">
                  Tidak ada pemberitahuan yang cocok dengan filter atau pencarian Anda.
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 bg-white">
              {groupedNotifications.map((group) => (
                <div key={group.title} className="p-6 pb-2 last:pb-6 space-y-3">
                  <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                    {group.title}
                  </h2>
                  <div className="space-y-2.5">
                    {group.items.map((item) => (
                      <div
                        key={item.id}
                        data-unread={!item.is_read}
                        className="group flex gap-4 p-4 rounded-xl border border-slate-150/70 hover:border-slate-300 hover:bg-slate-50/40 hover:shadow-2xs transition-all duration-200 relative data-[unread=true]:bg-slate-50/20 data-[unread=true]:border-slate-300"
                      >
                        {/* Unread indicator left vertical line */}
                        {!item.is_read && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-slate-800" />
                        )}

                        {getNotifIcon(item.type)}

                        <div className="flex-1 min-w-0 pr-4 space-y-1.5">
                          <div className="flex items-start justify-between gap-4">
                            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 leading-snug">
                              {item.title}
                              {!item.is_read && (
                                <span className="h-2 w-2 rounded-full bg-slate-800 shrink-0 animate-pulse" />
                              )}
                            </h3>
                            <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap pt-0.5 flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {(() => {
                                try {
                                  const d = new Date(item.created_at);
                                  if (isNaN(d.getTime())) return 'baru saja';
                                  return formatDistanceToNow(d, {
                                    addSuffix: true,
                                    locale: localeId,
                                  });
                                } catch {
                                  return 'baru saja';
                                }
                              })()}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed">
                            {item.content}
                          </p>

                          {/* Actions: Action Button (Link) + Mark read + Delete */}
                          <div className="flex items-center gap-2 pt-1">
                            {item.action_url && item.action_label && (
                              <Link href={item.action_url} passHref legacyBehavior>
                                <Button
                                  onClick={() => {
                                    if (!item.is_read) {
                                      markReadMutation.mutate(item.id);
                                    }
                                  }}
                                  size="sm"
                                  className="bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-bold px-3 py-1 h-7 rounded-lg shadow-sm cursor-pointer"
                                >
                                  {item.action_label}
                                </Button>
                              </Link>
                            )}

                            {!item.is_read && (
                              <Button
                                variant="ghost"
                                onClick={() => markReadMutation.mutate(item.id)}
                                size="sm"
                                className="text-[10px] font-semibold text-slate-400 hover:text-slate-800 hover:bg-slate-100 px-2.5 h-7 rounded-lg cursor-pointer"
                              >
                                <Check className="h-3.5 w-3.5 mr-1" />
                                Tandai dibaca
                              </Button>
                            )}

                            <Button
                              variant="ghost"
                              onClick={() => deleteMutation.mutate(item.id)}
                              size="sm"
                              className="text-[10px] font-semibold text-slate-400 hover:text-red-600 hover:bg-red-50 px-2.5 h-7 rounded-lg ml-auto cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
