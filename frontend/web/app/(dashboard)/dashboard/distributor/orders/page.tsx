'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/order';
import { getStoredAuthUser } from '@/lib/auth-storage';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Search,
  ShoppingBag,
  CreditCard,
  CheckSquare,
  FileText,
  AlertTriangle,
} from 'lucide-react';

interface DistributorOrder {
  id: string;
  total_amount: number;
  created_at?: string;
  createdAt?: string;
  status: string;
  seller?: { full_name?: string; name?: string };
  items_count: number;
}

const MOCK_ORDERS: DistributorOrder[] = [
  {
    id: 'ORD-98822',
    total_amount: 14500000,
    created_at: '2026-05-27T08:00:00Z',
    status: 'shipped',
    seller: { full_name: 'Budi Santoso' },
    items_count: 3,
  },
  {
    id: 'ORD-98815',
    total_amount: 8500000,
    created_at: '2026-05-25T14:30:00Z',
    status: 'paid',
    seller: { full_name: 'Siti Aminah' },
    items_count: 2,
  },
  {
    id: 'ORD-98790',
    total_amount: 11200000,
    created_at: '2026-05-20T10:00:00Z',
    status: 'completed',
    seller: { full_name: 'Agus Salim' },
    items_count: 4,
  },
  {
    id: 'ORD-98755',
    total_amount: 6000000,
    created_at: '2026-05-18T16:00:00Z',
    status: 'completed',
    seller: { full_name: 'Budi Santoso' },
    items_count: 1,
  },
  {
    id: 'ORD-98721',
    total_amount: 4800000,
    created_at: '2026-05-15T11:00:00Z',
    status: 'pending_payment',
    seller: { full_name: 'Siti Aminah' },
    items_count: 1,
  },
  {
    id: 'ORD-98710',
    total_amount: 9300000,
    created_at: '2026-05-12T09:00:00Z',
    status: 'cancelled',
    seller: { full_name: 'Agus Salim' },
    items_count: 2,
  },
];

export default function DistributorOrdersPage() {
  const user = getStoredAuthUser();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [isOffline, setIsOffline] = React.useState(false);

  // Fetch orders
  const { data: orders, isLoading } = useQuery({
    queryKey: ['distributor-orders', user?.id],
    queryFn: async () => {
      try {
        const res = await orderService.getOrders();
        if (!res || !res.data || !res.data.orders || res.data.orders.length === 0)
          throw new Error('Empty');
        return res.data.orders;
      } catch {
        setIsOffline(true);
        return MOCK_ORDERS;
      }
    },
  });

  // Payment mutation
  const payMutation = useMutation({
    mutationFn: async (orderId: string) => {
      try {
        await orderService.initiatePayment(orderId);
        toast.success('Menginisiasi gateway pembayaran...', {
          description: 'Mengarahkan ke Midtrans sandbox.',
        });
      } catch {
        // Local simulation fallback: update query client cache directly
        queryClient.setQueryData(['distributor-orders', user?.id], (old: unknown) => {
          const currentList =
            (old as DistributorOrder[]) || (MOCK_ORDERS as unknown as DistributorOrder[]);
          return currentList.map((o) =>
            o.id === orderId ? { ...o, status: 'paid' } : o
          ) as DistributorOrder[];
        });
        toast.success('[Simulasi] Pembayaran grosir sukses!', {
          description: 'Status pesanan diperbarui menjadi Dibayar.',
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['distributor-orders'] });
    },
  });

  // Confirm receipt mutation
  const confirmMutation = useMutation({
    mutationFn: async (orderId: string) => {
      try {
        await orderService.confirmReceipt(orderId);
        toast.success('Konfirmasi penerimaan sukses!');
      } catch {
        // Local simulation fallback: update query client cache directly
        queryClient.setQueryData(['distributor-orders', user?.id], (old: unknown) => {
          const currentList =
            (old as DistributorOrder[]) || (MOCK_ORDERS as unknown as DistributorOrder[]);
          return currentList.map((o) =>
            o.id === orderId ? { ...o, status: 'completed' } : o
          ) as DistributorOrder[];
        });
        toast.success('[Simulasi] Pengiriman telah diterima distributor!', {
          description: 'Sisa stok produk otomatis terisi di persediaan gudang.',
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['distributor-orders'] });
    },
  });

  const activeOrders = (orders || MOCK_ORDERS) as DistributorOrder[];

  // Search and filter logic
  const filteredOrders = activeOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.seller?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && order.status === statusFilter;
  });

  const statuses = [
    { value: 'all', label: 'Semua' },
    { value: 'pending_payment', label: 'Menunggu Bayar' },
    { value: 'paid', label: 'Dibayar' },
    { value: 'shipped', label: 'Dikirim' },
    { value: 'completed', label: 'Selesai' },
    { value: 'cancelled', label: 'Batal' },
  ];

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Manajemen Pesanan Grosir
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Pantau status pemesanan bulk B2B komoditas pertanian Anda dari petani mitra.
        </p>
      </div>

      {isOffline && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-800">Modus Simulasi Luring Aktif</h4>
            <p className="text-[11px] text-amber-600/90 font-medium mt-0.5 leading-relaxed">
              Semua mutasi pembayaran, penerimaan, dan pelacakan pesanan grosir diproses menggunakan
              simulasi memori lokal luring.
            </p>
          </div>
        </div>
      )}

      {/* Filter and Search controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
        {/* Search */}
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Cari berdasarkan Order ID atau Petani..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 text-xs font-semibold border-slate-200 focus:border-green-500 w-full"
          />
        </div>
        {/* Filter buttons */}
        <div className="flex flex-wrap gap-1.5">
          {statuses.map((status) => (
            <button
              key={status.value}
              onClick={() => setStatusFilter(status.value)}
              className={`px-3 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                statusFilter === status.value
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/50'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-14 text-center">
              <ShoppingBag className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-xs font-bold text-slate-800">
                Tidak ada pesanan grosir ditemukan
              </h3>
              <p className="mt-1 text-[11px] text-slate-500 font-semibold">
                Coba cari kata kunci lain atau belanja grosir sekarang.
              </p>
              <Link href="/dashboard/distributor/catalog" className="mt-4 inline-block">
                <Button className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs h-9 px-4 rounded-lg cursor-pointer">
                  Mulai Belanja Grosir
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="border-b border-slate-100">
                    <TableHead className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider py-3">
                      Order ID
                    </TableHead>
                    <TableHead className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                      Mitra Petani
                    </TableHead>
                    <TableHead className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider text-center">
                      Jumlah Barang
                    </TableHead>
                    <TableHead className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider text-right">
                      Total Bayar
                    </TableHead>
                    <TableHead className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider text-center">
                      Status
                    </TableHead>
                    <TableHead className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider text-right">
                      Tanggal
                    </TableHead>
                    <TableHead className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider text-center">
                      Aksi Cepat
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order: DistributorOrder) => {
                    const statusColors: Record<string, string> = {
                      pending_payment: 'bg-amber-50 text-amber-700 border-amber-200/50',
                      paid: 'bg-blue-50 text-blue-700 border-blue-200/50',
                      confirmed: 'bg-purple-50 text-purple-700 border-purple-200/50',
                      shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200/50',
                      completed: 'bg-green-50 text-green-700 border-green-200/50',
                      cancelled: 'bg-rose-50 text-rose-700 border-rose-200/50',
                    };

                    const statusLabels: Record<string, string> = {
                      pending_payment: 'Menunggu Bayar',
                      paid: 'Dibayar',
                      confirmed: 'Dikonfirmasi',
                      shipped: 'Dikirim',
                      completed: 'Selesai',
                      cancelled: 'Batal',
                    };

                    return (
                      <TableRow
                        key={order.id}
                        className="border-b border-slate-100 hover:bg-slate-50/40"
                      >
                        <TableCell className="font-bold text-xs py-3 text-slate-800">
                          {order.id}
                        </TableCell>
                        <TableCell className="text-xs font-semibold text-slate-600">
                          {order.seller?.full_name || order.seller?.name || 'Petani Mandiri'}
                        </TableCell>
                        <TableCell className="text-xs font-bold text-slate-600 text-center">
                          {order.items_count} Jenis
                        </TableCell>
                        <TableCell className="text-xs font-bold text-slate-800 text-right">
                          {formatCurrency(order.total_amount)}
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[10.5px] font-bold ${statusColors[order.status] || 'bg-slate-50 text-slate-600'}`}
                          >
                            {statusLabels[order.status] || order.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs font-semibold text-slate-500 text-right">
                          {new Date(order.created_at || order.createdAt || '').toLocaleDateString(
                            'id-ID',
                            {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            }
                          )}
                        </TableCell>
                        <TableCell className="py-2.5">
                          <div className="flex items-center justify-center gap-1.5">
                            {order.status === 'pending_payment' && (
                              <Button
                                size="sm"
                                onClick={() => payMutation.mutate(order.id)}
                                className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10.5px] h-7.5 px-2.5 rounded-lg flex items-center gap-1 cursor-pointer"
                                disabled={payMutation.isPending}
                              >
                                <CreditCard className="w-3.5 h-3.5" /> Bayar
                              </Button>
                            )}

                            {order.status === 'shipped' && (
                              <Button
                                size="sm"
                                onClick={() => confirmMutation.mutate(order.id)}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold text-[10.5px] h-7.5 px-2.5 rounded-lg flex items-center gap-1 cursor-pointer"
                                disabled={confirmMutation.isPending}
                              >
                                <CheckSquare className="w-3.5 h-3.5" /> Selesai
                              </Button>
                            )}

                            {order.status === 'completed' && (
                              <Link href="/dashboard/distributor/finance/invoices">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-slate-200 text-slate-700 font-bold text-[10.5px] h-7.5 px-2.5 rounded-lg flex items-center gap-1 cursor-pointer"
                                >
                                  <FileText className="w-3.5 h-3.5" /> Invoice
                                </Button>
                              </Link>
                            )}

                            <Link href={`/dashboard/distributor/orders/${order.id}`}>
                              <Button
                                variant="ghost"
                                className="h-7.5 px-2 text-[10.5px] font-bold text-green-600 hover:text-green-700 hover:bg-green-50/50 flex items-center gap-0.5 justify-center cursor-pointer"
                              >
                                Detail
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
