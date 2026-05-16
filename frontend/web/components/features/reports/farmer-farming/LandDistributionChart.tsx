'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Padi', value: 40, color: 'hsl(var(--chart-1))' },
  { name: 'Jagung', value: 25, color: 'hsl(var(--chart-2))' },
  { name: 'Cabai', value: 15, color: 'hsl(var(--chart-3))' },
  { name: 'Bawang', value: 10, color: 'hsl(var(--chart-4))' },
  { name: 'Lainnya', value: 10, color: 'hsl(var(--chart-5))' },
];

const chartConfig = {
  padi: { label: 'Padi', color: 'hsl(var(--chart-1))' },
  jagung: { label: 'Jagung', color: 'hsl(var(--chart-2))' },
  cabai: { label: 'Cabai', color: 'hsl(var(--chart-3))' },
  bawang: { label: 'Bawang', color: 'hsl(var(--chart-4))' },
  lainnya: { label: 'Lainnya', color: 'hsl(var(--chart-5))' },
};

export function LandDistributionChart() {
  return (
    <Card className="border-none shadow-sm h-full">
      <CardHeader>
        <CardTitle>Distribusi Lahan</CardTitle>
        <CardDescription>Persentase penggunaan lahan berdasarkan jenis tanaman.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-xs font-medium">
                {item.name} ({item.value}%)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
