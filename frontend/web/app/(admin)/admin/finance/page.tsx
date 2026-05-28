'use client';
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analytics';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AdminStatsCards, AdminStatItem } from '@/components/features/admin/shared/AdminStatsCards';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { toast } from 'sonner';
import {
  Wallet,
  DollarSign,
  ArrowUpRight,
  TrendingUp,
  HelpCircle,
  FileText,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import Link from 'next/link';

const MOCK_REVENUE = {
  total_revenue: 45000000,
  monthly_revenue: 8500000,
  revenue_change_percent: 12.3,
  total_gmv: 1200000000,
  total_disbursement: 1100000000,
  revenue_trend: [
    { month: 'Jan', marketplace_fee: 3000000, investment_fee: 500000, academy_fee: 0 },
    { month: 'Feb', marketplace_fee: 4500000, investment_fee: 800000, academy_fee: 200000 },
    { month: 'Mar', marketplace_fee: 5000000, investment_fee: 1000000, academy_fee: 500000 },
    { month: 'Apr', marketplace_fee: 6500000, investment_fee: 1200000, academy_fee: 800000 },
    { month: 'Mei', marketplace_fee: 8500000, investment_fee: 1500000, academy_fee: 1200000 },
  ],
  revenue_breakdown: [
    { name: 'Marketplace Fee (5%)', value: 35000000, color: '#10b981' },
    { name: 'Investment Fee (2%)', value: 8000000, color: '#6366f1' },
    { name: 'Academy Fee (10%)', value: 2000000, color: '#f59e0b' },
  ],
};

export default function AdminFinancePage() {
  const [isOffline, setIsOffline] = React.useState(false);

  // Fetch Platform Revenue details Query
  const { data = MOCK_REVENUE, isLoading } = useQuery<any>({
    queryKey: ['admin-finance-revenue-stats'],
    queryFn: async () => {
      try {
        const res = await analyticsService.getPlatformRevenue();

        // Format breakdown for PieChart from API record
        const breakdown = [
          {
            name: 'Marketplace Fee (5%)',
            value: (res as any).revenue_breakdown?.marketplace || 35000000,
            color: '#10b981',
          },
          {
            name: 'Investment Fee (2%)',
            value: (res as any).revenue_breakdown?.investment || 8000000,
            color: '#6366f1',
          },
          {
            name: 'Academy Fee (10%)',
            value: (res as any).revenue_breakdown?.academy || 2000000,
            color: '#f59e0b',
          },
        ];

        return {
          ...res,
          revenue_breakdown: breakdown,
        };
      } catch {
        setIsOffline(true);
        return MOCK_REVENUE;
      }
    },
  });

  const statCards: AdminStatItem[] = [
    {
      label: 'Pendapatan Platform',
      value: `Rp ${data.total_revenue.toLocaleString('id-ID')}`,
      icon: DollarSign,
      color: 'text-green-700',
      bgColor: 'bg-green-100',
      description: 'Akumulasi seluruh biaya platform',
    },
    {
      label: 'Bulan Ini',
      value: `Rp ${data.monthly_revenue.toLocaleString('id-ID')}`,
      icon: TrendingUp,
      color: 'text-blue-700',
      bgColor: 'bg-blue-100',
      description: `+${data.revenue_change_percent}% dari bulan lalu`,
    },
    {
      label: 'Total GMV Sukses',
      value: `Rp ${data.total_gmv.toLocaleString('id-ID')}`,
      icon: ArrowUpRight,
      color: 'text-purple-700',
      bgColor: 'bg-purple-100',
      description: 'Perputaran uang bruto ekosistem',
    },
    {
      label: 'Total Pencairan Petani',
      value: `Rp ${data.total_disbursement.toLocaleString('id-ID')}`,
      icon: Wallet,
      color: 'text-orange-700',
      bgColor: 'bg-orange-100',
      description: 'Dana tersalurkan pasca-potong fee',
    },
  ];

  return (
    <div className="w-full space-y-6 text-slate-900 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-1.5 md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Arus Keuangan Platform 💰
          </h1>
          <p className="text-xs font-semibold text-slate-500">
            Monitoring perputaran kas bruto GMV, tinjau komisi fee dari setiap sub-layanan
            SmartTani, and awasi pencairan dana petani secara transparan.
          </p>
        </div>
        <div>
          <Link href="/admin/finance/transactions" passHref legacyBehavior>
            <Button
              size="sm"
              className="bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold gap-1.5 cursor-pointer shadow-sm"
            >
              <FileText className="h-4 w-4" /> Lihat Log Transaksi
            </Button>
          </Link>
        </div>
      </div>

      {isOffline && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-800">Modus Simulasi Luring Aktif</h4>
            <p className="text-[11px] font-semibold text-amber-600 mt-0.5">
              Analytics Service sedang tidak terhubung. Seluruh grafik and rasio bagi hasil dimuat
              secara luring.
            </p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <AdminStatsCards stats={statCards} loading={isLoading} />

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Line Chart: Revenue Trend */}
        <Card className="md:col-span-2 border-slate-200 bg-white rounded-2xl shadow-sm overflow-hidden">
          <CardHeader className="pb-2 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-800">
              Tren Pendapatan Komisi Bulanan
            </CardTitle>
            <CardDescription className="text-[10px] font-semibold text-slate-400">
              Arus komisi terkumpul per sub-layanan SmartTani
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data.revenue_trend}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="month"
                    stroke="#94a3b8"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      fontFamily: 'sans-serif',
                      fontSize: '11px',
                      fontWeight: 'bold',
                    }}
                    formatter={(value: any) => [`Rp ${value.toLocaleString('id-ID')}`]}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '10px' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="marketplace_fee"
                    name="Marketplace Fee"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="investment_fee"
                    name="Investment Fee"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="academy_fee"
                    name="Academy Fee"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart: Revenue Breakdown */}
        <Card className="border-slate-200 bg-white rounded-2xl shadow-sm overflow-hidden">
          <CardHeader className="pb-2 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-800">
              Rasio Kontribusi Keuangan
            </CardTitle>
            <CardDescription className="text-[10px] font-semibold text-slate-400">
              Proporsi kontribusi fee per layanan
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 flex flex-col items-center justify-center">
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.revenue_breakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {data.revenue_breakdown.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      fontSize: '10px',
                      fontWeight: 'bold',
                    }}
                    formatter={(value: any) => [`Rp ${value.toLocaleString('id-ID')}`]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Legend */}
            <div className="w-full space-y-2 mt-4 text-[10px] font-bold text-slate-600">
              {data.revenue_breakdown.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="text-slate-800">Rp {item.value.toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
