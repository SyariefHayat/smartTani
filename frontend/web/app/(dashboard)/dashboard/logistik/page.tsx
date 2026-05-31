'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { logisticsService } from '@/services/logistics';
import { useAuthStore } from '@/stores/auth';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BarChart, Bar, XAxis, CartesianGrid } from 'recharts';
import { Truck, ClipboardList, ArrowRight, TrendingUp, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

const chartConfig = {
  deliveries: {
    label: 'Jumlah Sukses',
    color: '#22c55e',
  },
} satisfies ChartConfig;

export default function LogisticsOverviewPage() {
  const user = useAuthStore((state) => state.user);
  const [currentPage, setCurrentPage] = React.useState(1);

  // Fetch KPI statistics
  const {
    data: analyticsResponse,
    isLoading: isStatsLoading,
    isError: isStatsError,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ['logistics-analytics-overview', user?.id],
    queryFn: () => logisticsService.getLogisticsAnalytics(user?.id || ''),
    enabled: !!user?.id,
  });

  // Fetch recent shipments with pagination
  const {
    data: shipmentsResponse,
    isLoading: isShipmentsLoading,
    isError: isShipmentsError,
    refetch: refetchShipments,
  } = useQuery({
    queryKey: ['logistics-shipments-recent', currentPage],
    queryFn: () => logisticsService.getShipments({ page: currentPage, limit: 5 }),
  });

  // Fetch performance chart data
  const {
    data: chartResponse,
    isLoading: isChartLoading,
    isError: isChartError,
    refetch: refetchChart,
  } = useQuery({
    queryKey: ['logistics-performance-chart', user?.id],
    queryFn: () => logisticsService.getLogisticsPerformanceChart(user?.id || ''),
    enabled: !!user?.id,
  });

  const isQueryError = isStatsError || isShipmentsError || isChartError;

  const stats = analyticsResponse || {
    pending_pickup_count: 0,
    active_count: 0,
    delivered_today: 0,
    delivered_this_month: 0,
    delivered_all_time: 0,
    avg_delivery_hours: 0,
    ontime_rate_percent: 0,
    monthly_change_percent: 0,
  };
  const recentShipments = shipmentsResponse?.data?.shipments || [];

  const totalPages = shipmentsResponse?.data?.meta?.totalPages || 1;

  if ((isStatsLoading || isShipmentsLoading || isChartLoading) && !isQueryError) {
    return (
      <div className="w-full space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-6 md:grid-cols-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-87.5 md:col-span-2 w-full" />
          <Skeleton className="h-87.5 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Ringkasan Pengiriman</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Selamat bekerja,{' '}
            <span className="font-bold text-green-600">{user?.full_name || 'Rekan Kurir'}</span>!
            Siap kirim pesanan hari ini?
          </p>
        </div>
        <div className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          ID Kurir: #{user?.id?.slice(0, 8) || 'L-DUMMY'}
        </div>
      </div>

      {/* KPI Stats Grid */}
      {isStatsError ? (
        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm w-full">
          Gagal memuat data statistik / Koneksi ke server Layanan Logistik terputus
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {/* Card 1 */}
          <Card className="min-w-0">
            <CardHeader className="gap-1">
              <CardDescription className="truncate text-xs">Menunggu Pickup</CardDescription>
              <CardTitle className="truncate text-xl font-semibold tabular-nums lg:text-2xl">
                {stats.pending_pickup_count}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <p className="text-[10px] font-medium text-slate-400"></p>
              <div className="flex w-full min-w-0 items-center gap-1 font-medium">
                <ClipboardList className="size-4 shrink-0 text-slate-500" />
                <span className="truncate text-muted-foreground">Paket di greenhouse petani</span>
              </div>
            </CardFooter>
          </Card>

          {/* Card 2 */}
          <Card className="min-w-0">
            <CardHeader className="gap-1">
              <CardDescription className="truncate text-xs">Dalam Perjalanan</CardDescription>
              <CardTitle className="truncate text-xl font-semibold tabular-nums lg:text-2xl">
                {stats.active_count}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <p className="text-[10px] font-medium text-slate-400"></p>
              <div className="flex w-full min-w-0 items-center gap-1 font-medium">
                <Truck className="h-4 w-4 text-amber-500" />
                <span className="truncate text-muted-foreground">Sedang dikirim ke pembeli</span>
              </div>
            </CardFooter>
          </Card>

          {/* Card 3 */}
          <Card className="min-w-0">
            <CardHeader className="gap-1">
              <CardDescription className="truncate text-xs">Selesai Hari Ini</CardDescription>
              <CardTitle className="truncate text-xl font-semibold tabular-nums lg:text-2xl">
                {stats.delivered_today}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <p className="text-[10px] font-medium text-slate-400"></p>
              <div className="flex w-full min-w-0 items-center gap-1 font-medium">
                {/* <Truck className="h-4 w-4 text-amber-500" /> */}
                <span className="truncate text-muted-foreground">Terkirim aman hari ini</span>
              </div>
            </CardFooter>
          </Card>

          {/* Card 4 */}
          <Card className="min-w-0">
            <CardHeader className="gap-1">
              <CardDescription className="truncate text-xs">On-Time Rate</CardDescription>
              <CardTitle className="truncate text-xl font-semibold tabular-nums lg:text-2xl">
                {stats.ontime_rate_percent}%
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <p className="text-[10px] font-medium text-slate-400"></p>
              <div className="flex w-full min-w-0 items-center gap-1 font-medium">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="truncate text-muted-foreground">
                  Rata-rata waktu transit {stats.avg_delivery_hours} jam
                </span>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Main Charts & Quick Action Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Recharts Bar Chart deliveries */}
        <Card className="border-slate-200 shadow-sm bg-white md:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-bold text-slate-800">
              Tren Pengiriman Selesai
            </CardTitle>
            <CardDescription className="text-xs">
              Jumlah pengiriman sukses kurir per hari minggu ini.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {isChartError ? (
              <div className="flex h-60 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm w-full">
                Gagal memuat grafik pengiriman selesai / Koneksi ke server terputus
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="aspect-auto h-60 w-full text-xs">
                <BarChart accessibilityLayer data={chartResponse || []}>
                  <CartesianGrid vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    stroke="#94a3b8"
                    fontSize={10}
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Bar dataKey="deliveries" fill="var(--color-deliveries)" radius={6} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
          {!isChartError && !isStatsError && (
            <CardFooter className="flex-col items-start gap-2 text-xs pt-4 border-t border-slate-100">
              <div className="flex gap-2 leading-none font-semibold text-slate-800">
                Meningkat {stats.monthly_change_percent}% bulan ini{' '}
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div className="leading-none text-slate-500 font-medium">
                Menampilkan data performa pengiriman kurir aktif minggu ini.
              </div>
            </CardFooter>
          )}
        </Card>

        {/* Quick Actions and Stats */}
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-slate-800">
              Aksi Cepat & Navigasi
            </CardTitle>
            <CardDescription className="text-xs">
              Kelola antrean kerja aktif kurir logistik.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            {isStatsError ? (
              <div className="flex h-72 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm w-full">
                Gagal memuat data navigasi / Koneksi ke server terputus
              </div>
            ) : (
              <>
                <Link href="/dashboard/logistik/shipments/pending" className="block w-full">
                  <Button className="w-full h-11 justify-between bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer">
                    <span className="flex items-center gap-2">
                      <ClipboardList className="h-4 w-4" /> Ambil Paket Baru
                    </span>
                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-green-600 px-1 text-[10px] font-bold text-white shadow-sm">
                      {stats.pending_pickup_count}
                    </span>
                  </Button>
                </Link>

                <Link href="/dashboard/logistik/shipments/active" className="block w-full">
                  <Button className="w-full h-11 justify-between bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl cursor-pointer">
                    <span className="flex items-center gap-2">
                      <Truck className="h-4 w-4" /> Kirim Paket Aktif
                    </span>
                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-green-700 shadow-sm">
                      {stats.active_count}
                    </span>
                  </Button>
                </Link>

                <div className="border-t border-slate-100 my-4 pt-4 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-500">Total Kirim (Bulan ini)</span>
                    <span className="font-bold text-slate-800 tabular-nums">
                      {stats.delivered_this_month} Paket
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-500">Total Seumur Hidup</span>
                    <span className="font-bold text-slate-800 tabular-nums">
                      {stats.delivered_all_time} Paket
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-green-600 bg-green-50 px-2 py-1.5 rounded-lg font-semibold mt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Efisiensi
                    </span>
                    <span className="font-bold">Unggul (+12%)</span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Shipments List Table */}
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="space-y-1">
            <CardTitle className="text-base font-bold text-slate-800">
              Antrean Pengiriman Terbaru
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Daftar pengiriman paket pertanian terbaru yang ditugaskan kepada Anda.
            </CardDescription>
          </div>
          <Link
            href="/dashboard/logistik/shipments"
            className="text-xs font-bold text-green-600 hover:text-green-700 flex items-center gap-1.5"
          >
            Semua Pengiriman <ArrowRight className="h-4 w-4" />
          </Link>
        </CardHeader>
        <CardContent>
          {isShipmentsError ? (
            <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm w-full">
              Gagal memuat data antrean pengiriman / Koneksi ke server terputus
            </div>
          ) : (
            <>
              <div className="overflow-hidden rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-25">Order ID</TableHead>
                      <TableHead>Asal / Penjemputan</TableHead>
                      <TableHead>Penerima</TableHead>
                      <TableHead>Tujuan</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Jumlah Item</TableHead>
                      <TableHead className="text-right"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentShipments.map((ship) => {
                      const statusColors: Record<string, string> = {
                        pending_pickup: 'bg-slate-50 text-slate-700 border-slate-200/50',
                        picked_up: 'bg-blue-50 text-blue-700 border-blue-200/50',
                        in_transit: 'bg-amber-50 text-amber-700 border-amber-200/50',
                        delivered: 'bg-green-50 text-green-700 border-green-200/50',
                      };

                      const statusLabels: Record<string, string> = {
                        pending_pickup: 'Menunggu Pickup',
                        picked_up: 'Diambil',
                        in_transit: 'Transit',
                        delivered: 'Terkirim',
                      };

                      return (
                        <TableRow key={ship.id}>
                          <TableCell className="font-medium text-xs">
                            <span className="font-mono text-xs font-bold text-slate-500">
                              #{ship.order_id}
                            </span>
                          </TableCell>
                          <TableCell className="text-xs font-semibold text-slate-700">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                              {ship.pickup_address.city}
                            </span>
                          </TableCell>
                          <TableCell className="text-xs font-semibold text-slate-800">
                            {ship.delivery_address.recipient_name}
                          </TableCell>
                          <TableCell className="text-xs font-medium text-slate-700">
                            {ship.delivery_address.city}
                          </TableCell>
                          <TableCell className="text-center">
                            <span
                              className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[10.5px] font-bold ${statusColors[ship.status] || 'bg-slate-50 text-slate-600'}`}
                            >
                              {statusLabels[ship.status] || ship.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-center text-xs font-medium text-slate-600">
                            {ship.items_count} Item
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-slate-500 hover:text-slate-700 hover:bg-slate-100 cursor-pointer rounded-lg focus-visible:ring-0 focus-visible:ring-offset-0"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Menu aksi</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40 rounded-xl">
                                <DropdownMenuItem
                                  asChild
                                  className="cursor-pointer font-semibold text-xs"
                                >
                                  <Link href={`/dashboard/logistik/shipments/${ship.order_id}`}>
                                    Lihat Rincian
                                  </Link>
                                </DropdownMenuItem>
                                {ship.status === 'pending_pickup' && (
                                  <DropdownMenuItem
                                    asChild
                                    className="cursor-pointer font-semibold text-xs text-green-600 focus:text-green-600 focus:bg-green-50"
                                  >
                                    <Link href="/dashboard/logistik/shipments/pending">
                                      Ambil Paket
                                    </Link>
                                  </DropdownMenuItem>
                                )}
                                {ship.status === 'picked_up' && (
                                  <DropdownMenuItem
                                    asChild
                                    className="cursor-pointer font-semibold text-xs text-blue-600 focus:text-blue-600 focus:bg-blue-50"
                                  >
                                    <Link href="/dashboard/logistik/shipments/active">
                                      Kirim Paket
                                    </Link>
                                  </DropdownMenuItem>
                                )}
                                {ship.status === 'in_transit' && (
                                  <DropdownMenuItem
                                    asChild
                                    className="cursor-pointer font-semibold text-xs text-amber-600 focus:text-amber-600 focus:bg-amber-50"
                                  >
                                    <Link href="/dashboard/logistik/shipments/active">
                                      Update Transit
                                    </Link>
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
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
                  Menampilkan {(currentPage - 1) * 5 + 1}-
                  {Math.min(currentPage * 5, totalPages * 5)} dari {totalPages * 5} pengiriman
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className="cursor-pointer"
                  >
                    Sebelumnya
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
    </div>
  );
}
