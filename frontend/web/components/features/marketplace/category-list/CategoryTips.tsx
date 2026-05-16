'use client';

import { Layers, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function CategoryTips() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card className="rounded-xl bg-indigo-50 shadow-sm ring-1 ring-indigo-100">
        <CardContent className="flex gap-4 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
            <Tag className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-indigo-900">Optimalisasi Kategori</h4>
            <p className="mt-1 text-xs leading-relaxed text-indigo-700">
              Gunakan nama kategori yang umum agar pembeli lebih mudah menemukan produk Anda
              melalui fitur filter.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl bg-green-50 shadow-sm ring-1 ring-green-100">
        <CardContent className="flex gap-4 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-green-900">Sub-Kategori</h4>
            <p className="mt-1 text-xs leading-relaxed text-green-700">
              Anda dapat menambahkan sub-kategori untuk klasifikasi produk yang lebih mendalam
              dan terorganisir.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
