'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', health: 85, yield: 30 },
  { month: 'Feb', health: 88, yield: 32 },
  { month: 'Mar', health: 82, yield: 35 },
  { month: 'Apr', health: 90, yield: 38 },
  { month: 'Mei', health: 92, yield: 42 },
  { month: 'Jun', health: 95, yield: 45 },
];

const chartConfig = {
  health: {
    label: 'Skor Kesehatan',
    color: 'hsl(var(--chart-1))',
  },
  yield: {
    label: 'Estimasi Hasil (Ton)',
    color: 'hsl(var(--chart-2))',
  },
};

export function FarmingTrendsChart() {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle>Tren Pertanian</CardTitle>
        <CardDescription>
          Perkembangan kesehatan tanaman dan estimasi hasil panen 6 bulan terakhir.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-health)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-health)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-yield)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-yield)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tickMargin={10} />
            <YAxis hide />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="health"
              stroke="var(--color-health)"
              fillOpacity={1}
              fill="url(#colorHealth)"
            />
            <Area
              type="monotone"
              dataKey="yield"
              stroke="var(--color-yield)"
              fillOpacity={1}
              fill="url(#colorYield)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
