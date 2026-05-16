'use client';

import { Plus } from 'lucide-react';

export function SidebarPreview() {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Preview Produk
      </h2>
      <div className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-slate-50 p-8 text-center text-muted-foreground">
        <div className="flex h-16 w-16 items-center justify-center rounded bg-slate-200/50">
          <Plus className="h-8 w-8 text-slate-400" />
        </div>
        <p className="text-xs">Belum ada gambar</p>
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-[10px] font-semibold uppercase text-muted-foreground">
            Nama Produk
          </p>
          <p className="text-sm font-medium">-</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase text-muted-foreground">
              Kategori
            </p>
            <p className="text-sm">-</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase text-muted-foreground">
              Harga
            </p>
            <p className="text-sm">-</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase text-muted-foreground">
              Stok
            </p>
            <p className="text-sm">-</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase text-muted-foreground">
              Rating
            </p>
            <p className="text-sm text-yellow-500">☆☆☆☆☆ (0)</p>
          </div>
        </div>
      </div>
      <p className="text-center text-[10px] italic text-muted-foreground">
        Preview akan tersedia setelah semua informasi diisi.
      </p>
    </div>
  );
}
