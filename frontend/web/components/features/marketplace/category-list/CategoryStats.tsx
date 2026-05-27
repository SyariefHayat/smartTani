'use client';

import { Folder, CheckCircle2, Boxes, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Category } from './types';

interface CategoryStatsProps {
  categories: Category[];
}

export function CategoryStats({ categories }: CategoryStatsProps) {
  const totalCategories = categories.length;
  const activeCategories = categories.filter((cat) => cat.status === 'active').length;
  const totalProducts = categories.reduce((total, cat) => total + cat.productCount, 0);
  const needsReview = categories.filter((cat) => cat.status !== 'active').length;

  const stats = [
    {
      title: 'Total Kategori',
      value: totalCategories,
      description: 'Semua kategori terdaftar',
      icon: Folder,
      colorClass: 'text-slate-500',
    },
    {
      title: 'Kategori Aktif',
      value: activeCategories,
      description: 'Kategori siap digunakan',
      icon: CheckCircle2,
      colorClass: 'text-green-500',
    },
    {
      title: 'Total Produk',
      value: totalProducts,
      description: 'Produk dalam kategori',
      icon: Boxes,
      colorClass: 'text-blue-500',
    },
    {
      title: 'Perlu Review',
      value: needsReview,
      description: 'Menunggu tinjauan admin',
      icon: AlertCircle,
      colorClass: 'text-amber-500',
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="min-w-0 bg-white">
            <CardHeader className="gap-1">
              <CardDescription className="truncate text-xs">{stat.title}</CardDescription>
              <CardTitle
                className="truncate text-xl font-semibold tabular-nums lg:text-2xl"
                title={String(stat.value)}
              >
                {stat.value}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="flex w-full min-w-0 items-center gap-1 font-medium text-slate-600">
                <Icon className={cn('size-4 shrink-0', stat.colorClass)} />
                <span className="truncate">{stat.description}</span>
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
