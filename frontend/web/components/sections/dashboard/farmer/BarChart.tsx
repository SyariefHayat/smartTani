'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, type TooltipProps } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, type ChartConfig } from '@/components/ui/chart';
import { useDateRange } from '@/context/dateRange';
import { useAuthStore } from '@/stores/auth';
import { useFarmerRevenueChart } from '@/hooks/use-farmer-revenue-chart';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

const chartConfig = {
  produk: {
    label: 'Produk Terjual',
    color: 'var(--chart-2)', // Amber
  },
  pendapatan: {
    label: 'Total Pendapatan',
    color: 'var(--chart-1)', // Emerald Green
  },
} satisfies ChartConfig;

type ChartKey = 'produk' | 'pendapatan';

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const value = payload[0].value !== undefined ? payload[0].value : 0;
    const dateFormatted = new Date(label).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const isPendapatan = payload[0].dataKey === 'pendapatan';
    const metricLabel = isPendapatan ? 'Total Pendapatan' : 'Produk Terjual';
    const indicatorColor = isPendapatan ? 'bg-emerald-500' : 'bg-amber-500';

    const formattedValue = isPendapatan
      ? formatCurrency(Number(value))
      : `${Number(value).toLocaleString('id-ID')} unit`;

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

export function ChartBarInteractive() {
  const { date } = useDateRange();
  const user = useAuthStore((s) => s.user);
  const [activeChart, setActiveChart] = React.useState<ChartKey>('produk');

  const params = React.useMemo(() => {
    return {
      from_date: date?.from ? date.from.toISOString().split('T')[0] : undefined,
      to_date: date?.to ? date.to.toISOString().split('T')[0] : undefined,
    };
  }, [date]);

  const { data, isLoading, error } = useFarmerRevenueChart(user?.id, params);

  const chartData = React.useMemo(() => data || [], [data]);

  const total = React.useMemo(
    () => ({
      produk: chartData.reduce((acc, curr) => acc + (Number(curr.produk) || 0), 0),
      pendapatan: chartData.reduce((acc, curr) => acc + (Number(curr.pendapatan) || 0), 0),
    }),
    [chartData]
  );

  if (isLoading) {
    return (
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
    );
  }

  if (error) {
    return (
      <Card className="flex h-100 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500">
        Gagal memuat data grafik pendapatan
      </Card>
    );
  }

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0!">
          <CardTitle className="font-semibold lg:text-xl">Ringkasan Performa</CardTitle>
          <CardDescription>Statistik penjualan produk dan pendapatan harian.</CardDescription>
        </div>
        <div className="flex">
          <button
            data-active={activeChart === 'produk'}
            className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left data-[active=true]:bg-muted/50 sm:border-t-0 sm:border-l sm:px-8 sm:py-6 min-w-56 cursor-pointer hover:bg-muted/20 transition-colors"
            onClick={() => setActiveChart('produk')}
          >
            <span className="text-xs text-muted-foreground">{chartConfig.produk.label}</span>
            <span className="text-base leading-none font-bold sm:text-2xl">
              {total.produk.toLocaleString('id-ID')} unit
            </span>
          </button>
          <button
            data-active={activeChart === 'pendapatan'}
            className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left border-l data-[active=true]:bg-muted/50 sm:border-t-0 sm:border-l sm:px-8 sm:py-6 min-w-56 cursor-pointer hover:bg-muted/20 transition-colors"
            onClick={() => setActiveChart('pendapatan')}
          >
            <span className="text-xs text-muted-foreground">{chartConfig.pendapatan.label}</span>
            <span className="text-base leading-none font-bold sm:text-2xl">
              {formatCurrency(total.pendapatan)}
            </span>
          </button>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        {chartData.length === 0 ? (
          <div className="flex h-62.5 items-center justify-center text-muted-foreground">
            Tidak ada data untuk periode ini
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
                hide={activeChart === 'produk'}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) =>
                  activeChart === 'pendapatan'
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
  );
}
