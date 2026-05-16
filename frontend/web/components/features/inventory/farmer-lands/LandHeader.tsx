'use client';

import { Button } from '@/components/ui/button';
import { Download, Plus } from 'lucide-react';

export function LandHeader() {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Lahan & Tanaman</h1>
        <p className="text-muted-foreground">
          Pantau kondisi lahan dan jadwal tanam hingga masa panen.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          Daftarkan Lahan
        </Button>
      </div>
    </div>
  );
}
