'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { marketplaceService, GetProductsParams, Category, Product } from '@/services/marketplace';
import { ProductCard } from '@/components/features/marketplace/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function MarketplacePage() {
  const [params, setParams] = useState<GetProductsParams>({
    page: 1,
    limit: 12,
    search: '',
    category: undefined,
    min_price: undefined,
    max_price: undefined,
  });

  const [debouncedSearch] = useDebounce(params.search, 300);

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => marketplaceService.getCategories(),
  });

  const { data: productsData, isLoading, isError } = useQuery({
    queryKey: ['products', { ...params, search: debouncedSearch }],
    queryFn: () => marketplaceService.getProducts({ ...params, search: debouncedSearch }),
  });

  const updateParam = (key: keyof GetProductsParams, value: string | number | undefined) => {
    setParams((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setParams({
      page: 1,
      limit: 12,
      search: '',
      category: undefined,
      min_price: undefined,
      max_price: undefined,
    });
  };

  const products = productsData?.data?.products || [];
  const pagination = productsData?.data?.pagination || { total: 0, pages: 1 };
  const categories = categoriesData?.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5" />
              Filter
            </h2>
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-500 hover:text-red-500">
              <X className="w-4 h-4 mr-1" />
              Hapus
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Kategori</label>
              <Select 
                value={params.category || 'all'} 
                onValueChange={(val) => updateParam('category', !val || val === 'all' ? undefined : val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Semua Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categories.map((cat: Category) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Harga Minimum</label>
              <Input
                type="number"
                placeholder="Rp 0"
                value={params.min_price || ''}
                onChange={(e) => updateParam('min_price', e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Harga Maksimum</label>
              <Input
                type="number"
                placeholder="Rp 1.000.000"
                value={params.max_price || ''}
                onChange={(e) => updateParam('max_price', e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              className="pl-10 h-12 text-lg"
              placeholder="Cari pupuk, bibit, hasil tani..."
              value={params.search}
              onChange={(e) => updateParam('search', e.target.value)}
            />
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-square rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-20">
              <p className="text-red-500 font-medium">Gagal memuat produk. Silakan coba lagi nanti.</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Muat Ulang
              </Button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">Produk tidak ditemukan.</p>
              <Button variant="outline" onClick={clearFilters} className="mt-4">
                Hapus Semua Filter
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination Placeholder */}
              {pagination.pages > 1 && (
                <div className="mt-12 flex justify-center gap-2">
                  {[...Array(pagination.pages)].map((_, i) => (
                    <Button
                      key={i}
                      variant={params.page === i + 1 ? 'default' : 'outline'}
                      onClick={() => updateParam('page', i + 1)}
                      className={params.page === i + 1 ? 'bg-green-600' : ''}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
