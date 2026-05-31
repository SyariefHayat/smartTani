'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analytics';
import { useAuthStore } from '@/stores/auth';
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
import { PieChart, Pie, XAxis, CartesianGrid, LineChart, Line, Label } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { TrendingUp, Award, Clock, Activity, BarChart3, PieChartIcon } from 'lucide-react';

const MOCK_ANALYTICS_DATA = {
  avg_roi_percent: 15.6,
  total_invested_projects: 5,
  success_rate_percent: 100,
  avg_duration_days: 110,
  commodity_breakdown: [
    { name: 'Cabai Merah', value: 15000000 },
    { name: 'Tomat', value: 8000000 },
    { name: 'Padi', value: 25000000 },
  ],
  status_breakdown: [
    { name: 'Aktif', value: 2 },
    { name: 'Selesai', value: 3 },
  ],
  roi_trend: [
    { month: 'Des', roi: 12 },
    { month: 'Jan', roi: 13.5 },
    { month: 'Feb', roi: 13.5 },
    { month: 'Mar', roi: 14.2 },
    { month: 'Apr', roi: 15.0 },
    { month: 'Mei', roi: 15.6 },
  ],
};

export default function InvestorAnalyticsPage() {
  const user = useAuthStore((state) => state.user);

  const {
    data: analyticsResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['investor-analytics-charts', user?.id],
    queryFn: () => analyticsService.getInvestorAnalytics(user?.id || ''),
    enabled: !!user?.id,
  });

  const isQueryError = isError;

  React.useEffect(() => {
    if (isQueryError) {
      toast.error('Layanan data analitik offline. Menggunakan data demo lokal.', {
        description: 'Menampilkan data grafik simulasi agar Anda tetap dapat memantau antarmuka.',
        duration: 5000,
      });
    }
  }, [isQueryError]);

  const rawData = isQueryError
    ? MOCK_ANALYTICS_DATA
    : (analyticsResponse as unknown as typeof MOCK_ANALYTICS_DATA) || MOCK_ANALYTICS_DATA;

  // Map fields from backend structure or use fallback fields
  const avgRoi = rawData.avg_roi_percent || MOCK_ANALYTICS_DATA.avg_roi_percent;
  const totalProjects =
    rawData.total_invested_projects || MOCK_ANALYTICS_DATA.total_invested_projects;
  const successRate = rawData.success_rate_percent || MOCK_ANALYTICS_DATA.success_rate_percent;
  const avgDuration = rawData.avg_duration_days || MOCK_ANALYTICS_DATA.avg_duration_days;
  const commodityData = rawData.commodity_breakdown || MOCK_ANALYTICS_DATA.commodity_breakdown;
  const trendData = rawData.roi_trend || MOCK_ANALYTICS_DATA.roi_trend;

  // Helpers and dynamic configs for the donut chart
  const sanitizeKey = React.useCallback((name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '_');
  }, []);

  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      value: {
        label: 'Investasi',
      },
    };

    commodityData.forEach((item: { name: string; value: number }, index: number) => {
      const key = sanitizeKey(item.name);
      config[key] = {
        label: item.name,
        color: `var(--chart-${(index % 5) + 1})`,
      };
    });

    return config;
  }, [commodityData, sanitizeKey]);

  const formattedChartData = React.useMemo(() => {
    return commodityData.map((item: { name: string; value: number }) => {
      const key = sanitizeKey(item.name);
      return {
        commodity: key,
        value: item.value,
        fill: `var(--color-${key})`,
      };
    });
  }, [commodityData, sanitizeKey]);

  const totalInvestment = React.useMemo(() => {
    return commodityData.reduce((acc: number, curr: { value: number }) => acc + curr.value, 0);
  }, [commodityData]);

  const roiChartConfig = React.useMemo(() => {
    return {
      roi: {
        label: 'Rata-rata ROI',
        color: 'var(--chart-2)',
      },
    } satisfies ChartConfig;
  }, []);

  if (isLoading && !isQueryError) {
    return (
      <div className="w-full space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-6 md:grid-cols-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[350px]" />
          <Skeleton className="h-[350px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Analitik Mendalam</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Eksplorasi pembagian modal, trend ROI, dan rasio kesuksesan proyek tani Anda secara
          komprehensif.
        </p>
      </div>

      {/* 4 Performance Metric Cards (Sesuai Gaya Farmer SectionCard) */}
      {isQueryError ? (
        <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
          Gagal memuat data metrik kinerja / Koneksi ke server terputus
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {[
            {
              title: 'Rata-rata ROI',
              value: `+${avgRoi}%`,
              footer: 'Tingkat imbal hasil rata-rata',
              icon: TrendingUp,
              iconColorClass: 'text-green-600',
            },
            {
              title: 'Proyek Didanai',
              value: `${totalProjects} Proyek`,
              footer: 'Total proyek pertanian didanai',
              icon: Activity,
              iconColorClass: 'text-blue-600',
            },
            {
              title: 'Rasio Keberhasilan',
              value: `${successRate}%`,
              footer: 'Tingkat proyek panen lancar',
              icon: Award,
              iconColorClass: 'text-emerald-600',
            },
            {
              title: 'Rata-rata Durasi',
              value: `${avgDuration} Hari`,
              footer: 'Masa perputaran modal',
              icon: Clock,
              iconColorClass: 'text-orange-600',
            },
          ].map((card, index) => {
            const Icon = card.icon;
            return (
              <Card key={index} className="min-w-0">
                <CardHeader className="gap-1">
                  <CardDescription className="truncate text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {card.title}
                  </CardDescription>
                  <CardTitle
                    className="truncate text-xl font-semibold tabular-nums lg:text-2xl text-slate-800"
                    title={card.value}
                  >
                    {card.value}
                  </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                  <div className="flex w-full min-w-0 items-center gap-1 font-medium text-slate-500">
                    <Icon className={`size-4 shrink-0 ${card.iconColorClass}`} />
                    <span className="truncate">{card.footer}</span>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Commodity distribution PieChart */}
        <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden flex flex-col">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
              <PieChartIcon className="h-4.5 w-4.5 text-green-600" />
              Distribusi Modal per Komoditas
            </CardTitle>
            <CardDescription className="text-xs">
              Proporsi alokasi pendanaan berdasarkan komoditas tanaman.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0 p-6 flex items-center justify-center">
            {isQueryError ? (
              <div className="flex h-[280px] w-full items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
                Gagal memuat data distribusi komoditas / Koneksi ke server terputus
              </div>
            ) : (
              <div className="w-full max-w-[340px]">
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto aspect-square max-h-[280px]"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          hideLabel
                          formatter={(value) => (
                            <span className="font-bold text-slate-800">
                              {formatCurrency(Number(value))}
                            </span>
                          )}
                        />
                      }
                    />
                    <Pie
                      data={formattedChartData}
                      dataKey="value"
                      nameKey="commodity"
                      innerRadius={80}
                      outerRadius={105}
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
                                  y={(viewBox.cy || 0) - 4}
                                  className="fill-slate-800 text-lg font-bold tracking-tight lg:text-xl"
                                >
                                  {formatCurrency(totalInvestment)}
                                </tspan>
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 0) + 20}
                                  className="fill-slate-500 text-[10px] font-semibold uppercase tracking-wider md:text-xs"
                                >
                                  Total Modal
                                </tspan>
                              </text>
                            );
                          }
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-2 p-6 pt-0 text-xs">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-2 border-t border-slate-100 pt-4">
              {commodityData.map((item: { name: string; value: number }, index: number) => {
                const key = sanitizeKey(item.name);
                const percent = totalInvestment > 0 ? (item.value / totalInvestment) * 100 : 0;
                return (
                  <div key={key} className="flex items-center gap-1.5">
                    <div
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: `var(--chart-${(index % 5) + 1})` }}
                    />
                    <span className="text-slate-600 font-medium">{item.name}</span>
                    <span className="text-slate-400 font-bold">({percent.toFixed(0)}%)</span>
                  </div>
                );
              })}
            </div>
          </CardFooter>
        </Card>

        {/* ROI line chart trend */}
        <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden flex flex-col">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
              <BarChart3 className="h-4.5 w-4.5 text-green-600" />
              Perkembangan Imbal Hasil (%)
            </CardTitle>
            <CardDescription className="text-xs">
              Rata-rata persentase ROI bulanan dari panen selesai.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-6">
            {isQueryError ? (
              <div className="flex h-64 w-full items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
                Gagal memuat grafik performa ROI / Koneksi ke server terputus
              </div>
            ) : (
              <div className="w-full">
                <ChartContainer config={roiChartConfig} className="w-full h-64 text-xs">
                  <LineChart
                    accessibilityLayer
                    data={trendData}
                    margin={{
                      left: 12,
                      right: 12,
                      top: 10,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => String(value).slice(0, 3)}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          hideLabel
                          formatter={(value) => (
                            <div className="flex items-center gap-1.5 font-medium text-slate-800">
                              <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                              <span>ROI:</span>
                              <span className="font-bold">+{value}%</span>
                            </div>
                          )}
                        />
                      }
                    />
                    <Line
                      dataKey="roi"
                      type="natural"
                      stroke="var(--color-roi)"
                      strokeWidth={3}
                      dot={{
                        fill: 'var(--color-roi)',
                        strokeWidth: 2,
                        r: 4,
                      }}
                      activeDot={{
                        r: 6,
                      }}
                    />
                  </LineChart>
                </ChartContainer>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-2 p-6 pt-0 text-xs text-slate-500 border-t border-slate-100 mt-2">
            <div className="flex items-center gap-2 font-semibold text-slate-600 mt-4">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>
                Peningkatan ROI rata-rata sebesar +{trendData[trendData.length - 1]?.roi}% pada
                bulan terbaru.
              </span>
            </div>
            <div className="text-[10px] font-medium text-slate-400">
              Menampilkan total imbal hasil kumulatif proyek tani yang berhasil.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
