'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Cell, Pie, PieChart } from 'recharts';

interface DistributionItem {
  name: string;
  value: number;
  color: string;
}

interface LandDistributionChartProps {
  data: DistributionItem[];
}

export function LandDistributionChart({ data }: LandDistributionChartProps) {
  // Setup config dynamically based on incoming items
  const chartConfig = React.useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {};
    data.forEach((item, idx) => {
      config[`crop_${idx}`] = {
        label: item.name,
        color: item.color,
      };
    });
    return config;
  }, [data]);

  const chartData = React.useMemo(() => {
    return data.map((item, idx) => ({
      name: item.name,
      value: item.value,
      color: item.color,
      fill: item.color,
      key: `crop_${idx}`,
    }));
  }, [data]);

  return (
    <Card className="border-none shadow-sm h-full">
      <CardHeader>
        <CardTitle className="text-base font-bold">Distribusi Lahan</CardTitle>
        <CardDescription>Persentase penggunaan lahan berdasarkan komoditas.</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[200px] flex-col items-center justify-center text-sm text-muted-foreground">
            Tidak ada data distribusi lahan aktif.
          </div>
        ) : (
          <>
            <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[200px]">
              <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  strokeWidth={5}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {data.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-medium truncate max-w-[120px]">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

import * as React from 'react';
