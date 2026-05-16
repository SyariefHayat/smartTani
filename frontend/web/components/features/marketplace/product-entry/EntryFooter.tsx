'use client';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EntryFooter() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <Button type="button" variant="outline" className="px-6">
        Batal
      </Button>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="button" variant="outline" className="px-6">
          Simpan Draft
        </Button>
        <Button
          type="button"
          className="gap-2 bg-green-700 px-6 text-white hover:bg-green-800"
        >
          Lanjutkan <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
