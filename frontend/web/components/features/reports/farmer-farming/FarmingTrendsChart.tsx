'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

interface TrendData {
  month: string;
  health: number;
  yield: number;
}

interface FarmingTrendsChartProps {
  data: TrendData[];
}

const chartConfig = {
  health: {
    label: 'Skor Kesehatan',
    color: '#10b981', // green-500
  },
  yield: {
    label: 'Hasil Panen (Unit)',
    color: '#3b82f6', // blue-500
  },
};

export function FarmingTrendsChart({ data }: FarmingTrendsChartProps) {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-bold">Tren Pertanian</CardTitle>
        <CardDescription>
          Perkembangan kesehatan tanaman dan hasil panen 6 bulan terakhir.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <YAxis hide />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="health"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorHealth)"
            />
            <Area
              type="monotone"
              dataKey="yield"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorYield)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
