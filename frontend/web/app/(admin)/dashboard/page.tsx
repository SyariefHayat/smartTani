'use client'

import { useEffect, useState } from 'react'
import { analyticsService, OverviewMetrics, UserGrowthData, OrderAnalyticsData } from '@/services/analytics'
import { MetricCards } from '@/components/features/admin/dashboard/MetricCards'
import { GMVChart } from '@/components/features/admin/dashboard/GMVChart'
import { UserGrowthChart } from '@/components/features/admin/dashboard/UserGrowthChart'
import { QuickActions } from '@/components/features/admin/dashboard/QuickActions'
import { toast } from 'sonner'

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<OverviewMetrics>()
  const [userGrowth, setUserGrowth] = useState<UserGrowthData[]>([])
  const [orderAnalytics, setOrderAnalytics] = useState<OrderAnalyticsData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [m, u, o] = await Promise.all([
          analyticsService.getOverview(),
          analyticsService.getUserGrowth(7),
          analyticsService.getOrderAnalytics(7),
        ])
        setMetrics(m)
        setUserGrowth(u)
        setOrderAnalytics(o)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
        toast.error('Gagal memuat data dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
      </div>
      
      <MetricCards metrics={metrics} loading={loading} />

      <QuickActions metrics={metrics} loading={loading} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <GMVChart data={orderAnalytics} loading={loading} />
        <UserGrowthChart data={userGrowth} loading={loading} />
      </div>
    </div>
  )
}
