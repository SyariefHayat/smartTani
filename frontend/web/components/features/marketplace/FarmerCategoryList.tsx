'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { useAuthStore } from '@/stores/auth';
import { marketplaceService } from '@/services/marketplace';
import { CategoryHeader } from './category-list/CategoryHeader';
import { CategoryStats } from './category-list/CategoryStats';
import { CategoryTable } from './category-list/CategoryTable';
import { CategoryTips } from './category-list/CategoryTips';
import { Category as UICategory } from './category-list/types';

export function FarmerCategoryList() {
  const user = useAuthStore((s) => s.user);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
    error: errorCategories,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => marketplaceService.getCategories(),
  });

  const {
    data: productsData,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
    error: errorProducts,
  } = useQuery({
    queryKey: ['farmer-products-all', user?.id],
    queryFn: () => marketplaceService.getProducts({ farmer_id: user?.id, limit: 1000 }),
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (isErrorCategories || isErrorProducts) {
      const err = errorCategories || errorProducts;
      toast.error(
        'Gagal memuat data: ' + (err instanceof Error ? err.message : 'Terjadi kesalahan')
      );
    }
  }, [isErrorCategories, isErrorProducts, errorCategories, errorProducts]);

  const categories: UICategory[] = useMemo(() => {
    if (!categoriesData?.data) return [];

    const products = productsData?.data?.products || [];

    return categoriesData.data.map((cat) => {
      const count = products.filter((p) => p.category === cat.name || p.category === cat.id).length;

      return {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        productCount: count,
        status: 'active',
        description: cat.description || `Kategori untuk ${cat.name}`,
        icon: '📦', // default icon as not provided by API
      };
    });
  }, [categoriesData, productsData]);

  const filteredCategories = useMemo(() => {
    return categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  const isLoading = isLoadingCategories || isLoadingProducts;

  return (
    <div className="w-full text-slate-900">
      <div className="mx-auto flex w-full flex-col gap-4">
        <CategoryHeader />

        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Cari nama kategori atau deskripsi..."
                className="h-10 border-slate-200 pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-green-600" />
                <span className="ml-2 text-sm text-slate-500">Memuat statistik...</span>
              </div>
            ) : (
              <CategoryStats categories={categories} />
            )}
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex h-64 w-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white">
            <Loader2 className="mb-2 h-8 w-8 animate-spin text-green-600 opacity-20" />
            <p className="text-sm text-slate-500">Memuat data kategori...</p>
          </div>
        ) : (
          <CategoryTable categories={filteredCategories} />
        )}
        <CategoryTips />
      </div>
    </div>
  );
}
