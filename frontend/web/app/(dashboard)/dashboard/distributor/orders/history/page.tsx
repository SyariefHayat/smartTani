'use client';

import * as React from 'react';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/services/order';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Calendar, CheckCircle2, XCircle, Wallet, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HistoryOrder {
  id: string;
  total_amount: number;
  created_at?: string;
  createdAt?: string;
  status: string;
  seller?: { full_name?: string; name?: string };
  items_count: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _MOCK_HISTORY_ORDERS: HistoryOrder[] = [
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
    id: 'ORD-98710',
    total_amount: 9300000,
    created_at: '2026-05-12T09:00:00Z',
    status: 'cancelled',
    seller: { full_name: 'Agus Salim' },
    items_count: 2,
  },
  {
    id: 'ORD-98650',
    total_amount: 15400000,
    created_at: '2026-05-05T13:00:00Z',
    status: 'completed',
    seller: { full_name: 'Siti Aminah' },
    items_count: 3,
  },
  {
    id: 'ORD-98612',
    total_amount: 22000000,
    created_at: '2026-04-28T11:00:00Z',
    status: 'completed',
    seller: { full_name: 'Budi Santoso' },
    items_count: 5,
  },
];

export default function DistributorOrdersHistoryPage() {
  const router = useRouter();
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');

  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize] = React.useState(5); // 5 items per page

  // Reset pageIndex on filter change
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPageIndex(0);
  }, [startDate, endDate]);

  const {
    data: historyOrders,
    isLoading,
    isError: isHistoryError,
  } = useQuery({
    queryKey: ['distributor-orders-history'],
    queryFn: async (): Promise<HistoryOrder[]> => {
      const res = await orderService.getOrders();
      if (!res || !res.data || !res.data.orders) throw new Error('Empty');
      return ((res.data.orders || []) as unknown as HistoryOrder[]).filter((o: HistoryOrder) =>
        ['completed', 'cancelled'].includes(o.status)
      );
    },
  });

  React.useEffect(() => {
    if (isHistoryError) {
      toast.error('Koneksi ke server terputus. Gagal memuat data teraktual.');
    }
  }, [isHistoryError]);

  const activeOrders = historyOrders || [];

  // Filter logic
  const filteredOrders = activeOrders.filter((order: HistoryOrder) => {
    if (!order.created_at) return true;
    const orderTime = new Date(order.created_at).getTime();

    const start = startDate ? new Date(startDate).getTime() : 0;
    const end = endDate ? new Date(endDate).getTime() + 24 * 60 * 60 * 1000 : Infinity; // cover full end date

    return orderTime >= start && orderTime <= end;
  });

  const totalSpent = filteredOrders
    .filter((o: HistoryOrder) => o.status === 'completed')
    .reduce((sum: number, o: HistoryOrder) => sum + o.total_amount, 0);

  const totalOrdersCount = filteredOrders.length;
  const completedOrdersCount = filteredOrders.filter(
    (o: HistoryOrder) => o.status === 'completed'
  ).length;
  const cancelledOrdersCount = filteredOrders.filter(
    (o: HistoryOrder) => o.status === 'cancelled'
  ).length;
  const totalRows = filteredOrders.length;
  const fromRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const toRow = Math.min((pageIndex + 1) * pageSize, totalRows);
  const totalPages = Math.ceil(totalRows / pageSize);

  const paginatedOrders = React.useMemo(() => {
    const start = pageIndex * pageSize;
    return filteredOrders.slice(start, start + pageSize);
    // eslint-disable-next-line react-hooks/preserve-manual-memoization
  }, [filteredOrders, pageIndex, pageSize]);

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl text-slate-900">
          Riwayat Pesanan Grosir
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Tinjau seluruh riwayat pengadaan barang grosir B2B Anda yang sudah diselesaikan atau
          dibatalkan.
        </p>
      </div>

      {/* Summary KPI Panel (Standardised) */}
      {isHistoryError ? (
        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
          Gagal memuat data statistik B2B / Koneksi ke server terputus
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
          {/* KPI 1: Cumulative Purchases */}
          <Card className="min-w-0">
            <CardHeader className="gap-1">
              <CardDescription className="truncate text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Pengadaan Modal
              </CardDescription>
              <CardTitle
                className="truncate text-xl font-semibold tabular-nums lg:text-2xl text-slate-800"
                title={formatCurrency(totalSpent)}
              >
                {formatCurrency(totalSpent)}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="flex w-full min-w-0 items-center gap-1 font-medium">
                <Wallet className="size-4 shrink-0 text-emerald-500" />
                <span className="truncate text-muted-foreground">Total belanja B2B selesai</span>
              </div>
            </CardFooter>
          </Card>

          {/* KPI 2: Total Completed */}
          <Card className="min-w-0">
            <CardHeader className="gap-1">
              <CardDescription className="truncate text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Pesanan Selesai
              </CardDescription>
              <CardTitle
                className="truncate text-xl font-semibold tabular-nums lg:text-2xl text-slate-800"
                title={`${completedOrdersCount} / ${totalOrdersCount}`}
              >
                {completedOrdersCount} / {totalOrdersCount}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="flex w-full min-w-0 items-center gap-1 font-medium">
                <CheckCircle2 className="size-4 shrink-0 text-blue-500" />
                <span className="truncate text-muted-foreground">Pesanan sukses diterima</span>
              </div>
            </CardFooter>
          </Card>

          {/* KPI 3: Total Cancelled */}
          <Card className="min-w-0">
            <CardHeader className="gap-1">
              <CardDescription className="truncate text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Pesanan Batal
              </CardDescription>
              <CardTitle
                className="truncate text-xl font-semibold tabular-nums lg:text-2xl text-slate-800"
                title={`${cancelledOrdersCount}`}
              >
                {cancelledOrdersCount}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="flex w-full min-w-0 items-center gap-1 font-medium">
                <XCircle className="size-4 shrink-0 text-rose-500" />
                <span className="truncate text-muted-foreground">Transaksi dibatalkan</span>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Filters & Orders Table Container */}
      <Card className="w-full overflow-hidden rounded-xl border bg-white shadow-xs">
        <CardHeader className="pb-4 border-b border-slate-100 p-6 space-y-4">
          <div className="space-y-1">
            <CardTitle className="text-sm font-bold text-slate-800">
              Daftar Riwayat Pesanan Grosir B2B
            </CardTitle>
            <CardDescription className="text-xs">
              Tinjau seluruh data pengadaan barang B2B yang sudah selesai atau dibatalkan.
            </CardDescription>
          </div>

          {/* Unified Date Filters */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end justify-between pt-2">
            <div className="grid gap-3 grid-cols-2 sm:flex sm:items-center sm:gap-3 flex-1 max-w-2xl">
              <div className="space-y-1.5 flex-1 min-w-0">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  Tanggal Mulai
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="pl-9.5 h-9 text-xs font-semibold border-slate-200 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500 w-full rounded-lg bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5 flex-1 min-w-0">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  Tanggal Selesai
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="pl-9.5 h-9 text-xs font-semibold border-slate-200 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500 w-full rounded-lg bg-white"
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={() => {
                setStartDate('');
                setEndDate('');
              }}
              variant="outline"
              className="border-slate-200 text-slate-700 font-bold text-xs h-9 px-4 rounded-lg cursor-pointer bg-white hover:bg-slate-50 shrink-0"
            >
              Reset Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Orders Table */}
          {isHistoryError ? (
            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
              Gagal memuat data riwayat pesanan B2B / Koneksi ke server terputus
            </div>
          ) : isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-14 text-center">
              <Calendar className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-xs font-bold text-slate-800">Tidak ada riwayat ditemukan</h3>
              <p className="mt-1 text-[11px] text-slate-500 font-semibold">
                Coba ubah filter rentang tanggal atau mulai belanja grosir.
              </p>
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
                    {paginatedOrders.map((order: HistoryOrder) => {
                      const isCompleted = order.status === 'completed';

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
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                                isCompleted
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  isCompleted ? 'bg-emerald-500' : 'bg-rose-500'
                                }`}
                              />
                              {isCompleted ? 'Selesai' : 'Batal'}
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
              <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-100 mt-4">
                <div className="text-xs font-semibold text-slate-500">
                  Menampilkan {fromRow}-{toRow} dari {totalRows} pesanan
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPageIndex((prev) => Math.max(0, prev - 1))}
                    disabled={pageIndex === 0}
                    className="border-slate-200 text-slate-700 font-bold text-xs h-8 px-3 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
                  >
                    Sebelumnya
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPageIndex((prev) => Math.min(totalPages - 1, prev + 1))}
                    disabled={pageIndex >= totalPages - 1}
                    className="border-slate-200 text-slate-700 font-bold text-xs h-8 px-3 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
                  >
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
