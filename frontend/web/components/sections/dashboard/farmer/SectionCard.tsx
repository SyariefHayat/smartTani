'use client';

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useAuthStore } from '@/stores/auth';
import { useFarmerAnalytics } from '@/hooks/use-farmer-analytics';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const SectionCard = () => {
  const user = useAuthStore((s) => s.user);
  const { data, isLoading, error } = useFarmerAnalytics(user?.id);

  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="min-w-0">
            <CardHeader className="gap-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-full" />
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <Skeleton className="h-4 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500">
        Gagal memuat data statistik
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Pendapatan',
      value: formatCurrency(data?.total_revenue || 0),
      percentage: `${Math.abs(data?.revenue_change_percent || 0).toFixed(1)}%`,
      trend: (data?.revenue_change_percent || 0) >= 0 ? 'up' : ('down' as const),
    },
    {
      title: 'Pendapatan Bulan Ini',
      value: formatCurrency(data?.monthly_revenue || 0),
      percentage: `${Math.abs(data?.revenue_change_percent || 0).toFixed(1)}%`,
      trend: (data?.revenue_change_percent || 0) >= 0 ? 'up' : ('down' as const),
    },
    {
      title: 'Total Pesanan',
      value: (data?.total_orders || 0).toLocaleString('id-ID'),
      percentage: 'Total keseluruhan',
      trend: 'up' as const,
      hideTrendIcon: true,
    },
    {
      title: 'Pesanan Pending',
      value: (data?.pending_orders || 0).toLocaleString('id-ID'),
      percentage: 'Perlu diproses',
      trend: (data?.pending_orders || 0) > 0 ? 'down' : ('up' as const),
      hideTrendIcon: true,
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
      {cards.map((card, index) => {
        const isUp = card.trend === 'up';
        const colorClass = isUp ? 'text-green-500' : 'text-red-500';
        const Icon = isUp ? ArrowUp : ArrowDown;

        return (
          <Card key={index} className="min-w-0">
            <CardHeader className="gap-1">
              <CardDescription className="truncate text-xs">{card.title}</CardDescription>
              <CardTitle
                className="truncate text-xl font-semibold tabular-nums lg:text-2xl"
                title={card.value}
              >
                {card.value}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="flex w-full min-w-0 items-center gap-1 font-medium">
                {!card.hideTrendIcon && <Icon className={`size-4 shrink-0 ${colorClass}`} />}
                <span className="truncate">
                  {!card.hideTrendIcon && <span className={colorClass}>{card.percentage}</span>}
                  {card.hideTrendIcon ? card.percentage : ' dari bulan lalu'}
                </span>
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default SectionCard;
