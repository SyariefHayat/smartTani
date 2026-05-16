'use client';

import { Download } from 'lucide-react';
import { useEffect, useState } from 'react';
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
import { addDays } from 'date-fns';
import { getStoredAuthUser } from '@/lib/auth-storage';

export default function FarmerDashboard() {
  const router = useRouter();
  const [user] = useState(() => getStoredAuthUser());
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 20),
    to: addDays(new Date(new Date().getFullYear(), 0, 20), 20),
  });

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
          <Button className="w-full sm:w-auto">
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
