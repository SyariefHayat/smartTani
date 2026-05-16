'use client';

import { Button } from '@/components/ui/button';
import { Download, Plus } from 'lucide-react';
import Link from 'next/link';

export function PurchaseHeader() {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Daftar Pembelian</h1>
        <p className="text-muted-foreground">
          Kelola pembelian kebutuhan tani Anda dari supplier dan distributor.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Link href="/marketplace">
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="mr-2 h-4 w-4" />
            Belanja Kebutuhan
          </Button>
        </Link>
      </div>
    </div>
  );
}
