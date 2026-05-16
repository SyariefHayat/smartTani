'use client';

import Link from 'next/link';
import { Download, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ProductHeader() {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Daftar Produk</h1>
        <p className="text-sm text-muted-foreground">
          Kelola semua produk yang Anda jual di marketplace SmartTani.
        </p>
      </div>
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:w-auto">
        <Button variant="outline" className="bg-background">
          <Download className="mr-2 h-4 w-4" /> Export
        </Button>
        <Link href="/dashboard/farmer/products/new">
          <Button className="w-full bg-green-700 text-white hover:bg-green-800 sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Tambah Produk
          </Button>
        </Link>
      </div>
    </div>
  );
}
