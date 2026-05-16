'use client';

import { Button } from '@/components/ui/button';
import { FileText, Filter, Calendar } from 'lucide-react';

export function FarmingReportHeader() {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Laporan Pertanian</h1>
        <p className="text-muted-foreground">
          Analisis performa lahan, kesehatan tanaman, dan estimasi hasil panen.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Calendar className="mr-2 h-4 w-4" />
          Mei 2024
        </Button>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
        <Button className="bg-slate-900 text-white hover:bg-slate-800" size="sm">
          <FileText className="mr-2 h-4 w-4" />
          Buat Laporan Baru
        </Button>
      </div>
    </div>
  );
}
