'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/services/order';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
  Calendar,
  TrendingUp,
  Wallet,
  Landmark,
  RefreshCw,
  AlertTriangle,
  FileText,
} from 'lucide-react';

const MOCK_FINANCE_TRANSACTIONS = [
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
  const [isOffline, setIsOffline] = React.useState(false);

  // Fetch orders (acting as transactions)
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['distributor-finance'],
    queryFn: async () => {
      try {
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
      } catch {
        setIsOffline(true);
        return MOCK_FINANCE_TRANSACTIONS;
      }
    },
  });

  const activeTransactions = (transactions ||
    MOCK_FINANCE_TRANSACTIONS) as unknown as typeof MOCK_FINANCE_TRANSACTIONS;

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

      {isOffline && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-800">Modus Simulasi Luring Aktif</h4>
            <p className="text-[11px] text-amber-600/90 font-medium mt-0.5 leading-relaxed">
              Arus keluar kas, log pengeluaran modal, dan detail nominal keuangan disimulasikan
              secara luring lokal.
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards Panel */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1: All time spending */}
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
              Total Belanja (All-Time)
            </span>
            <div className="p-2 bg-green-50 rounded-lg text-green-600">
              <Wallet className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-slate-800">
              {formatCurrency(totalAllTimeSpending)}
            </div>
            <p className="text-[10.5px] font-semibold text-slate-500 mt-1">
              Akumulasi seluruh belanja grosir
            </p>
          </CardContent>
        </Card>

        {/* KPI 2: Monthly spending */}
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
              Belanja Periode Ini
            </span>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Landmark className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-slate-800">
              {formatCurrency(monthlySpending)}
            </div>
            <p className="text-[10.5px] font-semibold text-slate-500 mt-1">
              Belanja terfilter rentang tanggal
            </p>
          </CardContent>
        </Card>

        {/* KPI 3: Average Order value */}
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
              Rata-rata per Pesanan
            </span>
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-slate-800">{formatCurrency(avgOrderValue)}</div>
            <p className="text-[10.5px] font-semibold text-slate-500 mt-1">
              Rata-rata pengadaan barang
            </p>
          </CardContent>
        </Card>

        {/* KPI 4: Financial index */}
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
              Index Finansial B2B
            </span>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <RefreshCw className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-slate-800">
              100% <span className="text-xs font-semibold text-slate-500">Lunas</span>
            </div>
            <p className="text-[10.5px] font-semibold text-slate-500 mt-1">
              Arus tagihan terjamin bersih
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Date Range Picker Filters */}
      <div className="grid gap-4 sm:grid-cols-3 bg-white p-4 border border-slate-200 rounded-xl shadow-sm items-end">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Tanggal Mulai
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="pl-10 h-10 text-xs font-semibold border-slate-200 focus:border-green-500 w-full"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Tanggal Selesai
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="pl-10 h-10 text-xs font-semibold border-slate-200 focus:border-green-500 w-full"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => {
              setStartDate('');
              setEndDate('');
            }}
            variant="outline"
            className="border-slate-200 text-slate-700 font-bold text-xs h-10 px-4 rounded-lg w-full cursor-pointer"
          >
            Reset Filter
          </Button>
        </div>
      </div>

      {/* Transactions table */}
      <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 space-y-2">
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
            <div className="overflow-x-auto">
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
                  {filteredTransactions.map((tx: (typeof MOCK_FINANCE_TRANSACTIONS)[number]) => {
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
                        <TableCell className="font-bold text-xs text-slate-800">{tx.id}</TableCell>
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
                              className="h-8 px-2 text-xs font-bold text-green-600 hover:text-green-700 hover:bg-green-50/50 flex items-center justify-center mx-auto cursor-pointer"
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
