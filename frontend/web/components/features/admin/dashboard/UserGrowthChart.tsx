'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserGrowthData } from '@/services/analytics'

interface UserGrowthChartProps {
  data?: UserGrowthData[]
  loading?: boolean
}

export function UserGrowthChart({ data, loading }: UserGrowthChartProps) {
  return (
    <Card className="col-span-4 lg:col-span-2">
      <CardHeader>
        <CardTitle>Pengguna Baru per Role</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="h-full w-full animate-pulse bg-gray-100 rounded" />
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString('id-ID', { weekday: 'short' })
                  }}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  labelFormatter={(label) => {
                    return new Date(label).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                    })
                  }}
                />
                <Legend />
                <Bar
                  dataKey="farmer"
                  name="Petani"
                  fill="#16a34a"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="buyer"
                  name="Buyer"
                  fill="#2563eb"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="investor"
                  name="Investor"
                  fill="#9333ea"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
