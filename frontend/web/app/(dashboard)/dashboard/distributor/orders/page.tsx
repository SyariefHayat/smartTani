'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  MoreHorizontal,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');

  // Fetch orders
  const {
    data: orders,
    isLoading,
    isError: isOrdersError,
  } = useQuery({
    queryKey: ['distributor-orders', user?.id],
    queryFn: async (): Promise<DistributorOrder[]> => {
      const res = await orderService.getOrders();
      if (!res || !res.data || !res.data.orders) throw new Error('Empty');
      return res.data.orders as unknown as DistributorOrder[];
    },
    enabled: !!user?.id,
  });

  React.useEffect(() => {
    if (isOrdersError) {
      toast.error('Koneksi ke server terputus. Gagal memuat data teraktual.');
    }
  }, [isOrdersError]);

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
          const currentList = (old as DistributorOrder[]) || [];
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
          const currentList = (old as DistributorOrder[]) || [];
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

  const activeOrders = orders || MOCK_ORDERS;

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
      <Card className="w-full">
        <CardContent className="pt-6">
          {isOrdersError ? (
            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
              Gagal memuat data daftar pesanan B2B / Koneksi ke server terputus
            </div>
          ) : isLoading ? (
            <div className="space-y-3">
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
            <>
              <div className="overflow-hidden rounded-md border bg-white shadow-xs">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[110px]">ID Pesanan</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Mitra Petani</TableHead>
                      <TableHead className="text-center">Jumlah Barang</TableHead>
                      <TableHead className="text-right">Total Bayar</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order: DistributorOrder) => {
                      const statusColors: Record<string, string> = {
                        pending_payment: 'bg-amber-50 text-amber-700 border-amber-200',
                        paid: 'bg-blue-50 text-blue-700 border-blue-200',
                        confirmed: 'bg-purple-50 text-purple-700 border-purple-200',
                        shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                        completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                        cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
                      };

                      const statusDotColors: Record<string, string> = {
                        pending_payment: 'bg-amber-500',
                        paid: 'bg-blue-500 animate-pulse',
                        confirmed: 'bg-purple-500',
                        shipped: 'bg-indigo-500 animate-pulse',
                        completed: 'bg-emerald-500',
                        cancelled: 'bg-rose-500',
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
                        <TableRow key={order.id} className="hover:bg-slate-50/50 transition-colors">
                          <TableCell className="font-mono text-xs font-medium text-muted-foreground">
                            #{order.id}
                          </TableCell>
                          <TableCell className="text-xs font-medium text-slate-600">
                            {new Date(order.created_at || order.createdAt || '').toLocaleDateString(
                              'id-ID',
                              {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              }
                            )}
                          </TableCell>
                          <TableCell className="text-xs font-semibold text-slate-700">
                            {order.seller?.full_name || order.seller?.name || 'Petani Mandiri'}
                          </TableCell>
                          <TableCell className="text-center text-xs font-medium text-slate-600">
                            {order.items_count} Jenis
                          </TableCell>
                          <TableCell className="text-right font-bold text-slate-800 text-xs">
                            {formatCurrency(order.total_amount)}
                          </TableCell>
                          <TableCell className="text-center">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border ${statusColors[order.status] || 'bg-slate-50 text-slate-700 border-slate-200'}`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${statusDotColors[order.status] || 'bg-slate-400'}`}
                              />
                              {statusLabels[order.status] || order.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 cursor-pointer text-slate-500 hover:text-slate-700"
                                  >
                                    <span className="sr-only">Buka menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-48 bg-white border border-slate-200 shadow-md rounded-lg"
                                >
                                  <DropdownMenuGroup>
                                    <DropdownMenuLabel className="text-[11px] font-bold text-slate-400 px-3 py-1.5 uppercase tracking-wider">
                                      Aksi
                                    </DropdownMenuLabel>
                                    <DropdownMenuItem
                                      className="cursor-pointer text-xs font-semibold text-slate-700 hover:bg-slate-50 focus:bg-slate-50 px-3 py-2 flex items-center gap-2"
                                      onClick={() => {
                                        navigator.clipboard.writeText(order.id);
                                        toast.success('ID pesanan berhasil disalin');
                                      }}
                                    >
                                      Salin ID Pesanan
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="cursor-pointer text-xs font-semibold text-slate-700 hover:bg-slate-50 focus:bg-slate-50 px-3 py-2 flex items-center gap-2"
                                      onClick={() =>
                                        router.push(`/dashboard/distributor/orders/${order.id}`)
                                      }
                                    >
                                      Lihat Detail
                                    </DropdownMenuItem>
                                  </DropdownMenuGroup>

                                  {(order.status === 'pending_payment' ||
                                    order.status === 'shipped' ||
                                    order.status === 'completed') && (
                                    <>
                                      <DropdownMenuSeparator className="my-1 border-slate-100" />
                                      <DropdownMenuGroup>
                                        {order.status === 'pending_payment' && (
                                          <DropdownMenuItem
                                            className="cursor-pointer text-xs font-bold text-amber-600 hover:bg-amber-50 focus:bg-amber-50 px-3 py-2 flex items-center gap-2"
                                            onClick={() => payMutation.mutate(order.id)}
                                            disabled={payMutation.isPending}
                                          >
                                            <CreditCard className="w-3.5 h-3.5 shrink-0" /> Bayar
                                            Sekarang
                                          </DropdownMenuItem>
                                        )}

                                        {order.status === 'shipped' && (
                                          <DropdownMenuItem
                                            className="cursor-pointer text-xs font-bold text-green-600 hover:bg-green-50 focus:bg-green-50 px-3 py-2 flex items-center gap-2"
                                            onClick={() => confirmMutation.mutate(order.id)}
                                            disabled={confirmMutation.isPending}
                                          >
                                            <CheckSquare className="w-3.5 h-3.5 shrink-0" /> Selesai
                                            / Diterima
                                          </DropdownMenuItem>
                                        )}

                                        {order.status === 'completed' && (
                                          <DropdownMenuItem
                                            className="cursor-pointer text-xs font-bold text-slate-700 hover:bg-slate-50 focus:bg-slate-50 px-3 py-2 flex items-center gap-2"
                                            onClick={() =>
                                              router.push('/dashboard/distributor/finance/invoices')
                                            }
                                          >
                                            <FileText className="w-3.5 h-3.5 shrink-0 text-slate-500" />{' '}
                                            Lihat Invoice
                                          </DropdownMenuItem>
                                        )}
                                      </DropdownMenuGroup>
                                    </>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                  Menampilkan 1-{filteredOrders.length} dari {filteredOrders.length} pesanan
                </div>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" disabled={true} className="cursor-pointer">
                    Sebelumnya
                  </Button>
                  <Button variant="outline" size="sm" disabled={true} className="cursor-pointer">
                    Berikutnya
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
