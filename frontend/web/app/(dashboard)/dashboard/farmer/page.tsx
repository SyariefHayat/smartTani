'use client';

import { Download } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import SectionCard from '@/components/sections/dashboard/farmer/SectionCard';
import CustomerReviews from '@/components/sections/dashboard/farmer/CustomerReviews';
import { ChartBarInteractive } from '@/components/sections/dashboard/farmer/BarChart';
import { DataTableDemo } from '@/components/sections/dashboard/farmer/BestSellingProducts';
import { DatePickerWithRange } from '@/components/sections/dashboard/farmer/DatePickerRange';
import { TrackOrderStatus } from '@/components/sections/dashboard/farmer/TrackOrderStatus';
import { DateRangeContext } from '@/context/dateRange';
import { DateRange } from 'react-day-picker';
import { addDays, subDays } from 'date-fns';
import { getStoredAuthUser } from '@/lib/auth-storage';
import { useFarmerAnalytics } from '@/hooks/use-farmer-analytics';
import { exportToCSV } from '@/lib/export-csv';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

export default function FarmerDashboard() {
  const router = useRouter();
  const [user] = useState(() => getStoredAuthUser());
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const { data: analytics } = useFarmerAnalytics(user?.id ?? undefined);

  const handleDownload = useCallback(() => {
    if (!analytics) {
      toast.error('Data belum tersedia, coba lagi nanti');
      return;
    }

    try {
      // Export summary metrics
      const summaryData = [
        { metrik: 'Total Pendapatan', nilai: formatCurrency(analytics.total_revenue || 0) },
        { metrik: 'Pendapatan Bulan Ini', nilai: formatCurrency(analytics.monthly_revenue || 0) },
        { metrik: 'Total Pesanan', nilai: String(analytics.total_orders || 0) },
        { metrik: 'Pesanan Pending', nilai: String(analytics.pending_orders || 0) },
        { metrik: 'Total Produk', nilai: String(analytics.total_products || 0) },
        {
          metrik: 'Perubahan Revenue',
          nilai: `${(analytics.revenue_change_percent || 0).toFixed(1)}%`,
        },
      ];

      exportToCSV({
        data: summaryData,
        columns: [
          { header: 'Metrik', accessor: (row) => row.metrik },
          { header: 'Nilai', accessor: (row) => row.nilai },
        ],
        filename: 'dashboard_petani_ringkasan',
      });

      toast.success('Laporan dashboard berhasil diunduh');
    } catch {
      toast.error('Gagal mengunduh laporan');
    }
  }, [analytics]);

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/dashboard/farmer');
      return;
    }

    if (user.role !== 'petani') {
      const dashboardSegment = user.role ? user.role.replace('_', '-') : '';
      router.push(dashboardSegment ? `/dashboard/${dashboardSegment}` : '/dashboard');
      return;
    }
  }, [router, user]);

  if (!user || user.role !== 'petani') return null;

  return (
    <DateRangeContext.Provider value={{ date, setDate }}>
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Dashboard Petani</h1>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <DatePickerWithRange />
          <Button className="w-full sm:w-auto cursor-pointer" onClick={handleDownload}>
            <Download /> Download
          </Button>
        </div>
      </div>

      <SectionCard />
      <ChartBarInteractive />

      {/* Table + Reviews */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
        <div className="w-full lg:w-[60%]">
          <DataTableDemo className="h-full" />
        </div>
        <div className="w-full lg:w-[40%]">
          <CustomerReviews className="h-full" />
        </div>
      </div>

      {/* Track Order */}
      <TrackOrderStatus />
    </DateRangeContext.Provider>
  );
}
