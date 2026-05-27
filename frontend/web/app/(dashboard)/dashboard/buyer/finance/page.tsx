'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getStoredAuthUser } from '@/lib/auth-storage';
import { analyticsService, BuyerFinance } from '@/services/analytics';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { format, subDays } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
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
  ArrowLeft,
  Wallet,
  TrendingUp,
  Clock,
  AlertTriangle,
  RefreshCw,
  Eye,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DatePickerWithRange } from '@/components/sections/dashboard/farmer/DatePickerRange';
import { DateRangeContext } from '@/context/dateRange';
import { DateRange } from 'react-day-picker';

const MOCK_FINANCE_DATA: BuyerFinance = {
  total_spending: 18450000,
  monthly_spending: 4200000,
  avg_per_order: 750000,
  spending_change_percent: 12.4,
  transactions: [
    {
      id: 'TX-80121',
      date: '2026-05-27T10:00:00Z',
      order_id: 'ORD-88192',
      amount: 1500000,
      status: 'completed',
      items_summary: 'Cabai Merah Keriting A',
    },
    {
      id: 'TX-80110',
      date: '2026-05-26T14:30:00Z',
      order_id: 'ORD-88151',
      amount: 2100000,
      status: 'completed',
      items_summary: 'Pupuk Organik Bio-Tani',
    },
    {
      id: 'TX-80092',
      date: '2026-05-24T08:15:00Z',
      order_id: 'ORD-88092',
      amount: 4500000,
      status: 'completed',
      items_summary: 'Alat Semprot Hama',
    },
    {
      id: 'TX-79910',
      date: '2026-05-22T16:00:00Z',
      order_id: 'ORD-87910',
      amount: 1800000,
      status: 'completed',
      items_summary: 'Bibit Tomat Unggul',
    },
    {
      id: 'TX-79850',
      date: '2026-05-21T09:30:00Z',
      order_id: 'ORD-87850',
      amount: 900000,
      status: 'cancelled',
      items_summary: 'Bawang Merah Bima',
    },
  ],
  meta: {
    page: 1,
    limit: 20,
    total: 5,
  },
};

export default function BuyerFinancePage() {
  const router = useRouter();
  const user = getStoredAuthUser();

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const [searchQuery, setSearchQuery] = React.useState('');

  // 1. Fetch Finance Analytics
  const {
    data: financeData,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['buyer-finance-analytics', user?.id, date?.from, date?.to],
    queryFn: async () => {
      if (!user?.id) return null;
      return analyticsService.getBuyerFinance(user.id, { page: 1, limit: 100 });
    },
    enabled: !!user?.id,
  });

  const isQueryError = isError;

  React.useEffect(() => {
    if (isQueryError) {
      toast.error('Layanan keuangan offline. Menggunakan data demo lokal.', {
        description:
          'Menampilkan data pengeluaran simulasi agar Anda tetap dapat menjelajahi layout.',
        duration: 5000,
      });
    }
  }, [isQueryError]);

  const activeData = isQueryError ? MOCK_FINANCE_DATA : financeData || MOCK_FINANCE_DATA;

  // Filter transactions
  const filteredTransactions = React.useMemo(() => {
    return activeData.transactions.filter((tx) => {
      return (
        tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.items_summary.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [activeData.transactions, searchQuery]);

  const stats = [
    {
      title: 'Total Belanja Belajar',
      value: formatCurrency(activeData.total_spending || 0),
      description: 'Total pengeluaran all-time',
      icon: Wallet,
      colorClass: 'text-green-500',
    },
    {
      title: 'Belanja Bulan Ini',
      value: formatCurrency(activeData.monthly_spending || 0),
      description: `${activeData.spending_change_percent >= 0 ? '+' : ''}${activeData.spending_change_percent}% dibanding bln lalu`,
      icon: TrendingUp,
      colorClass: activeData.spending_change_percent >= 0 ? 'text-green-500' : 'text-rose-500',
    },
    {
      title: 'Rata-rata Transaksi',
      value: formatCurrency(activeData.avg_per_order || 0),
      description: 'Nilai belanja per transaksi selesai',
      icon: Clock,
      colorClass: 'text-amber-500',
    },
  ];

  return (
    <DateRangeContext.Provider value={{ date, setDate }}>
      <div className="w-full space-y-6 text-slate-900">
        {/* Warning Banner */}
        {isQueryError && (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800 font-semibold shadow-xs">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 animate-pulse" />
              <p>
                Mode Offline Simulasi: Koneksi ke server keuangan terputus. Menampilkan data lokal
                demo agar Anda tetap dapat menjelajahi layout.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-7 cursor-pointer border-amber-300 text-amber-800 bg-white hover:bg-amber-100 font-bold shrink-0 text-[10px]"
              onClick={() => refetch()}
              disabled={isRefetching}
            >
              <RefreshCw className={`mr-1 h-3 w-3 ${isRefetching ? 'animate-spin' : ''}`} />
              {isRefetching ? 'Hubungkan...' : 'Coba Hubungkan Kembali'}
            </Button>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight lg:text-2xl text-slate-800">
              Riwayat Belanja & Pengeluaran
            </h1>
            <p className="text-sm text-slate-500">
              Pantau seluruh catatan pengeluaran belanja Anda di platform SmartTani.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <DatePickerWithRange />
          </div>
        </div>

        {/* Stats Row */}
        {isLoading ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={stat.title}
                  className="min-w-0 border border-slate-200 bg-white shadow-xs"
                >
                  <CardHeader className="gap-1 p-5 pb-3">
                    <CardDescription className="truncate text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {stat.title}
                    </CardDescription>
                    <CardTitle className="truncate text-xl font-semibold tabular-nums lg:text-2xl text-slate-800">
                      {stat.value}
                    </CardTitle>
                  </CardHeader>
                  <CardFooter className="flex-col items-start gap-1.5 p-5 pt-0 text-sm">
                    <div className="flex w-full min-w-0 items-center gap-1.5 font-medium text-slate-500">
                      <Icon className={`size-4 shrink-0 ${stat.colorClass}`} />
                      <span className="truncate text-xs text-slate-500">{stat.description}</span>
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

        {/* Invoice Ledger Table */}
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-sm font-bold text-slate-800">
                Daftar Faktur Pembelian
              </CardTitle>
              <CardDescription className="text-xs">
                Ledger detail kwitansi pembayaran belanja Anda.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Cari ID transaksi..."
                className="h-9 rounded-md border-slate-200 bg-white px-3 text-xs text-slate-900 w-full md:w-56 focus-visible:ring-green-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                variant="outline"
                size="sm"
                className="h-9 font-bold text-xs cursor-pointer flex items-center gap-1 shrink-0 text-slate-500 hover:text-green-600"
                onClick={() => router.push('/dashboard/buyer/finance/history')}
              >
                Semua Ledger <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="p-12 text-center text-slate-400 font-medium text-xs">
                Tidak ada riwayat transaksi pengeluaran.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/75 border-b border-slate-200">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="h-10 text-slate-600 font-bold text-xs uppercase tracking-wider pl-6">
                        ID Transaksi
                      </TableHead>
                      <TableHead className="h-10 text-slate-600 font-bold text-xs uppercase tracking-wider">
                        Tanggal
                      </TableHead>
                      <TableHead className="h-10 text-slate-600 font-bold text-xs uppercase tracking-wider">
                        Nomor Faktur
                      </TableHead>
                      <TableHead className="h-10 text-slate-600 font-bold text-xs uppercase tracking-wider">
                        Rincian Komoditas
                      </TableHead>
                      <TableHead className="h-10 text-slate-600 font-bold text-xs uppercase tracking-wider">
                        Jumlah Pengeluaran
                      </TableHead>
                      <TableHead className="h-10 text-slate-600 font-bold text-xs uppercase tracking-wider">
                        Status
                      </TableHead>
                      <TableHead className="h-10 text-slate-600 font-bold text-xs uppercase tracking-wider text-right pr-6">
                        Ledger
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((tx) => {
                      const isCompleted = tx.status === 'completed';
                      return (
                        <TableRow
                          key={tx.id}
                          className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0"
                        >
                          <TableCell className="py-4 font-mono text-xs font-semibold text-slate-500 pl-6">
                            #{tx.id}
                          </TableCell>
                          <TableCell className="py-4 text-xs font-medium text-slate-600">
                            {format(new Date(tx.date), 'dd MMM yyyy, HH:mm', { locale: localeId })}
                          </TableCell>
                          <TableCell className="py-4 text-xs font-mono text-slate-600">
                            {tx.order_id}
                          </TableCell>
                          <TableCell className="py-4 text-xs font-semibold text-slate-800">
                            {tx.items_summary}
                          </TableCell>
                          <TableCell className="py-4 text-xs font-bold text-slate-800">
                            {formatCurrency(tx.amount)}
                          </TableCell>
                          <TableCell className="py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                                isCompleted
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${isCompleted ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}
                              />
                              {isCompleted ? 'Berhasil' : 'Batal'}
                            </span>
                          </TableCell>
                          <TableCell className="py-4 text-right pr-6">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-[10px] font-bold text-slate-500 hover:text-slate-900 cursor-pointer flex items-center gap-1 ml-auto"
                              onClick={() => router.push(`/dashboard/buyer/orders/${tx.order_id}`)}
                            >
                              <Eye className="h-3.5 w-3.5 text-slate-400" /> Detail
                            </Button>
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
    </DateRangeContext.Provider>
  );
}
