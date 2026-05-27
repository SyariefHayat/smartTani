'use client';

import { Button } from '@/components/ui/button';
import { RefreshCw, Settings, Plus } from 'lucide-react';

interface SmartFarmingHeaderProps {
  onRefresh?: () => void;
  onConfigure?: () => void;
  onAddDevice?: () => void;
}

export function SmartFarmingHeader({
  onRefresh,
  onConfigure,
  onAddDevice,
}: SmartFarmingHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl text-slate-900">
            Smart Farming IoT
          </h1>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Sistem Aktif
          </span>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Monitor sensor real-time dan kendalikan otomatisasi lahan pertanian Anda secara presisi.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={onRefresh}
          className="cursor-pointer text-xs font-semibold"
        >
          <RefreshCw className="mr-1.5 h-3.5 w-3.5 text-slate-500" />
          Refresh
        </Button>
        <Button
          variant="outline"
          onClick={onConfigure}
          className="cursor-pointer text-xs font-semibold"
        >
          <Settings className="mr-1.5 h-3.5 w-3.5 text-slate-500" />
          Konfigurasi
        </Button>
        <Button
          onClick={onAddDevice}
          className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Hubungkan Alat
        </Button>
      </div>
    </div>
  );
}
