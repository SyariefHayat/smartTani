'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService, NotificationItem } from '@/services/notification';
import { toast } from 'sonner';
import { formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  Eye,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NT-01',
    user_id: 'B-01',
    type: 'order',
    title: 'Pesanan Dikirim',
    message:
      'Hore! Pesanan #ORD-88192 (Cabai Merah Keriting) Anda telah diserahkan ke kurir dan sedang dalam perjalanan.',
    is_read: false,
    created_at: new Date().toISOString(), // Today
  },
  {
    id: 'NT-02',
    user_id: 'B-01',
    type: 'promo',
    title: 'Promo Gajian Tani 15%',
    message:
      'Gunakan kode promo GAJIANTANI15 untuk mendapatkan diskon belanja pupuk dan bibit hingga Rp 50.000.',
    is_read: false,
    created_at: new Date().toISOString(), // Today
  },
  {
    id: 'NT-03',
    user_id: 'B-01',
    type: 'order',
    title: 'Pembayaran Berhasil',
    message:
      'Pembayaran untuk pesanan #ORD-88151 sebesar Rp 2.100.000 telah terverifikasi. Penjual sedang menyiapkan barang Anda.',
    is_read: true,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
  },
  {
    id: 'NT-04',
    user_id: 'B-01',
    type: 'system',
    title: 'Verifikasi Akun Sukses',
    message:
      'Selamat! Akun pembeli Anda di SmartTani telah terverifikasi secara penuh. Sekarang Anda dapat melakukan transaksi tanpa batas.',
    is_read: true,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // Older
  },
];

type NotificationType = 'all' | 'order' | 'promo' | 'system';

export default function BuyerNotificationsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = React.useState<NotificationType>('all');
  const [searchQuery, setSearchQuery] = React.useState('');

  // 1. Fetch Notifications
  const {
    data: notifications,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['buyer-notifications'],
    queryFn: async () => notificationService.getNotifications(),
  });

  const isQueryError = isError;

  React.useEffect(() => {
    if (isQueryError) {
      toast.error('Layanan sedang offline. Menggunakan data demo lokal.');
    }
  }, [isQueryError]);

  // Client-side state to allow instantaneous read marking for mock UI preview
  const [localNotifications, setLocalNotifications] = React.useState<NotificationItem[]>([]);

  const activeNotifications = isQueryError
    ? MOCK_NOTIFICATIONS
    : notifications || MOCK_NOTIFICATIONS;

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalNotifications(activeNotifications);
  }, [activeNotifications]);

  // 2. Mark Single as Read
  const readMutation = useMutation({
    mutationFn: async (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyer-notifications'] });
    },
  });

  // 3. Mark All as Read
  const readAllMutation = useMutation({
    mutationFn: async () => notificationService.markAllAsRead(),
    onSuccess: () => {
      toast.success('Semua notifikasi telah ditandai sebagai dibaca');
      queryClient.invalidateQueries({ queryKey: ['buyer-notifications'] });
    },
  });

  const handleMarkAsRead = (id: string) => {
    // Instantaneous local UI update for snappy feedback
    setLocalNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));

    if (isQueryError) {
      toast.success('Notifikasi ditandai sebagai dibaca (Simulasi)');
      return;
    }
    readMutation.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    // Instantaneous local UI update for snappy feedback
    setLocalNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));

    if (isQueryError) {
      toast.success('Semua notifikasi ditandai sebagai dibaca (Simulasi)');
      return;
    }
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
          <div className="h-9 w-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-xs">
            <ShoppingBag className="h-4.5 w-4.5" />
          </div>
        );
      case 'promo':
        return (
          <div className="h-9 w-9 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0 shadow-xs">
            <Tag className="h-4.5 w-4.5" />
          </div>
        );
      case 'system':
      default:
        return (
          <div className="h-9 w-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-xs">
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
          <div className="h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 shrink-0 shadow-sm border border-green-100">
            {unreadCount > 0 ? (
              <BellRing className="h-6 w-6 animate-swing" />
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
            <p className="text-sm text-slate-500">
              Pantau info status pesanan, penawaran promo, dan pemberitahuan sistem Anda.
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="font-bold text-xs cursor-pointer border-slate-200 hover:bg-slate-50 hover:text-green-600 transition-colors shadow-xs"
            onClick={handleMarkAllAsRead}
          >
            <CheckCheck className="mr-2 h-4 w-4 text-green-600" /> Tandai Semua Dibaca
          </Button>
        )}
      </div>

      {/* Control Card (Filter + Search) or Error Box */}
      {isQueryError ? (
        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
          Gagal memuat kotak masuk notifikasi / Koneksi ke server terputus
        </div>
      ) : (
        <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden">
          <CardHeader className="pb-3 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100">
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'Semua' },
                { id: 'order', label: 'Transaksi' },
                { id: 'promo', label: 'Promo & Diskon' },
                { id: 'system', label: 'Sistem' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  data-active={activeTab === tab.id}
                  className="px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-200 bg-white text-slate-600 data-[active=true]:bg-green-50 data-[active=true]:border-green-200 data-[active=true]:text-green-700 hover:bg-slate-50 cursor-pointer transition-colors shadow-2xs"
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
                className="h-9 rounded-md border-slate-200 bg-white pl-9 pr-4 text-xs text-slate-900 focus-visible:ring-green-500 shadow-2xs"
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
                          className="group flex gap-4 p-4 rounded-xl border border-slate-150/70 hover:border-slate-300 hover:bg-slate-50/40 hover:shadow-2xs transition-all duration-200 relative data-[unread=true]:bg-indigo-50/15 data-[unread=true]:border-green-200/50"
                        >
                          {/* Unread indicator left vertical line */}
                          {!item.is_read && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-green-500" />
                          )}

                          {renderIcon(item.type)}

                          <div className="flex-1 min-w-0 pr-4">
                            <div className="flex items-start justify-between gap-4">
                              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 leading-snug">
                                {item.title}
                                {!item.is_read && (
                                  <span className="h-2 w-2 rounded-full bg-green-500 shrink-0 animate-pulse" />
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
                                size="icon-xs"
                                title="Tandai dibaca"
                                className="h-7 w-7 rounded-full bg-white hover:bg-green-50 hover:text-green-600 border border-slate-100 shadow-xs cursor-pointer"
                                onClick={() => handleMarkAsRead(item.id)}
                              >
                                <Check className="h-3.5 w-3.5" />
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
