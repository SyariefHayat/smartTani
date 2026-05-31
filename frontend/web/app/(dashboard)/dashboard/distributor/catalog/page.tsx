'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { marketplaceService } from '@/services/marketplace';
import { formatCurrency } from '@/lib/utils';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Store, Sprout, MapPin, Layers, ArrowUpDown } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MOCK_PRODUCTS = [
  {
    id: 'prod-001',
    title: 'Beras Pandan Wangi Organik',
    price_per_unit: 18000,
    unit: 'kg',
    stock: 500,
    min_order: 100, // MOQ
    images: ['https://placehold.co/600x400?text=Beras+Pandan+Wangi'],
    category: 'Biji-bijian & Kacang',
    location: { city: 'Banyuwangi', province: 'Jawa Timur' },
    farmer: { full_name: 'Budi Santoso' },
  },
  {
    id: 'prod-002',
    title: 'Wortel Brastagi Segar',
    price_per_unit: 8000,
    unit: 'kg',
    stock: 400,
    min_order: 50,
    images: ['https://placehold.co/600x400?text=Wortel+Brastagi'],
    category: 'Sayuran',
    location: { city: 'Medan', province: 'Sumatera Utara' },
    farmer: { full_name: 'Agus Salim' },
  },
  {
    id: 'prod-003',
    title: 'Cabai Rawit Merah Super',
    price_per_unit: 45000,
    unit: 'kg',
    stock: 10, // low stock
    min_order: 5,
    images: ['https://placehold.co/600x400?text=Cabai+Rawit'],
    category: 'Rempah & Bumbu',
    location: { city: 'Garut', province: 'Jawa Barat' },
    farmer: { full_name: 'Siti Aminah' },
  },
  {
    id: 'prod-004',
    title: 'Kentang Dieng Super',
    price_per_unit: 12000,
    unit: 'kg',
    stock: 350,
    min_order: 100,
    images: ['https://placehold.co/600x400?text=Kentang+Dieng'],
    category: 'Umbi-umbian',
    location: { city: 'Wonosobo', province: 'Jawa Tengah' },
    farmer: { full_name: 'Budi Santoso' },
  },
  {
    id: 'prod-005',
    title: 'Susu Sapi Segar Murni',
    price_per_unit: 10000,
    unit: 'liter',
    stock: 15,
    min_order: 10,
    images: ['https://placehold.co/600x400?text=Susu+Segar'],
    category: 'Hasil Ternak',
    location: { city: 'Boyolali', province: 'Jawa Tengah' },
    farmer: { full_name: 'Agus Salim' },
  },
  {
    id: 'prod-006',
    title: 'Bawang Merah Brebes Super',
    price_per_unit: 25000,
    unit: 'kg',
    stock: 600,
    min_order: 100,
    images: ['https://placehold.co/600x400?text=Bawang+Brebes'],
    category: 'Rempah & Bumbu',
    location: { city: 'Brebes', province: 'Jawa Tengah' },
    farmer: { full_name: 'Siti Aminah' },
  },
];

interface CatalogProduct {
  id: string;
  title: string;
  price_per_unit: number;
  unit: string;
  stock: number;
  min_order: number;
  images?: string[];
  category: string;
  location?: { city?: string; province?: string };
  farmer?: { full_name?: string };
}

export default function DistributorCatalogPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('all');
  const [sortOption, setSortOption] = React.useState('newest');
  const [isOffline, setIsOffline] = React.useState(false);

  // Fetch products
  const { data: products, isLoading } = useQuery({
    queryKey: ['distributor-catalog-products'],
    queryFn: async () => {
      try {
        const res = (await marketplaceService.getProducts({})) as unknown as Record<
          string,
          unknown
        >;
        const resData = res.data as Record<string, unknown> | undefined;
        const productsArr = (resData?.products ||
          res.products ||
          (Array.isArray(res) ? res : [])) as Record<string, unknown>[];
        // Enrich products with mock MOQ if not present
        const enriched = productsArr.map((p: Record<string, unknown>, idx: number) => ({
          ...p,
          min_order: p.min_order || (idx % 2 === 0 ? 100 : 50),
          farmer: p.farmer || { full_name: 'Petani Mitra' },
        }));
        if (!enriched || enriched.length === 0) throw new Error('Empty');
        return enriched;
      } catch {
        setIsOffline(true);
        return [];
      }
    },
  });

  const activeProducts = (products || []) as unknown as CatalogProduct[];

  // Filter and sort products
  const filteredProducts = activeProducts
    .filter((prod: CatalogProduct) => {
      const matchesSearch =
        prod.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (prod.farmer?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase());

      if (categoryFilter === 'all') return matchesSearch;
      return matchesSearch && prod.category === categoryFilter;
    })
    .sort((a: CatalogProduct, b: CatalogProduct) => {
      if (sortOption === 'price_asc') return a.price_per_unit - b.price_per_unit;
      if (sortOption === 'price_desc') return b.price_per_unit - a.price_per_unit;
      if (sortOption === 'stock_desc') return b.stock - a.stock;
      return 0; // default newest/unsorted
    });

  const categories = [
    'all',
    'Biji-bijian & Kacang',
    'Sayuran',
    'Rempah & Bumbu',
    'Umbi-umbian',
    'Hasil Ternak',
  ];

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl text-slate-900">
            Katalog Produk B2B
          </h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Jelajahi komoditas pertanian terbaik dari petani lokal untuk pengadaan grosir bisnis
            Anda.
          </p>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <div className="grid gap-4 sm:grid-cols-4 bg-white p-4 border border-slate-200/60 rounded-2xl shadow-xs items-end">
        {/* Search */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Cari Komoditas / Petani
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Cari beras, wortel, Budi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 text-xs font-semibold border-slate-200 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500 w-full rounded-xl"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Kategori
          </label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-10 border-slate-200 text-xs font-semibold focus:border-emerald-500 w-full cursor-pointer rounded-xl">
              <span className="flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-slate-400" />
                <SelectValue placeholder="Pilih Kategori" />
              </span>
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat} className="text-xs cursor-pointer rounded-lg">
                  {cat === 'all' ? 'Semua Kategori' : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sorting */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Urutkan Berdasarkan
          </label>
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="h-10 border-slate-200 text-xs font-semibold focus:border-emerald-500 w-full cursor-pointer rounded-xl">
              <span className="flex items-center gap-1.5">
                <ArrowUpDown className="h-4 w-4 text-slate-400" />
                <SelectValue placeholder="Urutkan" />
              </span>
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="newest" className="text-xs cursor-pointer rounded-lg">
                Terbaru
              </SelectItem>
              <SelectItem value="price_asc" className="text-xs cursor-pointer rounded-lg">
                Harga: Terendah
              </SelectItem>
              <SelectItem value="price_desc" className="text-xs cursor-pointer rounded-lg">
                Harga: Tertinggi
              </SelectItem>
              <SelectItem value="stock_desc" className="text-xs cursor-pointer rounded-lg">
                Stok Terbanyak
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isOffline ? (
        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
          Gagal memuat katalog produk B2B / Koneksi ke server terputus
        </div>
      ) : isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <Card
              key={n}
              className="border-slate-100 shadow-xs bg-white overflow-hidden rounded-2xl p-4 space-y-4"
            >
              <Skeleton className="h-44 w-full rounded-xl" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-14 w-full rounded-xl" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <Skeleton className="h-9 w-full rounded-xl" />
            </Card>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-16 text-center bg-white border border-slate-200/60 rounded-2xl shadow-xs">
          <div className="mx-auto h-14 w-14 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
            <Store className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="mt-4 text-sm font-bold text-slate-800">Komoditas tidak ditemukan</h3>
          <p className="mt-1 text-xs text-slate-500 font-medium max-w-xs mx-auto">
            Coba ubah kata kunci pencarian atau ganti kategori filter untuk menemukan produk grosir
            yang sesuai.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((prod: CatalogProduct) => {
            const isLowStock = prod.stock <= 20;

            return (
              <Card
                key={prod.id}
                className="border-slate-100 hover:border-emerald-500/30 shadow-xs hover:shadow-lg hover:shadow-emerald-500/5 bg-white overflow-hidden flex flex-col justify-between group rounded-2xl transition-all duration-300 relative"
              >
                {/* Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100 border-b border-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={prod.images?.[0] || 'https://placehold.co/600x400?text=Produk+SmartTani'}
                    alt={prod.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center rounded-full bg-emerald-50/90 backdrop-blur-xs border border-emerald-200/50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 shadow-xs">
                      {prod.category}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <CardContent className="pt-4 px-4 pb-0 space-y-4 flex-1">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-emerald-600 transition-colors leading-snug">
                      {prod.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mt-2">
                      <div className="h-5 w-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100/50">
                        <Sprout className="h-3 w-3 text-emerald-600" />
                      </div>
                      <span>
                        Petani:{' '}
                        <span className="font-semibold text-slate-700">
                          {prod.farmer?.full_name || 'Petani Mitra'}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Price and MOQ Info (Ticket-like design) */}
                  <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100/80 relative overflow-hidden grid grid-cols-2 gap-2 divide-x divide-slate-200/80">
                    <div className="pr-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                        Harga Grosir
                      </span>
                      <div className="mt-0.5 flex items-baseline gap-0.5">
                        <span className="text-base font-extrabold text-emerald-600">
                          {formatCurrency(prod.price_per_unit)}
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase">
                          /{prod.unit}
                        </span>
                      </div>
                    </div>
                    <div className="pl-3">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                        Min. Order (MOQ)
                      </span>
                      <div className="mt-0.5">
                        <span className="text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200/60 shadow-xs inline-block">
                          {prod.min_order} {prod.unit}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stock Level and Location (Capsules) */}
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-slate-100 bg-slate-50/50 text-[10px] font-semibold text-slate-500">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      <span>{prod.location?.city || 'Banyuwangi'}</span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${
                        isLowStock
                          ? 'bg-rose-50 text-rose-700 border-rose-100'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isLowStock ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'
                        }`}
                      />
                      Stok: {prod.stock} {prod.unit}
                    </span>
                  </div>
                </CardContent>

                {/* Footer Action */}
                <CardFooter className="pt-4 pb-4 px-4 border-t border-slate-50 bg-slate-50/10">
                  <Link href={`/dashboard/distributor/catalog/${prod.id}`} className="block w-full">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9.5 rounded-xl cursor-pointer transition-all duration-300 shadow-xs hover:shadow-md active:scale-98">
                      Pesan Grosir Sekarang
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
