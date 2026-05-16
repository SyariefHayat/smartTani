'use client';

import { Button } from '@/components/ui/button';

export function EntryHeader() {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">
          Entry Produk Marketplace
        </h1>
        <p className="text-sm text-muted-foreground">
          Tambahkan produk baru ke marketplace SmartTani.
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Button variant="outline" className="bg-background">
          Batal
        </Button>
        <Button className="bg-green-700 text-white hover:bg-green-800">Simpan Draft</Button>
      </div>
    </div>
  );
}
