'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Sprout, Ruler, Activity, TrendingUp } from 'lucide-react';

export function FarmingReportStats() {
  const stats = [
    {
      label: 'Luas Lahan Aktif',
      value: '12.5 Ha',
      description: '+1.2 Ha dari bulan lalu',
      icon: Ruler,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Tanaman Berjalan',
      value: '8 Jenis',
      description: 'Padi, Jagung, Cabai, dll',
      icon: Sprout,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Skor Kesehatan Rata-rata',
      value: '92/100',
      description: 'Kondisi Sangat Baik',
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      label: 'Estimasi Hasil Panen',
      value: '45.2 Ton',
      description: 'Proyeksi Q2 2024',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-none shadow-sm">
          <CardContent className="flex items-center gap-4 p-4">
            <div className={`rounded-full p-2 ${stat.bgColor}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
              <h3 className="text-lg font-bold">{stat.value}</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">{stat.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
