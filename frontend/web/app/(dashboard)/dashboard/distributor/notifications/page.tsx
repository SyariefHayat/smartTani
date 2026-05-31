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
  ShoppingCart,
  AlertTriangle,
  ShieldCheck,
  Search,
  CheckCheck,
  Check,
  Trash2,
} from 'lucide-react';

// B2B specific custom notification type extension to support distributor context
interface DistributorNotificationItem extends Omit<NotificationItem, 'type'> {
  type: 'order' | 'stock' | 'payment' | 'promo' | 'system';
}

const MOCK_NOTIFICATIONS: DistributorNotificationItem[] = [
  {
    id: 'notif-1',
    user_id: 'D-01',
    title: 'Pesanan #ORD-98822 Sedang Dikirim',
    message:
      'Kurir logistik MitraTani telah melakukan pickup barang. Paket sedang dalam perjalanan menuju Gudang Utama Anda.',
    type: 'order',
    created_at: new Date().toISOString(), // Today
    is_read: false,
  },
  {
    id: 'notif-2',
    user_id: 'D-01',
    title: 'Peringatan Stok Kritis Gudang ⚠️',
    message:
      'Persediaan komoditas "Wortel Brastagi Segar" di gudang distributor Anda tersisa kurang dari 20% (10 kg). Harap lakukan re-order pengadaan.',
    type: 'stock',
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // Today (4 hours ago)
    is_read: false,
  },
  {
    id: 'notif-3',
    user_id: 'D-01',
    title: 'Pesanan #ORD-98755 Selesai 💰',
    message:
      'Pembayaran tagihan invoice #ORD-98755 senilai Rp 6.000.000 telah berhasil diverifikasi oleh platform SmartTani.',
    type: 'payment',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    is_read: true,
  },
  {
    id: 'notif-4',
    user_id: 'D-01',
    title: 'Kemitraan Petani Baru Diterima',
    message:
      'Kelompok Tani Harapan Jaya di Sukabumi telah menyetujui kontrak supply B2B untuk komoditas Kentang Dieng.',
    type: 'order',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // Older
    is_read: true,
  },
];

type NotificationType = 'all' | 'order' | 'stock' | 'payment';

export default function DistributorNotificationsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = React.useState<NotificationType>('all');
  const [searchQuery, setSearchQuery] = React.useState('');

  // 1. Fetch Notifications
  const {
    data: notifications,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['distributor-notifications'],
    queryFn: async () => notificationService.getNotifications(),
  });

  const isQueryError = isError;

  React.useEffect(() => {
    if (isQueryError) {
      toast.error('Layanan sedang offline. Menggunakan data demo lokal.');
    }
  }, [isQueryError]);

  // Client-side state to allow instantaneous read/delete updates for snappy feedback
  const [localNotifications, setLocalNotifications] = React.useState<DistributorNotificationItem[]>(
    []
  );

  const activeNotifications = React.useMemo(() => {
    // If backend is offline, we gracefully fallback to the B2B high fidelity mock data
    if (isQueryError) {
      return MOCK_NOTIFICATIONS;
    }
    return (notifications || MOCK_NOTIFICATIONS) as DistributorNotificationItem[];
  }, [notifications, isQueryError]);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalNotifications(activeNotifications);
  }, [activeNotifications]);

  // 2. Mark Single as Read
  const readMutation = useMutation({
    mutationFn: async (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['distributor-notifications'] });
    },
  });

  // 3. Mark All as Read
  const readAllMutation = useMutation({
    mutationFn: async () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['distributor-notifications'] });
    },
  });

  const handleMarkAsRead = (id: string) => {
    setLocalNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    toast.success('Notifikasi ditandai sebagai dibaca');

    if (!isQueryError) {
      readMutation.mutate(id);
    }
  };

  const handleMarkAllAsRead = () => {
    setLocalNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    toast.success('Semua notifikasi ditandai sebagai dibaca');

    if (!isQueryError) {
      readAllMutation.mutate();
    }
  };

  const handleDeleteOne = (id: string) => {
    setLocalNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success('Notifikasi berhasil dihapus');
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
    const todayGroup: DistributorNotificationItem[] = [];
    const yesterdayGroup: DistributorNotificationItem[] = [];
    const olderGroup: DistributorNotificationItem[] = [];

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

  const renderIcon = (type: DistributorNotificationItem['type']) => {
    switch (type) {
      case 'order':
        return (
          <div className="h-9 w-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 shadow-xs">
            <ShoppingCart className="h-4.5 w-4.5" />
          </div>
        );
      case 'stock':
        return (
          <div className="h-9 w-9 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0 shadow-xs">
            <AlertTriangle className="h-4.5 w-4.5" />
          </div>
        );
      case 'payment':
        return (
          <div className="h-9 w-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-xs">
            <ShieldCheck className="h-4.5 w-4.5" />
          </div>
        );
      default:
        return (
          <div className="h-9 w-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-xs">
            <Bell className="h-4.5 w-4.5" />
          </div>
        );
    }
  };

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 shadow-sm border border-emerald-100">
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
              Pantau arus pembaruan pengiriman bulk logistik, status verifikasi lunas, dan alert
              krisis stok gudang B2B.
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="font-bold text-xs cursor-pointer border-slate-200 hover:bg-slate-50 hover:text-emerald-600 transition-colors shadow-xs"
            onClick={handleMarkAllAsRead}
          >
            <CheckCheck className="mr-2 h-4 w-4 text-emerald-600" /> Tandai Semua Dibaca
          </Button>
        )}
      </div>

      {/* Control Card (Filter + Search) or Error Box */}
      {isQueryError ? (
        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
          Gagal memuat kotak masuk notifikasi / Koneksi ke server terputus
        </div>
      ) : (
        <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden rounded-xl">
          <CardHeader className="pb-3 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 p-6">
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'Semua' },
                { id: 'order', label: 'Pesanan B2B' },
                { id: 'stock', label: 'Stok & Gudang' },
                { id: 'payment', label: 'Keuangan' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  data-active={activeTab === tab.id}
                  className="px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-200 bg-white text-slate-600 data-[active=true]:bg-emerald-50 data-[active=true]:border-emerald-200 data-[active=true]:text-emerald-700 hover:bg-slate-50 cursor-pointer transition-colors shadow-2xs"
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
                className="h-9 rounded-md border-slate-200 bg-white pl-9 pr-4 text-xs text-slate-900 focus-visible:ring-emerald-500 shadow-2xs"
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
                          className="group flex gap-4 p-4 rounded-xl border border-slate-150/70 hover:border-slate-300 hover:bg-slate-50/40 hover:shadow-2xs transition-all duration-200 relative data-[unread=true]:bg-indigo-50/15 data-[unread=true]:border-emerald-250/50"
                        >
                          {/* Unread indicator left vertical line */}
                          {!item.is_read && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-emerald-500" />
                          )}

                          {renderIcon(item.type)}

                          <div className="flex-1 min-w-0 pr-4">
                            <div className="flex items-start justify-between gap-4">
                              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 leading-snug">
                                {item.title}
                                {!item.is_read && (
                                  <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
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

                          {/* Quick inline buttons (Mark as read / delete) */}
                          <div className="flex items-center self-center shrink-0 gap-1.5">
                            {!item.is_read && (
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Tandai dibaca"
                                className="h-7 w-7 rounded-full bg-white hover:bg-emerald-50 hover:text-emerald-600 border border-slate-100 shadow-xs cursor-pointer flex items-center justify-center"
                                onClick={() => handleMarkAsRead(item.id)}
                              >
                                <Check className="h-3.5 w-3.5" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Hapus"
                              className="h-7 w-7 rounded-full bg-white hover:bg-rose-50 hover:text-rose-600 border border-slate-100 shadow-xs cursor-pointer flex items-center justify-center"
                              onClick={() => handleDeleteOne(item.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
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
      )}
    </div>
  );
}
