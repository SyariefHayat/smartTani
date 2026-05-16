'use client';

import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface PromotionFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export function PromotionFilters({
  searchTerm,
  setSearchTerm,
  activeTab,
  setActiveTab,
}: PromotionFiltersProps) {
  return (
    <div className="flex w-full flex-col gap-3 lg:w-auto">
      <div className="flex flex-wrap items-center gap-1 rounded-xl border bg-slate-50/70 p-1">
        {[
          { id: 'all', label: 'Semua' },
          { id: 'active', label: 'Aktif' },
          { id: 'scheduled', label: 'Terjadwal' },
          { id: 'expired', label: 'Berakhir' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              activeTab === tab.id
                ? 'bg-green-600 text-white'
                : 'text-slate-500 hover:bg-white hover:text-slate-700'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="relative w-full lg:w-80">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Cari nama atau kode promo..."
          className="h-10 border-slate-200 bg-white pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
}
