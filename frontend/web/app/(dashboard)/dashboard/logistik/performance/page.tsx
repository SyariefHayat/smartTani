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
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, LineChart, Line, CartesianGrid, XAxis, Label } from 'recharts';
import {
  TrendingUp,
  Clock,
  AlertTriangle,
  RefreshCw,
  BarChart3,
  Activity,
  Award,
  GitCommitVertical,
} from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

const chartConfig = {
  deliveries: {
    label: 'Paket Terkirim',
    color: '#334155', // slate-700
  },
  avg_hours: {
    label: 'Rata Durasi (Jam)',
    color: '#94a3b8', // slate-400
  },
  packageCount: {
    label: 'Paket',
  },
  pending_pickup: {
    label: 'Menunggu Pickup',
    color: '#cbd5e1', // slate-300
  },
  picked_up: {
    label: 'Diambil',
    color: '#94a3b8', // slate-400
  },
  in_transit: {
    label: 'Transit',
    color: '#64748b', // slate-500
  },
  delivered_status: {
    label: 'Sukses Terkirim',
    color: '#334155', // slate-700
  },
} satisfies ChartConfig;

export default function LogisticsPerformancePage() {
  const user = useAuthStore((state) => state.user);

  // Fetch KPI statistics
  const {
    data: analyticsResponse,
    isLoading: isStatsLoading,
    isError: isStatsError,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ['logistics-analytics-performance', user?.id],
    queryFn: () => logisticsService.getLogisticsAnalytics(user?.id || ''),
    enabled: !!user?.id,
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

  const isQueryError = isStatsError || isChartError;
  const isLoading = isStatsLoading || isChartLoading;

  const refetch = () => {
    refetchStats();
    refetchChart();
  };

  const chartData = React.useMemo(() => {
    if (!analyticsResponse) return [];
    return [
      {
        status: 'pending_pickup',
        count: analyticsResponse.pending_pickup_count,
        fill: 'var(--color-pending_pickup)',
      },
      {
        status: 'picked_up',
        count: analyticsResponse.active_count ? Math.ceil(analyticsResponse.active_count / 2) : 0,
        fill: 'var(--color-picked_up)',
      },
      {
        status: 'in_transit',
        count: analyticsResponse.active_count ? Math.floor(analyticsResponse.active_count / 2) : 0,
        fill: 'var(--color-in_transit)',
      },
      {
        status: 'delivered_status',
        count: analyticsResponse.delivered_all_time,
        fill: 'var(--color-delivered_status)',
      },
    ];
  }, [analyticsResponse]);

  const totalPackages = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, [chartData]);

  const lineChartData = chartResponse || [];

  if (isLoading && !isQueryError) {
    return (
      <div className="w-full space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Analisis Performa Kurir
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Ukur produktivitas operasional pengiriman, rata-rata waktu transit, dan efisiensi karir
          Anda.
        </p>
      </div>

      {/* Query Error State */}
      {isQueryError ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 p-8 text-center text-red-500 font-semibold text-sm">
          <AlertTriangle className="h-8 w-8 text-red-600 mb-2 animate-pulse" />
          <p className="font-bold">Gagal memuat data performa kurir</p>
          <p className="text-xs text-red-400 font-normal mt-1 mb-4">
            Koneksi ke server Layanan Logistik terputus. Silakan periksa jaringan Anda atau coba
            hubungkan kembali.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="border-red-300 text-red-800 bg-white hover:bg-red-100 font-bold text-xs"
            onClick={refetch}
          >
            <RefreshCw className="h-3 w-3 mr-1" /> Coba Hubungkan Kembali
          </Button>
        </div>
      ) : (
        <>
          {/* Stats Grid - overview style */}
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
            {/* Card 1 */}
            <Card className="min-w-0">
              <CardHeader className="gap-1">
                <CardDescription className="truncate text-[10.5px] font-semibold text-slate-500 uppercase tracking-wider">
                  Tingkat Ketepatan Waktu
                </CardDescription>
                <CardTitle className="truncate text-xl font-semibold tabular-nums lg:text-2xl text-slate-800">
                  {analyticsResponse?.ontime_rate_percent || 0}%
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="flex w-full min-w-0 items-center gap-1.5 font-medium text-xs">
                  <Award className="size-4 shrink-0 text-slate-400" />
                  <span className="truncate text-slate-500">Ketepatan kirim (Target &gt;95%)</span>
                </div>
              </CardFooter>
            </Card>

            {/* Card 2 */}
            <Card className="min-w-0">
              <CardHeader className="gap-1">
                <CardDescription className="truncate text-[10.5px] font-semibold text-slate-500 uppercase tracking-wider">
                  Rata-rata Transit
                </CardDescription>
                <CardTitle className="truncate text-xl font-semibold tabular-nums lg:text-2xl text-slate-800">
                  {analyticsResponse?.avg_delivery_hours || 0} Jam
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="flex w-full min-w-0 items-center gap-1.5 font-medium text-xs">
                  <Clock className="size-4 shrink-0 text-slate-400" />
                  <span className="truncate text-slate-500">Efisiensi waktu tempuh antarkota</span>
                </div>
              </CardFooter>
            </Card>

            {/* Card 3 */}
            <Card className="min-w-0 col-span-2 md:col-span-1">
              <CardHeader className="gap-1">
                <CardDescription className="truncate text-[10.5px] font-semibold text-slate-500 uppercase tracking-wider">
                  Pertumbuhan Bulanan
                </CardDescription>
                <CardTitle className="truncate text-xl font-semibold tabular-nums lg:text-2xl text-slate-800">
                  +{analyticsResponse?.monthly_change_percent || 0}%
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="flex w-full min-w-0 items-center gap-1.5 font-medium text-xs">
                  <TrendingUp className="size-4 shrink-0 text-slate-400" />
                  <span className="truncate text-slate-500">
                    Kenaikan order dibanding bulan lalu
                  </span>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Visual Analytics Charts Grid matching table card wrapper style */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Trend of success deliveries and transit hours */}
            <Card className="border-slate-200 shadow-sm bg-white overflow-hidden flex flex-col justify-between">
              <div>
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-slate-400" /> Tren Produktivitas Bulanan
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Rata-rata waktu transit vs kuantitas paket terkirim.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-2">
                  <ChartContainer config={chartConfig} className="h-72 w-full">
                    <LineChart
                      accessibilityLayer
                      data={lineChartData}
                      margin={{
                        left: 12,
                        right: 12,
                      }}
                    >
                      <CartesianGrid vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                      <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                      <Line
                        dataKey="deliveries"
                        type="natural"
                        stroke="var(--color-deliveries)"
                        strokeWidth={2}
                        dot={({ cx, cy, payload }) => {
                          if (cx == null || cy == null) {
                            return null;
                          }
                          const r = 24;
                          return (
                            <GitCommitVertical
                              key={`${payload.date}-deliveries`}
                              x={cx - r / 2}
                              y={cy - r / 2}
                              width={r}
                              height={r}
                              fill="white"
                              stroke="var(--color-deliveries)"
                            />
                          );
                        }}
                      />
                      <Line
                        dataKey="avg_hours"
                        type="natural"
                        stroke="var(--color-avg_hours)"
                        strokeWidth={2}
                        dot={({ cx, cy, payload }) => {
                          if (cx == null || cy == null) {
                            return null;
                          }
                          const r = 24;
                          return (
                            <GitCommitVertical
                              key={`${payload.date}-hours`}
                              x={cx - r / 2}
                              y={cy - r / 2}
                              width={r}
                              height={r}
                              fill="white"
                              stroke="var(--color-avg_hours)"
                            />
                          );
                        }}
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </div>
              <div className="px-6 pb-6 pt-0 flex flex-col items-start gap-1.5 text-sm">
                <div className="flex gap-1.5 items-center leading-none font-medium text-xs text-slate-700">
                  Performa bulan ini meningkat {analyticsResponse?.monthly_change_percent || 0}%{' '}
                  <TrendingUp className="h-4 w-4 text-slate-400" />
                </div>
                <div className="leading-none text-[10px] text-slate-400 font-medium">
                  Menampilkan total paket terkirim dan rata-rata durasi transit dalam 6 bulan
                  terakhir.
                </div>
              </div>
            </Card>

            {/* Status distributions */}
            <Card className="border-slate-200 shadow-sm bg-white overflow-hidden flex flex-col justify-between">
              <div>
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-slate-400" /> Distribusi Status Paket
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Peta komposisi daur hidup paket yang di-assign seumur hidup.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-2">
                  <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[288px] w-full"
                  >
                    <PieChart>
                      <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                      <Pie
                        data={chartData}
                        dataKey="count"
                        nameKey="status"
                        innerRadius={60}
                        strokeWidth={5}
                      >
                        <Label
                          content={({ viewBox }) => {
                            if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                              return (
                                <text
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                >
                                  <tspan
                                    x={viewBox.cx}
                                    y={viewBox.cy}
                                    className="fill-slate-800 text-3xl font-bold font-sans"
                                  >
                                    {totalPackages.toLocaleString()}
                                  </tspan>
                                  <tspan
                                    x={viewBox.cx}
                                    y={(viewBox.cy || 0) + 20}
                                    className="fill-slate-400 text-[10px] font-bold uppercase tracking-wider font-sans"
                                  >
                                    Total Paket
                                  </tspan>
                                </text>
                              );
                            }
                          }}
                        />
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </div>
              <div className="px-6 pb-6 pt-0 flex flex-col items-start gap-1.5 text-sm">
                <div className="flex gap-1.5 items-center leading-none font-medium text-xs text-slate-700">
                  Mayoritas paket berstatus sukses terkirim{' '}
                  <Award className="h-4 w-4 text-slate-400" />
                </div>
                <div className="leading-none text-[10px] text-slate-400 font-medium">
                  Menampilkan kontribusi status pengiriman paket seumur hidup kurir logistik.
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
