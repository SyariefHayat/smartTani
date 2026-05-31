'use client';

import * as React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getStoredAuthUser } from '@/lib/auth-storage';
import { analyticsService, BuyerFinance } from '@/services/analytics';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { format, subDays } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, type ChartConfig } from '@/components/ui/chart';
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
  AlertTriangle,
  RefreshCw,
  Eye,
  ArrowUp,
  ArrowDown,
  Loader2,
  MoreHorizontal,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

const chartConfig = {
  belanja: {
    label: 'Total Belanja',
    color: 'var(--chart-1)',
  },
  transaksi: {
    label: 'Jumlah Transaksi',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

type ChartKey = 'belanja' | 'transaksi';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string | number;
    [key: string]: unknown;
  }>;
  label?: string | number;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const value = payload[0].value !== undefined ? payload[0].value : 0;
    const dateFormatted = new Date(label || '').toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const isBelanja = payload[0].dataKey === 'belanja';
    const metricLabel = isBelanja ? 'Total Belanja' : 'Jumlah Transaksi';
    const indicatorColor = isBelanja ? 'bg-emerald-500' : 'bg-amber-500';

    const formattedValue = isBelanja
      ? formatCurrency(Number(value))
      : `${Number(value).toLocaleString('id-ID')} transaksi`;

    return (
      <div className="rounded-xl border border-border bg-card/95 p-3 shadow-xl backdrop-blur-md min-w-56">
        <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase border-b pb-1.5 border-border">
          {dateFormatted}
        </p>
        <div className="flex items-center justify-between gap-4 mt-2.5">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${indicatorColor} animate-pulse`} />
            <span className="text-xs text-muted-foreground font-medium">{metricLabel}</span>
          </div>
          <span className="text-sm font-bold text-foreground">{formattedValue}</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function BuyerFinancePage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isHistoryPage = pathname.includes('/history') || searchParams.get('tab') === 'history';
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
      if (isHistoryPage) {
        toast.error('Layanan keuangan offline. Menggunakan data demo lokal.', {
          description:
            'Menampilkan data pengeluaran simulasi agar Anda tetap dapat menjelajahi layout.',
          duration: 5000,
        });
      } else {
        toast.error('Gagal memuat data keuangan. Koneksi ke server terputus.');
      }
    }
  }, [isQueryError, isHistoryPage]);

  const activeData = isQueryError
    ? isHistoryPage
      ? MOCK_FINANCE_DATA
      : {
          total_spending: 0,
          monthly_spending: 0,
          avg_per_order: 0,
          spending_change_percent: 0,
          transactions: [],
          meta: { page: 1, limit: 10, total: 0 },
        }
    : financeData || MOCK_FINANCE_DATA;

  // Filter transactions by searchQuery and date range
  const filteredTransactions = React.useMemo(() => {
    return activeData.transactions.filter((tx) => {
      const matchesSearch =
        tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.items_summary.toLowerCase().includes(searchQuery.toLowerCase());

      if (!date?.from) return matchesSearch;

      const txDate = new Date(tx.date);
      const fromDate = new Date(date.from);
      fromDate.setHours(0, 0, 0, 0);

      if (date.to) {
        const toDate = new Date(date.to);
        toDate.setHours(23, 59, 59, 999);
        return matchesSearch && txDate >= fromDate && txDate <= toDate;
      }

      return matchesSearch && txDate >= fromDate;
    });
  }, [activeData.transactions, searchQuery, date]);

  // Client-side pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const ITEMS_PER_PAGE = 10;

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [searchQuery, date]);

  const totalRows = filteredTransactions.length;
  const totalPages = Math.ceil(totalRows / ITEMS_PER_PAGE);
  const fromRow = totalRows === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const toRow = Math.min(currentPage * ITEMS_PER_PAGE, totalRows);

  const paginatedTransactions = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTransactions, currentPage]);

  const [activeChart, setActiveChart] = React.useState<ChartKey>('belanja');

  const chartData = React.useMemo(() => {
    const dailyData: Record<string, { date: string; belanja: number; transaksi: number }> = {};

    // Process transactions to group by date
    activeData.transactions.forEach((tx) => {
      // Filter by date range
      if (date?.from) {
        const txDate = new Date(tx.date);
        const fromDate = new Date(date.from);
        fromDate.setHours(0, 0, 0, 0);

        if (date.to) {
          const toDate = new Date(date.to);
          toDate.setHours(23, 59, 59, 999);
          if (txDate < fromDate || txDate > toDate) return;
        } else {
          if (txDate < fromDate) return;
        }
      }

      const dateKey = tx.date.split('T')[0];
      if (!dailyData[dateKey]) {
        dailyData[dateKey] = {
          date: dateKey,
          belanja: 0,
          transaksi: 0,
        };
      }
      if (tx.status === 'completed') {
        dailyData[dateKey].belanja += tx.amount;
        dailyData[dateKey].transaksi += 1;
      }
    });

    return Object.values(dailyData).sort((a, b) => a.date.localeCompare(b.date));
  }, [activeData.transactions, date]);

  const chartTotals = React.useMemo(() => {
    return {
      belanja: chartData.reduce((acc, curr) => acc + curr.belanja, 0),
      transaksi: chartData.reduce((acc, curr) => acc + curr.transaksi, 0),
    };
  }, [chartData]);

  const completedTxCount = activeData.transactions.filter((tx) => tx.status === 'completed').length;

  const spendingChange = activeData.spending_change_percent || 0;
  const isUp = spendingChange >= 0;

  const stats = [
    {
      title: 'Total Belanja',
      value: formatCurrency(activeData.total_spending || 0),
      hasCompare: false,
      change: 0,
      footer: 'Total pengeluaran all-time',
    },
    {
      title: 'Belanja Bulan Ini',
      value: formatCurrency(activeData.monthly_spending || 0),
      hasCompare: true,
      change: spendingChange,
      footer: 'dari bulan lalu',
    },
    {
      title: 'Rata-rata Transaksi',
      value: formatCurrency(activeData.avg_per_order || 0),
      hasCompare: false,
      change: 0,
      footer: 'Rata-rata pengeluaran per pesanan',
    },
    {
      title: 'Transaksi Selesai',
      value: `${completedTxCount} Transaksi`,
      hasCompare: false,
      change: 0,
      footer: 'Jumlah transaksi sukses',
    },
  ];

  return (
    <DateRangeContext.Provider value={{ date, setDate }}>
      {/* Header — matches farmer dashboard exactly */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl">
            Riwayat Belanja & Pengeluaran
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pantau seluruh catatan pengeluaran belanja, analisis transaksi, dan faktur digital Anda.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <DatePickerWithRange />
        </div>
      </div>

      {/* Stats Row — exact SectionCard pattern from farmer dashboard */}
      {isQueryError && !isHistoryPage ? (
        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
          Gagal memuat data statistik keuangan / Koneksi ke server terputus
        </div>
      ) : isLoading ? (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="min-w-0">
              <CardHeader className="gap-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-full" />
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <Skeleton className="h-4 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {stats.map((stat, index) => {
            const hasCompare = stat.hasCompare;
            const statIsUp = stat.change > 0;
            const statIsDown = stat.change < 0;

            let colorClass = 'text-muted-foreground';
            let Icon = null;
            let percentageText = '0.0%';

            if (hasCompare) {
              colorClass = statIsUp
                ? 'text-green-500'
                : statIsDown
                  ? 'text-red-500'
                  : 'text-muted-foreground';
              Icon = statIsUp ? ArrowUp : statIsDown ? ArrowDown : null;
              percentageText = `${Math.abs(stat.change).toFixed(1)}%`;
            }

            return (
              <Card key={index} className="min-w-0">
                <CardHeader className="gap-1">
                  <CardDescription className="truncate text-xs">{stat.title}</CardDescription>
                  <CardTitle
                    className="truncate text-xl font-semibold tabular-nums lg:text-2xl"
                    title={stat.value}
                  >
                    {stat.value}
                  </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                  <div className="flex w-full min-w-0 items-center gap-1 font-medium">
                    {Icon && <Icon className={`size-4 shrink-0 ${colorClass}`} />}
                    <span className="truncate">
                      {hasCompare && <span className={colorClass}>{percentageText} </span>}
                      <span className="text-muted-foreground">{stat.footer}</span>
                    </span>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Interactive Spending Chart — exact ChartBarInteractive pattern from farmer */}
      {isLoading ? (
        <Card className="py-0">
          <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
            <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0!">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="flex">
              <div className="px-6 py-4 sm:px-8 sm:py-6 border-l">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-32" />
              </div>
              <div className="px-6 py-4 sm:px-8 sm:py-6 border-l">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-32" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-2 sm:p-6 flex h-75 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      ) : isQueryError && !isHistoryPage ? (
        <Card className="flex h-100 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
          Gagal memuat grafik analisis pengeluaran / Koneksi ke server terputus
        </Card>
      ) : (
        <Card className="py-0">
          <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
            <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0!">
              <CardTitle className="font-semibold lg:text-xl">Analisis Pengeluaran</CardTitle>
              <CardDescription>
                Grafik pengeluaran belanja harian dan frekuensi transaksi Anda.
              </CardDescription>
            </div>
            <div className="flex">
              <button
                data-active={activeChart === 'belanja'}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left data-[active=true]:bg-muted/50 sm:border-t-0 sm:border-l sm:px-8 sm:py-6 min-w-56 cursor-pointer hover:bg-muted/20 transition-colors"
                onClick={() => setActiveChart('belanja')}
              >
                <span className="text-xs text-muted-foreground">{chartConfig.belanja.label}</span>
                <span className="text-base leading-none font-bold sm:text-2xl">
                  {formatCurrency(chartTotals.belanja)}
                </span>
              </button>
              <button
                data-active={activeChart === 'transaksi'}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left border-l data-[active=true]:bg-muted/50 sm:border-t-0 sm:border-l sm:px-8 sm:py-6 min-w-56 cursor-pointer hover:bg-muted/20 transition-colors"
                onClick={() => setActiveChart('transaksi')}
              >
                <span className="text-xs text-muted-foreground">{chartConfig.transaksi.label}</span>
                <span className="text-base leading-none font-bold sm:text-2xl">
                  {chartTotals.transaksi.toLocaleString('id-ID')} Tx
                </span>
              </button>
            </div>
          </CardHeader>
          <CardContent className="px-2 sm:p-6">
            {chartData.length === 0 ? (
              <div className="flex h-62.5 items-center justify-center text-muted-foreground">
                Tidak ada data belanja untuk periode ini
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="aspect-auto h-75 w-full">
                <BarChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString('id-ID', {
                        month: 'short',
                        day: 'numeric',
                      })
                    }
                  />
                  <YAxis
                    hide={activeChart === 'transaksi'}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) =>
                      activeChart === 'belanja'
                        ? value >= 1000000
                          ? `Rp ${(value / 1000000).toFixed(1)}jt`
                          : value >= 1000
                            ? `Rp ${(value / 1000).toFixed(0)}rb`
                            : `Rp ${value}`
                        : value.toLocaleString('id-ID')
                    }
                  />
                  <ChartTooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey={activeChart}
                    fill={`var(--color-${activeChart})`}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      )}

      {/* Invoice Ledger Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Daftar Faktur Pembelian</CardTitle>
          </div>
          <div className="flex items-center pt-4">
            <Input
              placeholder="Cari ID transaksi atau produk..."
              className="rounded-sm max-w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isQueryError && !isHistoryPage ? (
            <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
              Gagal memuat daftar faktur pembelian / Koneksi ke server terputus
            </div>
          ) : (
            <>
              {isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="overflow-hidden rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaksi</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Rincian Pembelian</TableHead>
                        <TableHead>Pengeluaran</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                          Tidak ada hasil.
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="overflow-hidden rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaksi</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Rincian Pembelian</TableHead>
                        <TableHead>Pengeluaran</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedTransactions.map((tx) => {
                        const isCompleted = tx.status === 'completed';
                        return (
                          <TableRow key={tx.id}>
                            <TableCell className="font-mono text-xs font-medium text-muted-foreground">
                              #{tx.id}
                            </TableCell>
                            <TableCell className="text-xs font-medium text-slate-600">
                              {format(new Date(tx.date), 'dd MMM yyyy, HH:mm', {
                                locale: localeId,
                              })}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span
                                  className="font-medium text-sm truncate max-w-40 lg:max-w-60"
                                  title={tx.items_summary}
                                >
                                  {tx.items_summary}
                                </span>
                                <span className="text-[10px] text-muted-foreground uppercase">
                                  {tx.order_id}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm font-medium tabular-nums">
                                {formatCurrency(tx.amount)}
                              </div>
                            </TableCell>
                            <TableCell>
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
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon-xs" className="cursor-pointer">
                                    <span className="sr-only">Buka menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 bg-white">
                                  <DropdownMenuGroup>
                                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                    <DropdownMenuItem
                                      className="cursor-pointer text-slate-700 hover:bg-slate-50 focus:bg-slate-50"
                                      onClick={() => {
                                        navigator.clipboard.writeText(tx.id);
                                        toast.success('ID transaksi berhasil disalin');
                                      }}
                                    >
                                      Salin ID Transaksi
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="cursor-pointer text-slate-700 hover:bg-slate-50 focus:bg-slate-50"
                                      onClick={() =>
                                        router.push(`/dashboard/buyer/orders/${tx.order_id}`)
                                      }
                                    >
                                      Lihat Detail Pesanan
                                    </DropdownMenuItem>
                                  </DropdownMenuGroup>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Pagination */}
              <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                  Menampilkan {fromRow}–{toRow} dari {totalRows} transaksi
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={isLoading || currentPage === 1 || totalRows === 0}
                    className="cursor-pointer"
                  >
                    Sebelumnya
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={isLoading || currentPage === totalPages || totalRows === 0}
                    className="cursor-pointer"
                  >
                    Berikutnya
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </DateRangeContext.Provider>
  );
}
