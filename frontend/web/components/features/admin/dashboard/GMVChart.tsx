'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { OrderAnalyticsData } from '@/services/analytics';

interface GMVChartProps {
  data?: OrderAnalyticsData[];
  loading?: boolean;
}

export function GMVChart({ data, loading }: GMVChartProps) {
  return (
    <Card className="col-span-4 lg:col-span-2">
      <CardHeader>
        <CardTitle>GMV 7 Hari Terakhir</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="h-full w-full animate-pulse bg-gray-100 rounded" />
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString('id-ID', { weekday: 'short' });
                  }}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `Rp${value / 1000000}jt`}
                />
                <Tooltip
                  formatter={(value: string | number) => [
                    formatCurrency(Number(value) || 0),
                    'GMV',
                  ]}
                  labelFormatter={(label) => {
                    return new Date(label).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                    });
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#16a34a"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
