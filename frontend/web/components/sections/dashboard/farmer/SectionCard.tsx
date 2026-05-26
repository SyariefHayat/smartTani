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

  const hasPrevRevenue =
    data?.prev_month_revenue !== undefined && Number(data.prev_month_revenue) > 0;
  const revenueChange = hasPrevRevenue ? data?.revenue_change_percent || 0 : 0;

  const cards = [
    {
      title: 'Total Penjualan',
      value: formatCurrency(data?.total_revenue || 0),
      hasCompare: hasPrevRevenue,
      change: revenueChange,
      footer: hasPrevRevenue
        ? `${revenueChange >= 0 ? 'Naik' : 'Turun'} dari bulan lalu`
        : 'dari bulan lalu',
    },
    {
      title: 'Total Pesanan',
      value: (data?.total_orders || 0).toLocaleString('id-ID'),
      hasCompare: false, // Defaulting to false as backend doesn't provide prev month order count yet
      change: 0,
      footer: 'dari bulan lalu',
    },
    {
      title: 'Total Produk',
      value: (data?.total_products || 0).toLocaleString('id-ID'),
      hasCompare: false,
      change: 0,
      footer: 'dari bulan lalu',
    },
    {
      title: 'Total Pelanggan',
      value: (data?.total_customers || 0).toLocaleString('id-ID'),
      hasCompare: false,
      change: 0,
      footer: 'dari bulan lalu',
    },
  ] as const;

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
      {cards.map((card, index) => {
        const hasCompare = card.hasCompare;
        const isUp = card.change > 0;
        const isDown = card.change < 0;

        let colorClass = 'text-muted-foreground';
        let Icon = null;
        let percentageText = '0.0%';

        if (hasCompare) {
          colorClass = isUp ? 'text-green-500' : isDown ? 'text-red-500' : 'text-muted-foreground';
          Icon = isUp ? ArrowUp : isDown ? ArrowDown : null;
          percentageText = `${Math.abs(card.change).toFixed(1)}%`;
        }

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
                {Icon && <Icon className={`size-4 shrink-0 ${colorClass}`} />}
                <span className="truncate">
                  <span className={colorClass}>{percentageText} </span>
                  <span className="text-muted-foreground">{card.footer}</span>
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
