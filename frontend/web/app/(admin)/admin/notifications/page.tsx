'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  AlertTriangle,
  UserCheck,
  CreditCard,
  Cpu,
  ArrowRight,
  ShieldAlert,
  Inbox,
} from 'lucide-react';
import Link from 'next/link';

interface AdminNotificationItem {
  id: string;
  category: 'verification' | 'transaction' | 'security' | 'system';
  title: string;
  message: string;
  is_read: boolean;
  link: string;
  created_at: string;
}

const MOCK_NOTIFICATIONS: AdminNotificationItem[] = [
  {
    id: 'notif-1',
    category: 'verification',
    title: 'Peninjauan KTP Baru 👥',
    message:
      'Petani baru bernama "Siti Aminah" mengunggah berkas KTP. Segera lakukan verifikasi berkas.',
    is_read: false,
    link: '/admin/users?status=pending_verification',
    created_at: '2026-05-28T18:00:00Z',
  },
  {
    id: 'notif-2',
    category: 'transaction',
    title: 'Proposal Pendanaan Diajukan 🌾',
    message: 'Petani "Bambang Sugiharto" mengajukan proposal pendanaan baru senilai Rp 45.000.000.',
    is_read: false,
    link: '/admin/proposals',
    created_at: '2026-05-28T15:30:00Z',
  },
  {
    id: 'notif-3',
    category: 'security',
    title: 'Ulasan Produk Dilaporkan ⚠️',
    message:
      'Pembeli melaporkan ulasan "Pupuk Organik Super Humus 5kg" karena mengandung kata kasar.',
    is_read: false,
    link: '/admin/reviews',
    created_at: '2026-05-27T11:00:00Z',
  },
  {
    id: 'notif-4',
    category: 'system',
    title: 'Server Gateway Sehat 🚀',
    message: 'Seluruh service microservices dan api gateway beroperasi normal (uptime 99.98%).',
    is_read: true,
    link: '/admin',
    created_at: '2026-05-26T08:00:00Z',
  },
];

export default function AdminNotificationsPage() {
  const queryClient = useQueryClient();
  const [activeCategory, setActiveCategory] = React.useState<string>('all');

  // Initialize localStorage if empty
  React.useEffect(() => {
    if (!localStorage.getItem('admin-notifications')) {
      localStorage.setItem('admin-notifications', JSON.stringify(MOCK_NOTIFICATIONS));
    }
  }, []);

  // Fetch Notifications Query
  const { data: notifications = [], isLoading } = useQuery<AdminNotificationItem[]>({
    queryKey: ['admin-notifications-list', activeCategory],
    queryFn: async () => {
      const stored: AdminNotificationItem[] = JSON.parse(
        localStorage.getItem('admin-notifications') || '[]'
      );
      if (activeCategory === 'all') {
        return stored;
      }
      return stored.filter((n) => n.category === activeCategory);
    },
  });

  const unreadCount = React.useMemo(() => {
    const stored: AdminNotificationItem[] = JSON.parse(
      (typeof window !== 'undefined' && localStorage.getItem('admin-notifications')) ||
        JSON.stringify(MOCK_NOTIFICATIONS)
    );
    return stored.filter((n) => !n.is_read).length;
  }, [notifications]);

  // Mark single as read
  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const stored: AdminNotificationItem[] = JSON.parse(
        localStorage.getItem('admin-notifications') || '[]'
      );
      const updated = stored.map((n) => (n.id === id ? { ...n, is_read: true } : n));
      localStorage.setItem('admin-notifications', JSON.stringify(updated));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications-list'] });
    },
  });

  // Mark all as read
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const stored: AdminNotificationItem[] = JSON.parse(
        localStorage.getItem('admin-notifications') || '[]'
      );
      const updated = stored.map((n) => ({ ...n, is_read: true }));
      localStorage.setItem('admin-notifications', JSON.stringify(updated));
    },
    onSuccess: () => {
      toast.success('Seluruh pemberitahuan telah ditandai terbaca.');
      queryClient.invalidateQueries({ queryKey: ['admin-notifications-list'] });
    },
  });

  // Delete notification
  const deleteNotifMutation = useMutation({
    mutationFn: async (id: string) => {
      const stored: AdminNotificationItem[] = JSON.parse(
        localStorage.getItem('admin-notifications') || '[]'
      );
      const updated = stored.filter((n) => n.id !== id);
      localStorage.setItem('admin-notifications', JSON.stringify(updated));
    },
    onSuccess: () => {
      toast.success('Pemberitahuan berhasil dihapus.');
      queryClient.invalidateQueries({ queryKey: ['admin-notifications-list'] });
    },
  });

  const getCategoryDetails = (category: string) => {
    switch (category) {
      case 'verification':
        return { icon: UserCheck, color: 'text-blue-600', bgColor: 'bg-blue-50' };
      case 'transaction':
        return { icon: CreditCard, color: 'text-green-600', bgColor: 'bg-green-50' };
      case 'security':
        return { icon: ShieldAlert, color: 'text-red-600', bgColor: 'bg-red-50' };
      default:
        return { icon: Cpu, color: 'text-slate-600', bgColor: 'bg-slate-50' };
    }
  };

  return (
    <div className="w-full space-y-6 text-slate-900 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
            Pusat Notifikasi <Bell className="h-6 w-6 text-slate-700 fill-slate-100" />
          </h1>
          <p className="text-xs font-semibold text-slate-500">
            Monitor semua aktifitas verifikasi berkas, pengajuan proposal pendanaan, moderasi
            ulasan, dan metrik operasional server gateway.
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            onClick={() => markAllAsReadMutation.mutate()}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold gap-1.5 cursor-pointer shadow-sm"
          >
            <CheckCheck className="h-4 w-4" /> Tandai Semua Terbaca
          </Button>
        )}
      </div>

      {/* Stats row & Filters switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'Semua Kategori' },
            { id: 'verification', label: 'Verifikasi' },
            { id: 'transaction', label: 'Transaksi' },
            { id: 'security', label: 'Keamanan' },
            { id: 'system', label: 'Sistem' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="text-xs font-bold text-slate-500">
          Unread Alerts: <span className="text-red-600 font-extrabold">{unreadCount}</span>
        </div>
      </div>

      {/* Chronological notifications list */}
      <div className="space-y-3">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-20 bg-slate-50 border border-slate-100 rounded-2xl animate-pulse"
            />
          ))
        ) : notifications.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
            <Inbox className="h-10 w-10 text-slate-300 mx-auto" />
            <h4 className="text-slate-800 text-xs font-bold mt-3">Kotak masuk notifikasi kosong</h4>
            <p className="text-slate-400 text-[10px] mt-1">
              Tidak ada pemberitahuan baru di kategori terpilih saat ini.
            </p>
          </div>
        ) : (
          notifications.map((notif) => {
            const { icon: Icon, color, bgColor } = getCategoryDetails(notif.category);
            return (
              <div
                key={notif.id}
                className={`bg-white border transition-all rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs ${
                  notif.is_read
                    ? 'border-slate-100 opacity-65 hover:opacity-100'
                    : 'border-slate-200/90 ring-1 ring-green-600/10 hover:border-slate-300'
                }`}
              >
                <div className="flex gap-3.5 items-start">
                  <div className={`p-3 rounded-xl shrink-0 ${bgColor} ${color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-800">{notif.title}</h4>
                      {!notif.is_read && (
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-red-600 shrink-0"
                          title="Belum dibaca"
                        />
                      )}
                    </div>
                    <p className="text-[11px] font-semibold text-slate-500 mt-1 leading-relaxed max-w-xl">
                      {notif.message}
                    </p>
                    <span className="text-[9px] text-slate-400 font-bold mt-1.5 block">
                      {new Date(notif.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                  {!notif.is_read && (
                    <Button
                      onClick={() => markAsReadMutation.mutate(notif.id)}
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 text-green-600 border-green-200 bg-green-50 hover:bg-green-100 hover:text-green-700 cursor-pointer rounded-xl shrink-0"
                      title="Tandai Terbaca"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  {notif.link && (
                    <Link href={notif.link} passHref>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 cursor-pointer rounded-xl shrink-0"
                        title="Buka Halaman Moderasi"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                  <Button
                    onClick={() => {
                      if (confirm('Hapus notifikasi ini?')) {
                        deleteNotifMutation.mutate(notif.id);
                      }
                    }}
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 text-red-600 border-red-200 bg-red-50 hover:bg-red-100 hover:text-red-700 cursor-pointer rounded-xl shrink-0"
                    title="Hapus Notifikasi"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
