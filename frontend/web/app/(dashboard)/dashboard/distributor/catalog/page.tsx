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
import { Search, Store, Sprout, MapPin, Layers, AlertTriangle, ArrowUpDown } from 'lucide-react';

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
        return MOCK_PRODUCTS;
      }
    },
  });

  const activeProducts = (products || MOCK_PRODUCTS) as unknown as CatalogProduct[];

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
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Katalog Produk B2B</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Jelajahi komoditas pertanian terbaik dari petani lokal untuk pengadaan grosir bisnis Anda.
        </p>
      </div>

      {isOffline && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-800">Modus Simulasi Luring Aktif</h4>
            <p className="text-[11px] text-amber-600/90 font-medium mt-0.5 leading-relaxed">
              Komoditas dan MOQ produk ditampilkan menggunakan basis data simulasi lokal luring.
            </p>
          </div>
        </div>
      )}

      {/* Filter and Search Panel */}
      <div className="grid gap-4 sm:grid-cols-4 bg-white p-4 border border-slate-200 rounded-xl shadow-sm items-end">
        {/* Search */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Cari Komoditas / Petani
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Cari beras, wortel, Budi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 text-xs font-semibold border-slate-200 focus:border-green-500 w-full"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Kategori
          </label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-10 border-slate-200 text-xs font-semibold focus:border-green-500 w-full cursor-pointer">
              <span className="flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-slate-400" />
                <SelectValue placeholder="Pilih Kategori" />
              </span>
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat} className="text-xs cursor-pointer">
                  {cat === 'all' ? 'Semua Kategori' : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sorting */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Urutkan Berdasarkan
          </label>
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="h-10 border-slate-200 text-xs font-semibold focus:border-green-500 w-full cursor-pointer">
              <span className="flex items-center gap-1.5">
                <ArrowUpDown className="h-4 w-4 text-slate-400" />
                <SelectValue placeholder="Urutkan" />
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest" className="text-xs cursor-pointer">
                Terbaru
              </SelectItem>
              <SelectItem value="price_asc" className="text-xs cursor-pointer">
                Harga: Terendah
              </SelectItem>
              <SelectItem value="price_desc" className="text-xs cursor-pointer">
                Harga: Tertinggi
              </SelectItem>
              <SelectItem value="stock_desc" className="text-xs cursor-pointer">
                Stok Terbanyak
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 text-center bg-white border border-slate-200 rounded-xl shadow-sm">
          <Store className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-xs font-bold text-slate-800">Komoditas tidak ditemukan</h3>
          <p className="mt-1 text-[11px] text-slate-500 font-semibold">
            Coba ubah kata kunci atau ganti filter kategori.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((prod: CatalogProduct) => {
            const isLowStock = prod.stock <= 20;

            return (
              <Card
                key={prod.id}
                className="border-slate-200 hover:border-green-300 shadow-sm bg-white overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all duration-300"
              >
                {/* Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100 border-b border-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={prod.images?.[0] || 'https://placehold.co/600x400?text=Produk+SmartTani'}
                    alt={prod.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="inline-flex items-center rounded-lg bg-green-600 px-2 py-0.5 text-[9.5px] font-bold text-white shadow-sm">
                      {prod.category}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <CardContent className="pt-4 space-y-3.5 flex-1">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-green-600 transition-colors">
                      {prod.title}
                    </h3>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold mt-1">
                      <Sprout className="h-3.5 w-3.5 text-green-600" />
                      <span>
                        Petani:{' '}
                        <span className="font-bold text-slate-700">
                          {prod.farmer?.full_name || 'Petani Mitra'}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Price and MOQ Info */}
                  <div className="flex items-end justify-between bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                        Harga Grosir
                      </span>
                      <span className="text-sm font-bold text-green-600">
                        {formatCurrency(prod.price_per_unit)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {' '}
                        / {prod.unit}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                        Min. Order (MOQ)
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        {prod.min_order} {prod.unit}
                      </span>
                    </div>
                  </div>

                  {/* Stock Level Warning */}
                  <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span>{prod.location?.city || 'Banyuwangi'}</span>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 font-bold ${isLowStock ? 'text-rose-500' : 'text-green-600'}`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${isLowStock ? 'bg-rose-500 animate-pulse' : 'bg-green-500'}`}
                      />
                      Stok: {prod.stock} {prod.unit}
                    </span>
                  </div>
                </CardContent>

                {/* Footer Action */}
                <CardFooter className="pt-2 pb-4 border-t border-slate-50 bg-slate-50/10">
                  <Link href={`/dashboard/distributor/catalog/${prod.id}`} className="block w-full">
                    <Button className="w-full bg-slate-900 hover:bg-green-600 text-white font-bold text-xs h-9 cursor-pointer transition-colors shadow-sm">
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
