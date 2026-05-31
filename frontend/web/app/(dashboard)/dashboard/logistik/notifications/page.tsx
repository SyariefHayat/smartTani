'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService, NotificationItem } from '@/services/notification';
import { toast } from 'sonner';
import { formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Bell,
  BellRing,
  ShoppingBag,
  Tag,
  Info,
  Search,
  CheckCheck,
  Check,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

type NotificationType = 'all' | 'order' | 'promo' | 'system';

export default function LogisticsNotificationsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = React.useState<NotificationType>('all');
  const [searchQuery, setSearchQuery] = React.useState('');

  // 1. Fetch Notifications
  const {
    data: notifications,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['logistics-notifications'],
    queryFn: async () => notificationService.getNotifications(),
  });

  const isQueryError = isError;

  // Client-side state to allow instantaneous read marking
  const [localNotifications, setLocalNotifications] = React.useState<NotificationItem[]>([]);

  const activeNotifications = React.useMemo(() => {
    return (notifications || []) as NotificationItem[];
  }, [notifications]);

  const [prevNotifications, setPrevNotifications] = React.useState<NotificationItem[]>([]);

  if (activeNotifications !== prevNotifications) {
    setPrevNotifications(activeNotifications);
    setLocalNotifications(activeNotifications);
  }

  // 2. Mark Single as Read
  const readMutation = useMutation({
    mutationFn: async (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logistics-notifications'] });
    },
    onError: () => {
      toast.error('Gagal memperbarui status notifikasi.');
    },
  });

  // 3. Mark All as Read
  const readAllMutation = useMutation({
    mutationFn: async () => notificationService.markAllAsRead(),
    onSuccess: () => {
      toast.success('Semua notifikasi telah ditandai sebagai dibaca');
      queryClient.invalidateQueries({ queryKey: ['logistics-notifications'] });
    },
    onError: () => {
      toast.error('Gagal memperbarui status semua notifikasi.');
    },
  });

  const handleMarkAsRead = (id: string) => {
    // Instantaneous local UI update for snappy feedback
    setLocalNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    readMutation.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    // Instantaneous local UI update for snappy feedback
    setLocalNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    readAllMutation.mutate();
  };

  // Filter & Search
  const filteredNotifications = React.useMemo(() => {
    return localNotifications.filter((item) => {
      const matchesTab = activeTab === 'all' ? true : item.type === activeTab;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.message.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [localNotifications, activeTab, searchQuery]);

  // Grouping by Date
  const groupedNotifications = React.useMemo(() => {
    const todayGroup: NotificationItem[] = [];
    const yesterdayGroup: NotificationItem[] = [];
    const olderGroup: NotificationItem[] = [];

    filteredNotifications.forEach((item) => {
      const date = new Date(item.created_at);
      if (isToday(date)) {
        todayGroup.push(item);
      } else if (isYesterday(date)) {
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

  const unreadCount = localNotifications.filter((n) => !n.is_read).length;

  const renderIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'order':
        return (
          <div className="h-9 w-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0 shadow-xs">
            <ShoppingBag className="h-4.5 w-4.5" />
          </div>
        );
      case 'promo':
        return (
          <div className="h-9 w-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0 shadow-xs">
            <Tag className="h-4.5 w-4.5" />
          </div>
        );
      case 'system':
      default:
        return (
          <div className="h-9 w-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0 shadow-xs">
            <Info className="h-4.5 w-4.5" />
          </div>
        );
    }
  };

  if (isLoading && !isQueryError) {
    return (
      <div className="w-full space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="p-6 space-y-4">
          <Skeleton className="h-16 w-full rounded-lg animate-pulse" />
          <Skeleton className="h-16 w-full rounded-lg animate-pulse" />
          <Skeleton className="h-16 w-full rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 shrink-0 shadow-sm border border-slate-200">
            {unreadCount > 0 ? (
              <BellRing className="h-6 w-6 text-slate-850" />
            ) : (
              <Bell className="h-6 w-6 text-slate-400" />
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight lg:text-2xl text-slate-800 flex items-center gap-2">
              Kotak Masuk Notifikasi
              {unreadCount > 0 && (
                <span className="inline-flex h-5 items-center justify-center rounded-full bg-rose-500 px-2 text-[10px] font-bold text-white shadow-sm">
                  {unreadCount} Baru
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Pantau rincian tugas masuk, peringatan jalan, dan pembaruan sistem SmartTani.
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="font-bold text-xs cursor-pointer border-slate-200 hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-xs"
            onClick={handleMarkAllAsRead}
          >
            <CheckCheck className="mr-2 h-4 w-4 text-slate-700" /> Tandai Semua Dibaca
          </Button>
        )}
      </div>

      {/* Query Error State */}
      {isQueryError ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 p-8 text-center text-red-500 font-semibold text-sm">
          <AlertTriangle className="h-8 w-8 text-red-600 mb-2 animate-pulse" />
          <p className="font-bold">Gagal memuat kotak masuk notifikasi</p>
          <p className="text-xs text-red-400 font-normal mt-1 mb-4">
            Koneksi ke server Layanan Notifikasi terputus. Silakan periksa jaringan Anda atau coba
            hubungkan kembali.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="border-red-300 text-red-800 bg-white hover:bg-red-100 font-bold text-xs"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-3 w-3 mr-1" /> Coba Hubungkan Kembali
          </Button>
        </div>
      ) : (
        <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden rounded-xl">
          <CardHeader className="pb-3 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100">
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'Semua' },
                { id: 'order', label: 'Tugas & Transaksi' },
                { id: 'promo', label: 'Tips & Peringatan' },
                { id: 'system', label: 'Sistem' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  data-active={activeTab === tab.id}
                  className="px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-200 bg-white text-slate-600 data-[active=true]:bg-slate-100 data-[active=true]:border-slate-350 data-[active=true]:text-slate-900 hover:bg-slate-50 cursor-pointer transition-colors shadow-2xs"
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
                className="h-9 rounded-md border-slate-200 bg-white pl-9 pr-4 text-xs text-slate-900 focus-visible:ring-slate-500 shadow-2xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-16 text-center text-slate-400 gap-3 bg-white">
                <Bell className="h-10 w-10 text-slate-300" />
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
                            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-slate-500" />
                          )}

                          {renderIcon(item.type)}

                          <div className="flex-1 min-w-0 pr-4">
                            <div className="flex items-start justify-between gap-4">
                              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 leading-snug">
                                {item.title}
                                {!item.is_read && (
                                  <span className="h-2 w-2 rounded-full bg-slate-400 shrink-0" />
                                )}
                              </h3>
                              <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap pt-0.5">
                                {formatDistanceToNow(new Date(item.created_at), {
                                  addSuffix: true,
                                  locale: localeId,
                                })}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                              {item.message}
                            </p>
                          </div>

                          {/* Mark single as read hover action button */}
                          {!item.is_read && (
                            <div className="flex items-center self-center shrink-0">
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Tandai dibaca"
                                className="h-7 w-7 rounded-full bg-white hover:bg-slate-100 hover:text-slate-800 border border-slate-100 shadow-xs cursor-pointer flex items-center justify-center"
                                onClick={() => handleMarkAsRead(item.id)}
                              >
                                <Check className="h-3.5 w-3.5 text-slate-500" />
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
