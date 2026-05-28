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
import { Calendar, FileText, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

interface HistoryOrder {
  id: string;
  total_amount: number;
  created_at?: string;
  createdAt?: string;
  status: string;
  seller?: { full_name?: string; name?: string };
  items_count: number;
}

const MOCK_HISTORY_ORDERS: HistoryOrder[] = [
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
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [isOffline, setIsOffline] = React.useState(false);

  const { data: historyOrders, isLoading } = useQuery({
    queryKey: ['distributor-orders-history'],
    queryFn: async () => {
      try {
        const res = await orderService.getOrders();
        const completedRes = ((res.data?.orders || []) as unknown as HistoryOrder[]).filter(
          (o: HistoryOrder) => ['completed', 'cancelled'].includes(o.status)
        );
        if (!completedRes || completedRes.length === 0) throw new Error('Empty');
        return completedRes;
      } catch {
        setIsOffline(true);
        return MOCK_HISTORY_ORDERS;
      }
    },
  });

  const activeOrders = historyOrders || MOCK_HISTORY_ORDERS;

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

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Riwayat Pesanan Grosir</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Tinjau seluruh riwayat pengadaan barang grosir B2B Anda yang sudah diselesaikan atau
          dibatalkan.
        </p>
      </div>

      {isOffline && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-800">Modus Simulasi Luring Aktif</h4>
            <p className="text-[11px] text-amber-600/90 font-medium mt-0.5 leading-relaxed">
              Arsip riwayat pesanan grosir dan kalkulasi modal belanja berjalan dalam simulasi
              offline.
            </p>
          </div>
        </div>
      )}

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

      {/* Summary KPI Panel */}
      <div className="grid gap-4 sm:grid-cols-4">
        {/* KPI 1: Cumulative Purchases */}
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden sm:col-span-2">
          <CardHeader className="pb-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Total Pengadaan Modal
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-slate-800">{formatCurrency(totalSpent)}</div>
            <p className="text-[10.5px] font-semibold text-slate-500 mt-1">
              Akumulasi belanja grosir yang sukses diselesaikan
            </p>
          </CardContent>
        </Card>

        {/* KPI 2: Total Completed */}
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
          <CardHeader className="pb-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Pesanan Selesai
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              {completedOrdersCount} / {totalOrdersCount}
            </div>
            <p className="text-[10.5px] font-semibold text-slate-500 mt-1">
              Pesanan sukses diterima
            </p>
          </CardContent>
        </Card>

        {/* KPI 3: Total Cancelled */}
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
          <CardHeader className="pb-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Pesanan Batal
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-slate-800 flex items-center gap-1.5">
              <XCircle className="h-5 w-5 text-rose-500" />
              {cancelledOrdersCount}
            </div>
            <p className="text-[10.5px] font-semibold text-slate-500 mt-1">Transaksi dibatalkan</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 space-y-3">
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
                      Tanggal Transaksi
                    </TableHead>
                    <TableHead className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider text-center">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order: HistoryOrder) => {
                    const isCompleted = order.status === 'completed';

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
                            className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[10.5px] font-bold ${
                              isCompleted
                                ? 'bg-green-50 text-green-700 border-green-200/50'
                                : 'bg-rose-50 text-rose-700 border-rose-200/50'
                            }`}
                          >
                            {isCompleted ? 'Selesai' : 'Batal'}
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
                        <TableCell className="text-center">
                          <Link href={`/dashboard/distributor/orders/${order.id}`}>
                            <Button
                              variant="ghost"
                              className="h-8 px-2 text-xs font-bold text-green-600 hover:text-green-700 hover:bg-green-50/50 flex items-center gap-1 justify-center mx-auto cursor-pointer"
                            >
                              <FileText className="h-3.5 w-3.5" /> Detail
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
