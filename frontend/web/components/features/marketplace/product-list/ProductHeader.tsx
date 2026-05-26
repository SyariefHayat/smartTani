'use client';

import { Download, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductHeaderProps {
  onExport?: () => void;
  onAddProduct?: () => void;
}

export function ProductHeader({ onExport, onAddProduct }: ProductHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Daftar Produk</h1>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <Button variant="outline" onClick={onExport}>
          <Download /> Export
        </Button>
        <Button onClick={onAddProduct}>
          <Plus /> Tambah Produk
        </Button>
      </div>
    </div>
  );
}
