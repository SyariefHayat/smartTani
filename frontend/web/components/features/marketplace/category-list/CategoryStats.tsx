'use client';

import { Category } from './types';

interface CategoryStatsProps {
  categories: Category[];
}

export function CategoryStats({ categories }: CategoryStatsProps) {
  const totalCategories = categories.length;
  const activeCategories = categories.filter((cat) => cat.status === 'active').length;
  const totalProducts = categories.reduce((total, cat) => total + cat.productCount, 0);
  const needsReview = categories.filter((cat) => cat.status !== 'active').length;

  return (
    <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
      <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
          Total Kategori
        </p>
        <p className="mt-1 text-xl font-semibold text-slate-900">
          {totalCategories}
        </p>
      </div>
      <div className="rounded-lg border border-green-100 bg-green-50 p-3">
        <p className="text-[11px] font-medium uppercase tracking-wide text-green-700">
          Kategori Aktif
        </p>
        <p className="mt-1 text-xl font-semibold text-green-800">
          {activeCategories}
        </p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-600">
          Total Produk
        </p>
        <p className="mt-1 text-xl font-semibold text-slate-900">
          {totalProducts}
        </p>
      </div>
      <div className="rounded-lg border border-amber-100 bg-amber-50 p-3">
        <p className="text-[11px] font-medium uppercase tracking-wide text-amber-700">
          Perlu Review
        </p>
        <p className="mt-1 text-xl font-semibold text-amber-800">
          {needsReview}
        </p>
      </div>
    </div>
  );
}
