'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/services/order';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardFooter,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar, TrendingUp, Wallet, Landmark, RefreshCw, FileText } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _MOCK_FINANCE_TRANSACTIONS = [
  {
    id: 'ORD-98822',
    total_amount: 14500000,
    created_at: '2026-05-27T08:00:00Z',
    status: 'shipped',
    items_summary: 'Beras Pandan, Tomat Segar, Cabai Rawit',
  },
  {
    id: 'ORD-98815',
    total_amount: 8500000,
    created_at: '2026-05-25T14:30:00Z',
    status: 'paid',
    items_summary: 'Cabai Rawit Merah, Susu Murni',
  },
  {
    id: 'ORD-98790',
    total_amount: 11200000,
    created_at: '2026-05-20T10:00:00Z',
    status: 'completed',
    items_summary: 'Beras Pandan, Wortel Segar, Tempe Organik',
  },
  {
    id: 'ORD-98755',
    total_amount: 6000000,
    created_at: '2026-05-18T16:00:00Z',
    status: 'completed',
    items_summary: 'Susu Sapi Segar',
  },
  {
    id: 'ORD-98650',
    total_amount: 15400000,
    created_at: '2026-05-05T13:00:00Z',
    status: 'completed',
    items_summary: 'Kentang Dieng, Bawang Brebes',
  },
  {
    id: 'ORD-98612',
    total_amount: 22000000,
    created_at: '2026-04-28T11:00:00Z',
    status: 'completed',
    items_summary: 'Beras Pandan Wangi',
  },
];

export default function DistributorFinancePage() {
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');

  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize] = React.useState(5); // 5 items per page

  // Reset pageIndex on filter changes
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPageIndex(0);
  }, [startDate, endDate]);

  // Fetch orders (acting as transactions)
  const {
    data: transactions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['distributor-finance'],
    queryFn: async () => {
      const res = await orderService.getOrders();
      // filter paid or completed
      const validRes = ((res.data?.orders || []) as unknown as Record<string, unknown>[]).filter(
        (o: Record<string, unknown>) =>
          ['paid', 'confirmed', 'shipped', 'completed'].includes(o.status as string)
      );
      const mapped = validRes.map((o: Record<string, unknown>) => ({
        id: o.id,
        total_amount: o.total_amount,
        created_at: (o.created_at || o.createdAt) as string,
        status: o.status as string,
        items_summary:
          (o.items as Record<string, unknown>[] | undefined)
            ?.map((item) => item.title as string)
            .join(', ') || 'Pembelian Komoditas Tani',
      }));
      if (!mapped || mapped.length === 0) throw new Error('Empty');
      return mapped;
    },
  });

  React.useEffect(() => {
    if (isError) {
      toast.error('Koneksi ke server terputus. Gagal memuat data teraktual.');
    }
  }, [isError]);

  const activeTransactions = (transactions || []) as unknown as typeof MOCK_FINANCE_TRANSACTIONS;

  // Filter logic
  const filteredTransactions = activeTransactions.filter(
    (tx: (typeof MOCK_FINANCE_TRANSACTIONS)[number]) => {
      if (!tx.created_at) return true;
      const txTime = new Date(tx.created_at).getTime();

      const start = startDate ? new Date(startDate).getTime() : 0;
      const end = endDate ? new Date(endDate).getTime() + 24 * 60 * 60 * 1000 : Infinity;

      return txTime >= start && txTime <= end;
    }
  );

  const totalAllTimeSpending = activeTransactions.reduce(
    (sum: number, tx: (typeof MOCK_FINANCE_TRANSACTIONS)[number]) => sum + tx.total_amount,
    0
  );
  const monthlySpending = filteredTransactions.reduce(
    (sum: number, tx: (typeof MOCK_FINANCE_TRANSACTIONS)[number]) => sum + tx.total_amount,
    0
  );
  const avgOrderValue = totalAllTimeSpending / (activeTransactions.length || 1);
  const totalRows = filteredTransactions.length;
  const fromRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const toRow = Math.min((pageIndex + 1) * pageSize, totalRows);
  const totalPages = Math.ceil(totalRows / pageSize);

  const paginatedTransactions = React.useMemo(() => {
    const start = pageIndex * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
    // eslint-disable-next-line react-hooks/preserve-manual-memoization
  }, [filteredTransactions, pageIndex, pageSize]);

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Manajemen Pengeluaran Kas (Finance)
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Pantau arus pengeluaran kas modal, tagihan platform, dan unduh rekap invoice B2B secara
            terpusat.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/distributor/finance/invoices">
            <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-10 px-4 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm">
              <FileText className="h-4 w-4" /> Kelola Invoice
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Panel */}
      {isError ? (
        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
          Gagal memuat data statistik B2B / Koneksi ke server terputus
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {/* KPI 1: Total Belanja (All-Time) */}
          <Card className="min-w-0">
            <CardHeader className="gap-1">
              <CardDescription className="truncate text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Belanja (All-Time)
              </CardDescription>
              <CardTitle
                className="truncate text-xl font-semibold tabular-nums lg:text-2xl text-slate-800"
                title={formatCurrency(totalAllTimeSpending)}
              >
                {formatCurrency(totalAllTimeSpending)}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="flex w-full min-w-0 items-center gap-1 font-medium">
                <Wallet className="size-4 shrink-0 text-emerald-500" />
                <span className="truncate text-muted-foreground">
                  Akumulasi seluruh belanja grosir
                </span>
              </div>
            </CardFooter>
          </Card>

          {/* KPI 2: Belanja Periode Ini */}
          <Card className="min-w-0">
            <CardHeader className="gap-1">
              <CardDescription className="truncate text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Belanja Periode Ini
              </CardDescription>
              <CardTitle
                className="truncate text-xl font-semibold tabular-nums lg:text-2xl text-slate-800"
                title={formatCurrency(monthlySpending)}
              >
                {formatCurrency(monthlySpending)}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="flex w-full min-w-0 items-center gap-1 font-medium">
                <Landmark className="size-4 shrink-0 text-blue-500" />
                <span className="truncate text-muted-foreground">
                  Belanja terfilter rentang tanggal
                </span>
              </div>
            </CardFooter>
          </Card>

          {/* KPI 3: Rata-rata per Pesanan */}
          <Card className="min-w-0">
            <CardHeader className="gap-1">
              <CardDescription className="truncate text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Rata-rata per Pesanan
              </CardDescription>
              <CardTitle
                className="truncate text-xl font-semibold tabular-nums lg:text-2xl text-slate-800"
                title={formatCurrency(avgOrderValue)}
              >
                {formatCurrency(avgOrderValue)}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="flex w-full min-w-0 items-center gap-1 font-medium">
                <TrendingUp className="size-4 shrink-0 text-purple-500" />
                <span className="truncate text-muted-foreground">Rata-rata pengadaan barang</span>
              </div>
            </CardFooter>
          </Card>

          {/* KPI 4: Index Finansial B2B */}
          <Card className="min-w-0">
            <CardHeader className="gap-1">
              <CardDescription className="truncate text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Index Finansial B2B
              </CardDescription>
              <CardTitle
                className="truncate text-xl font-semibold tabular-nums lg:text-2xl text-slate-800"
                title="100% Lunas"
              >
                100%
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="flex w-full min-w-0 items-center gap-1 font-medium">
                <RefreshCw className="size-4 shrink-0 text-amber-500" />
                <span className="truncate text-muted-foreground">Arus tagihan terjamin bersih</span>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Transactions table Container */}
      <Card className="border-slate-200 shadow-sm bg-white overflow-hidden rounded-xl border">
        <CardHeader className="pb-4 border-b border-slate-100 p-6 space-y-4">
          <div className="space-y-1">
            <CardTitle className="text-sm font-bold text-slate-800">
              Daftar Riwayat Mutasi Kas & Belanja
            </CardTitle>
            <CardDescription className="text-xs">
              Log transaksi pembayaran pengadaan grosir komoditas tani B2B.
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
          {isError ? (
            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
              Gagal memuat data pengeluaran kas B2B / Koneksi ke server terputus
            </div>
          ) : isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="py-14 text-center">
              <Calendar className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-xs font-bold text-slate-800">
                Tidak ada pengeluaran kas ditemukan
              </h3>
              <p className="mt-1 text-[11px] text-slate-500 font-semibold">
                Coba ubah rentang filter tanggal belanja Anda.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-hidden rounded-xl border bg-white shadow-xs">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="border-b border-slate-100">
                      <TableHead className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider py-3 pl-4">
                        Tanggal
                      </TableHead>
                      <TableHead className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                        Order ID
                      </TableHead>
                      <TableHead className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                        Rincian Komoditas
                      </TableHead>
                      <TableHead className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider text-right">
                        Modal Belanja
                      </TableHead>
                      <TableHead className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider text-center">
                        Status Tagihan
                      </TableHead>
                      <TableHead className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider text-center">
                        Aksi
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTransactions.map((tx: (typeof MOCK_FINANCE_TRANSACTIONS)[number]) => {
                      const statusColors: Record<string, string> = {
                        paid: 'bg-blue-50 text-blue-700 border-blue-200/50',
                        shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200/50',
                        completed: 'bg-green-50 text-green-700 border-green-200/50',
                      };

                      const statusLabels: Record<string, string> = {
                        paid: 'Dibayar',
                        shipped: 'Transit',
                        completed: 'Lunas',
                      };

                      return (
                        <TableRow
                          key={tx.id}
                          className="border-b border-slate-100 hover:bg-slate-50/40"
                        >
                          <TableCell className="text-xs font-semibold text-slate-500 py-3 pl-4">
                            {new Date(tx.created_at).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </TableCell>
                          <TableCell className="font-bold text-xs text-slate-800">
                            {tx.id}
                          </TableCell>
                          <TableCell className="text-xs font-semibold text-slate-600 max-w-[220px] truncate">
                            {tx.items_summary}
                          </TableCell>
                          <TableCell className="text-xs font-bold text-slate-800 text-right">
                            {formatCurrency(tx.total_amount)}
                          </TableCell>
                          <TableCell className="text-center">
                            <span
                              className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[9.5px] font-bold ${statusColors[tx.status] || 'bg-slate-50 text-slate-600'}`}
                            >
                              {statusLabels[tx.status] || tx.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <Link href={`/dashboard/distributor/orders/${tx.id}`}>
                              <Button
                                variant="ghost"
                                className="h-8 px-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/50 flex items-center justify-center mx-auto cursor-pointer"
                              >
                                Lihat Detail
                              </Button>
                            </Link>
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
                  Menampilkan {fromRow}-{toRow} dari {totalRows} transaksi
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
