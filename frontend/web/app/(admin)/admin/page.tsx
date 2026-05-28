'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  analyticsService,
  OverviewMetrics,
  UserGrowthData,
  OrderAnalyticsData,
} from '@/services/analytics';
import { MetricCards } from '@/components/features/admin/dashboard/MetricCards';
import { GMVChart } from '@/components/features/admin/dashboard/GMVChart';
import { UserGrowthChart } from '@/components/features/admin/dashboard/UserGrowthChart';
import { QuickActions } from '@/components/features/admin/dashboard/QuickActions';
import { AlertsPanel } from '@/components/features/admin/dashboard/AlertsPanel';
import { ActivityFeed } from '@/components/features/admin/dashboard/ActivityFeed';
import { AlertTriangle, TrendingUp, Users, ShoppingCart, DollarSign } from 'lucide-react';

const MOCK_OVERVIEW: OverviewMetrics = {
  total_gmv: 452900000,
  today_gmv: 12500000,
  active_users: 2480,
  today_orders: 45,
  disbursed_investment: 185000000,
  order_breakdown: { pending: 5, processing: 12, shipped: 18, delivered: 10 },
  pending_users: 14,
  pending_proposals: 6,
};

const MOCK_GROWTH: UserGrowthData[] = [
  { date: '2026-05-22', farmer: 12, buyer: 34, investor: 3 },
  { date: '2026-05-23', farmer: 15, buyer: 40, investor: 5 },
  { date: '2026-05-24', farmer: 10, buyer: 28, investor: 2 },
  { date: '2026-05-25', farmer: 18, buyer: 45, investor: 4 },
  { date: '2026-05-26', farmer: 22, buyer: 55, investor: 8 },
  { date: '2026-05-27', farmer: 20, buyer: 48, investor: 6 },
  { date: '2026-05-28', farmer: 25, buyer: 60, investor: 7 },
];

const MOCK_ORDERS: OrderAnalyticsData[] = [
  { date: '2026-05-22', volume: 28, value: 7800000 },
  { date: '2026-05-23', volume: 35, value: 9500000 },
  { date: '2026-05-24', volume: 22, value: 6200000 },
  { date: '2026-05-25', volume: 40, value: 11000000 },
  { date: '2026-05-26', volume: 48, value: 14500000 },
  { date: '2026-05-27', volume: 42, value: 12000000 },
  { date: '2026-05-28', volume: 45, value: 12500000 },
];

export default function AdminDashboardOverviewPage() {
  const [isOffline, setIsOffline] = React.useState(false);

  // Fetch Overview stats
  const { data: overview, isLoading: isOverviewLoading } = useQuery<OverviewMetrics>({
    queryKey: ['admin-overview-metrics'],
    queryFn: async () => {
      try {
        const data = await analyticsService.getOverview();
        return data;
      } catch {
        setIsOffline(true);
        return MOCK_OVERVIEW;
      }
    },
  });

  // Fetch User Growth trend
  const { data: userGrowth, isLoading: isGrowthLoading } = useQuery<UserGrowthData[]>({
    queryKey: ['admin-user-growth-trend'],
    queryFn: async () => {
      try {
        const data = await analyticsService.getUserGrowth(7);
        return data;
      } catch {
        return MOCK_GROWTH;
      }
    },
  });

  // Fetch GMV / Order analytics trend
  const { data: orderAnalytics, isLoading: isOrdersLoading } = useQuery<OrderAnalyticsData[]>({
    queryKey: ['admin-order-analytics-trend'],
    queryFn: async () => {
      try {
        const data = await analyticsService.getOrderAnalytics(7);
        return data;
      } catch {
        return MOCK_ORDERS;
      }
    },
  });

  const isLoading = isOverviewLoading || isGrowthLoading || isOrdersLoading;

  return (
    <div className="w-full space-y-6 text-slate-900 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-1.5 md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Pusat Kendali Admin 🛠️
          </h1>
          <p className="text-xs font-semibold text-slate-500">
            Overview indikator platform, moderasi pengguna, verifikasi proposal, dan status
            pengiriman SmartTani.
          </p>
        </div>
      </div>

      {isOffline && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-800">Modus Simulasi Luring Aktif</h4>
            <p className="text-[11px] font-semibold text-amber-600 mt-0.5">
              Analytics Service sedang tidak terhubung. Seluruh data operasional di bawah ini dimuat
              dari basis simulasi memori browser.
            </p>
          </div>
        </div>
      )}

      {/* 4 KPI Metrics */}
      <MetricCards metrics={overview || MOCK_OVERVIEW} loading={isLoading} />

      {/* Center Layout Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left 2 Columns: Alerts & Quick Actions & Charts */}
        <div className="md:col-span-2 space-y-6">
          {/* Alerts Panel */}
          <AlertsPanel
            pendingUsers={overview?.pending_users || 12}
            pendingProposals={overview?.pending_proposals || 4}
            pendingOrders={3}
            unassignedShipments={2}
          />

          {/* Quick Actions (Verify users & proposals) */}
          <QuickActions metrics={overview || MOCK_OVERVIEW} loading={isLoading} />

          {/* GMV + User Growth Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            <GMVChart data={orderAnalytics || MOCK_ORDERS} loading={isLoading} />
            <UserGrowthChart data={userGrowth || MOCK_GROWTH} loading={isLoading} />
          </div>
        </div>

        {/* Right 1 Column: Activity Feed */}
        <div className="space-y-6">
          <ActivityFeed loading={isLoading} />
        </div>
      </div>
    </div>
  );
}
