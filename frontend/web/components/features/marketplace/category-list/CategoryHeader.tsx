'use client';

import { Download, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CategoryHeader() {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Kategori Produk</h1>
        <p className="text-sm text-muted-foreground">
          Kelola kategori produk untuk mempermudah pencarian bagi pembeli.
        </p>
      </div>
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:w-auto">
        <Button variant="outline" className="bg-background">
          <Download className="mr-2 h-4 w-4" /> Export
        </Button>
        <Button className="bg-green-700 text-white hover:bg-green-800">
          <Plus className="mr-2 h-4 w-4" /> Tambah Kategori
        </Button>
      </div>
    </div>
  );
}
