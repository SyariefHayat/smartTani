'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Settings, Plus } from 'lucide-react';

export function SmartFarmingHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Smart Farming</h1>
          <Badge variant="success" className="animate-pulse">
            Sistem Aktif
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Monitor sensor real-time dan kendalikan otomatisasi lahan Anda.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
        <Button variant="outline" size="sm">
          <Settings className="mr-2 h-4 w-4" />
          Konfigurasi
        </Button>
        <Button className="bg-green-600 hover:bg-green-700" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Tambah Alat
        </Button>
      </div>
    </div>
  );
}
