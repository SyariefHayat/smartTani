'use client';

import { Download, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CategoryHeaderProps {
  onExport?: () => void;
  onAddCategory?: () => void;
}

export function CategoryHeader({ onExport, onAddCategory }: CategoryHeaderProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Kategori Produk</h1>
        <p className="text-sm text-muted-foreground">
          Kelola kategori produk untuk mempermudah pencarian bagi pembeli.
        </p>
      </div>
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:w-auto">
        <Button variant="outline" className="w-full sm:w-auto cursor-pointer" onClick={onExport}>
          <Download /> Export
        </Button>
        <Button className="w-full sm:w-auto cursor-pointer" onClick={onAddCategory}>
          <Plus /> Tambah Kategori
        </Button>
      </div>
    </div>
  );
}
