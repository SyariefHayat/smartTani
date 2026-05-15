'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { DollarSign, Users, ShoppingCart, TrendingUp } from 'lucide-react'
import { OverviewMetrics } from '@/services/analytics'

interface MetricCardsProps {
  metrics?: OverviewMetrics
  loading?: boolean
}

export function MetricCards({ metrics, loading }: MetricCardsProps) {
  const cards = [
    {
      title: 'Total GMV',
      value: metrics ? formatCurrency(metrics.total_gmv) : 'Rp 0',
      icon: DollarSign,
      description: 'Total nilai transaksi sukses',
      color: 'text-green-600',
    },
    {
      title: 'Order Hari Ini',
      value: metrics ? metrics.today_orders.toString() : '0',
      icon: ShoppingCart,
      description: 'Jumlah pesanan baru hari ini',
      color: 'text-blue-600',
    },
    {
      title: 'User Aktif',
      value: metrics ? metrics.active_users.toString() : '0',
      icon: Users,
      description: 'Total pengguna terverifikasi',
      color: 'text-purple-600',
    },
    {
      title: 'Dana Terinvestasi',
      value: metrics ? formatCurrency(metrics.disbursed_investment) : 'Rp 0',
      icon: TrendingUp,
      description: 'Total dana investasi tersalurkan',
      color: 'text-orange-600',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-7 w-24 animate-pulse bg-gray-200 rounded" />
            ) : (
              <>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.description}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
