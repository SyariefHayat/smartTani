'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { useDateRange } from '@/context/dateRange';
import { useAuthStore } from '@/stores/auth';
import { useFarmerRevenueChart } from '@/hooks/use-farmer-revenue-chart';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

const chartConfig = {
  pendapatan: {
    label: 'Pendapatan',
    color: 'var(--chart-2)',
  },
  pengeluaran: {
    label: 'Pengeluaran',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

type ChartKey = 'pendapatan' | 'pengeluaran';

export function ChartBarInteractive() {
  const { date } = useDateRange();
  const user = useAuthStore((s) => s.user);
  const [activeChart, setActiveChart] = React.useState<ChartKey>('pendapatan');

  const params = React.useMemo(() => {
    return {
      from_date: date?.from ? date.from.toISOString().split('T')[0] : undefined,
      to_date: date?.to ? date.to.toISOString().split('T')[0] : undefined,
    };
  }, [date]);

  const { data, isLoading, error } = useFarmerRevenueChart(user?.id, params);

  const chartData = data || [];

  const total = React.useMemo(
    () => ({
      pendapatan: chartData.reduce((acc, curr) => acc + (Number(curr.pendapatan) || 0), 0),
      pengeluaran: chartData.reduce((acc, curr) => acc + (Number(curr.pengeluaran) || 0), 0),
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
        <CardContent className="px-2 sm:p-6 flex h-[300px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex h-[400px] items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500">
        Gagal memuat data grafik pendapatan
      </Card>
    );
  }

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0!">
          <CardTitle className="font-semibold lg:text-xl">Grafik Pendapatan</CardTitle>
          <CardDescription>
            Menampilkan total pendapatan dan pengeluaran sesuai rentang tanggal
          </CardDescription>
        </div>
        <div className="flex">
          {(['pendapatan', 'pengeluaran'] as ChartKey[]).map((key) => (
            <button
              key={key}
              data-active={activeChart === key}
              className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
              onClick={() => setActiveChart(key)}
            >
              <span className="text-xs text-muted-foreground">{chartConfig[key].label}</span>
              <span className="text-base leading-none font-bold sm:text-2xl">
                {formatCurrency(total[key])}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        {chartData.length === 0 ? (
          <div className="flex h-[250px] items-center justify-center text-muted-foreground">
            Tidak ada data untuk periode ini
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-62.5 w-full">
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
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-44"
                    nameKey={activeChart}
                    formatter={(value) => formatCurrency(value as number)}
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString('id-ID', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    }
                  />
                }
              />
              <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
