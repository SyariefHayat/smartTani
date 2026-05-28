'use client';
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { marketplaceService, Product } from '@/services/marketplace';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AdminStatsCards, AdminStatItem } from '@/components/features/admin/shared/AdminStatsCards';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import {
  Store,
  Eye,
  Search,
  AlertTriangle,
  CheckCircle,
  ShieldAlert,
  Boxes,
  Ban,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const MOCK_PRODUCTS: Product[] = [
  {
    _id: 'prod-1',
    id: 'prod-1',
    farmer_id: 'usr-1',
    title: 'Cabe Rawit Organik Unggul',
    description:
      'Cabe rawit merah segar kualitas premium, dibudidayakan secara organik penuh tanpa pestisida kimia di persawahan Lamongan.',
    category: 'Budidaya',
    price_per_unit: 35000,
    unit: 'kg',
    stock: 150,
    min_stock: 10,
    min_order: 1,
    location: { province: 'Jawa Timur', city: 'Lamongan' },
    images: [],
    status: 'active',
    createdAt: '2026-05-20T08:00:00Z',
    updatedAt: '2026-05-20T08:00:00Z',
    farmer: { id: 'usr-1', full_name: 'Bambang Sugiharto', email: 'petani1@smarttani.com' },
  },
  {
    _id: 'prod-2',
    id: 'prod-2',
    farmer_id: 'usr-1',
    title: 'Pupuk Kompos Fermentasi Matang',
    description:
      'Pupuk kandang organik siap pakai hasil fermentasi EM4. Kaya hara makro and mikro untuk kesuburan tanah perkebunan.',
    category: 'Hama Nabati',
    price_per_unit: 15000,
    unit: 'karung',
    stock: 200,
    min_stock: 20,
    min_order: 5,
    location: { province: 'Jawa Timur', city: 'Lamongan' },
    images: [],
    status: 'active',
    createdAt: '2026-05-22T09:00:00Z',
    updatedAt: '2026-05-22T09:00:00Z',
    farmer: { id: 'usr-1', full_name: 'Bambang Sugiharto', email: 'petani1@smarttani.com' },
  },
  {
    _id: 'prod-3',
    id: 'prod-3',
    farmer_id: 'usr-9',
    title: 'Bibit Cabe Unggul Varietas Bara',
    description:
      'Bibit cabe rawit hibrida tahan layu bakteri and virus gemini. Siap tanam umur 25 hari setelah semai.',
    category: 'Budidaya',
    price_per_unit: 1500,
    unit: 'pohon',
    stock: 1000,
    min_stock: 100,
    min_order: 50,
    location: { province: 'Jawa Tengah', city: 'Boyolali' },
    images: [],
    status: 'pending',
    createdAt: '2026-05-27T10:00:00Z',
    updatedAt: '2026-05-27T10:00:00Z',
    farmer: { id: 'usr-9', full_name: 'Karno Saputro', email: 'petani3@smarttani.com' },
  },
  {
    _id: 'prod-4',
    id: 'prod-4',
    farmer_id: 'usr-9',
    title: 'Pestisida Nabati Ekstrak Mimba',
    description:
      'Cairan pengusir hama wereng, kutu kebul, and ulat grayak berbahan dasar mimba and serai wangi.',
    category: 'Hama Nabati',
    price_per_unit: 45000,
    unit: 'botol',
    stock: 80,
    min_stock: 5,
    min_order: 1,
    location: { province: 'Jawa Tengah', city: 'Boyolali' },
    images: [],
    status: 'active',
    createdAt: '2026-05-25T08:00:00Z',
    updatedAt: '2026-05-25T08:00:00Z',
    farmer: { id: 'usr-9', full_name: 'Karno Saputro', email: 'petani3@smarttani.com' },
  },
];

export default function AdminProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [isOffline, setIsOffline] = React.useState(false);
  const [searchVal, setSearchVal] = React.useState(searchParams.get('search') || '');

  const category = searchParams.get('category') || 'all';
  const status = searchParams.get('status') || 'all';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const search = searchParams.get('search') || '';

  // Initialize localStorage for products
  React.useEffect(() => {
    if (!localStorage.getItem('admin-products')) {
      localStorage.setItem('admin-products', JSON.stringify(MOCK_PRODUCTS));
    }
  }, []);

  // Fetch Products Query
  const { data, isLoading } = useQuery<any>({
    queryKey: ['admin-products-list', category, status, page, search],
    queryFn: async () => {
      try {
        const params: any = {
          page,
          limit: 10,
        };
        if (category !== 'all') params.category = category;
        const res = await marketplaceService.getProducts(params);

        // Manual search & status filter for live database
        let list = res.data.products;
        if (status !== 'all') {
          list = list.filter((p) => p.status === status);
        }
        if (search) {
          list = list.filter(
            (p) =>
              p.title.toLowerCase().includes(search.toLowerCase()) ||
              p.farmer?.full_name?.toLowerCase().includes(search.toLowerCase())
          );
        }

        return {
          products: list,
          pagination: {
            page,
            limit: 10,
            total: list.length,
            pages: Math.ceil(list.length / 10) || 1,
          },
        };
      } catch {
        setIsOffline(true);
        const stored = JSON.parse(localStorage.getItem('admin-products') || '[]');
        let filtered = [...stored];
        if (category !== 'all') {
          filtered = filtered.filter((p) => p.category === category);
        }
        if (status !== 'all') {
          filtered = filtered.filter((p) => p.status === status);
        }
        if (search) {
          filtered = filtered.filter(
            (p) =>
              p.title.toLowerCase().includes(search.toLowerCase()) ||
              p.farmer?.full_name?.toLowerCase().includes(search.toLowerCase())
          );
        }

        return {
          products: filtered.slice((page - 1) * 10, page * 10),
          pagination: {
            page,
            limit: 10,
            total: filtered.length,
            pages: Math.ceil(filtered.length / 10) || 1,
          },
        };
      }
    },
  });

  // Calculate statistics from localStorage
  const stats = React.useMemo(() => {
    const stored = JSON.parse(
      (typeof window !== 'undefined' && localStorage.getItem('admin-products')) ||
        JSON.stringify(MOCK_PRODUCTS)
    );
    const total = stored.length;
    const active = stored.filter((p: any) => p.status === 'active').length;
    const pending = stored.filter(
      (p: any) => p.status === 'pending' || p.status === 'inactive'
    ).length;
    const lowStock = stored.filter((p: any) => p.stock <= p.min_stock).length;
    return { total, active, pending, lowStock };
  }, [data]);

  // Debounce search val to URL
  React.useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchVal) params.set('search', searchVal);
      else params.delete('search');
      params.set('page', '1');
      router.push(`/admin/products?${params.toString()}`);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchVal, router, searchParams]);

  const updateFilters = (newCat: string, newStatus: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newCat === 'all') params.delete('category');
    else params.set('category', newCat);

    if (newStatus === 'all') params.delete('status');
    else params.set('status', newStatus);

    params.set('page', '1');
    router.push(`/admin/products?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/admin/products?${params.toString()}`);
  };

  // Moderate Product mutation
  const moderateMutation = useMutation({
    mutationFn: async ({
      prodId,
      newStatus,
    }: {
      prodId: string;
      newStatus: 'active' | 'inactive';
    }) => {
      try {
        await marketplaceService.updateProductStatus(prodId, newStatus);
      } catch {
        const stored: Product[] = JSON.parse(localStorage.getItem('admin-products') || '[]');
        const updated = stored.map((p) =>
          p._id === prodId ? { ...p, status: newStatus as any } : p
        );
        localStorage.setItem('admin-products', JSON.stringify(updated));
      }
    },
    onSuccess: (_, variables) => {
      toast.success(
        `Listing produk berhasil di-${variables.newStatus === 'active' ? 'aktifkan' : 'tangguhkan'}!`
      );
      queryClient.invalidateQueries({ queryKey: ['admin-products-list'] });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Aktif</Badge>;
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            Pending Review
          </Badge>
        );
      case 'inactive':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Ditangguhkan</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const statCards: AdminStatItem[] = [
    {
      label: 'Total Listing',
      value: stats.total,
      icon: Store,
      color: 'text-slate-700',
      bgColor: 'bg-slate-100',
      description: 'Jumlah produk tani di marketplace',
    },
    {
      label: 'Listing Aktif',
      value: stats.active,
      icon: CheckCircle,
      color: 'text-green-700',
      bgColor: 'bg-green-100',
      description: 'Siap dibeli oleh pelanggan B2C/B2B',
    },
    {
      label: 'Pending Moderasi',
      value: stats.pending,
      icon: Clock,
      color: 'text-amber-700',
      bgColor: 'bg-amber-100',
      description: 'Listing baru menunggu pemeriksaan',
    },
    {
      label: 'Stok Menipis',
      value: stats.lowStock,
      icon: Boxes,
      color: 'text-red-700',
      bgColor: 'bg-red-100',
      description: 'Produk dengan stok di bawah batas minimal',
    },
  ];

  return (
    <div className="w-full space-y-6 text-slate-900 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-1.5 md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Kelola Produk & Listing 📦
          </h1>
          <p className="text-xs font-semibold text-slate-500">
            Kendalikan komoditi produk pertanian, ulas kesesuaian harga dan stok petani, dan
            tangguhkan listing produk bermasalah secara langsung.
          </p>
        </div>
      </div>

      {isOffline && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-800">Modus Simulasi Luring Aktif</h4>
            <p className="text-[11px] font-semibold text-amber-600 mt-0.5">
              Marketplace Service sedang tidak terhubung. Perubahan penangguhan listing produk
              disimpan di database peramban Anda.
            </p>
          </div>
        </div>
      )}

      {/* Stats row */}
      <AdminStatsCards stats={statCards} loading={isLoading} />

      {/* Search and Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Cari nama produk atau petani..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="bg-white border-slate-200 text-xs font-semibold focus:ring-green-500 rounded-xl pl-9.5 h-10 w-full"
            />
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            {/* Category Select */}
            <div className="space-y-1">
              <Select value={category} onValueChange={(val) => updateFilters(val, status)}>
                <SelectTrigger className="w-[160px] bg-white border-slate-200 text-xs rounded-xl focus:ring-green-500 h-10">
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 rounded-xl">
                  <SelectItem value="all" className="text-xs cursor-pointer">
                    Semua Kategori
                  </SelectItem>
                  <SelectItem value="Budidaya" className="text-xs cursor-pointer">
                    Budidaya
                  </SelectItem>
                  <SelectItem value="Hama Nabati" className="text-xs cursor-pointer">
                    Hama Nabati
                  </SelectItem>
                  <SelectItem value="Peralatan" className="text-xs cursor-pointer">
                    Peralatan
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Select */}
            <div className="space-y-1">
              <Select value={status} onValueChange={(val) => updateFilters(category, val)}>
                <SelectTrigger className="w-[160px] bg-white border-slate-200 text-xs rounded-xl focus:ring-green-500 h-10">
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 rounded-xl">
                  <SelectItem value="all" className="text-xs cursor-pointer">
                    Semua Status
                  </SelectItem>
                  <SelectItem value="active" className="text-xs cursor-pointer">
                    Aktif
                  </SelectItem>
                  <SelectItem value="pending" className="text-xs cursor-pointer">
                    Pending Review
                  </SelectItem>
                  <SelectItem value="inactive" className="text-xs cursor-pointer">
                    Ditangguhkan
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Table grid */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50/70 border-b border-slate-100">
            <TableRow>
              <TableHead className="text-xs font-bold text-slate-700 p-4">Nama Produk</TableHead>
              <TableHead className="text-xs font-bold text-slate-700">Petani</TableHead>
              <TableHead className="text-xs font-bold text-slate-700">Kategori</TableHead>
              <TableHead className="text-xs font-bold text-slate-700">Harga Jual</TableHead>
              <TableHead className="text-xs font-bold text-slate-700">Stok</TableHead>
              <TableHead className="text-xs font-bold text-slate-700">Status</TableHead>
              <TableHead className="text-xs font-bold text-slate-700 text-right p-4">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-xs font-semibold text-slate-700">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="p-4">
                    <div className="h-4 bg-slate-100 rounded w-40 animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-slate-100 rounded w-28 animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-slate-100 rounded w-20 animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-slate-100 rounded w-16 animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-slate-100 rounded w-12 animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-slate-100 rounded w-20 animate-pulse" />
                  </TableCell>
                  <TableCell className="text-right p-4">
                    <div className="h-8 bg-slate-100 rounded w-24 ml-auto animate-pulse" />
                  </TableCell>
                </TableRow>
              ))
            ) : data?.products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-slate-400 font-semibold">
                  Tidak ada data produk ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              data?.products.map((prod: Product) => (
                <TableRow key={prod._id} className="hover:bg-slate-50/40 border-b border-slate-100">
                  <TableCell className="p-4 font-bold text-slate-800">{prod.title}</TableCell>
                  <TableCell>{prod.farmer?.full_name || 'Petani Mandiri'}</TableCell>
                  <TableCell>{prod.category}</TableCell>
                  <TableCell>
                    Rp {prod.price_per_unit.toLocaleString('id-ID')} / {prod.unit}
                  </TableCell>
                  <TableCell>
                    <span className={prod.stock <= prod.min_stock ? 'text-red-600 font-bold' : ''}>
                      {prod.stock} {prod.unit}
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(prod.status)}</TableCell>
                  <TableCell className="text-right p-4 space-x-2">
                    <Link href={`/admin/products/${prod._id}`} passHref legacyBehavior>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-slate-600 border-slate-200 hover:bg-slate-50 gap-1 cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" /> Detail
                      </Button>
                    </Link>

                    {prod.status === 'active' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm('Apakah Anda yakin ingin menangguhkan listing produk ini?')) {
                            moderateMutation.mutate({ prodId: prod._id, newStatus: 'inactive' });
                          }
                        }}
                        className="text-red-600 border-red-200 hover:bg-red-50 cursor-pointer"
                      >
                        <Ban className="h-3.5 w-3.5 mr-1" /> Suspend
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm('Aktifkan kembali listing produk ini?')) {
                            moderateMutation.mutate({ prodId: prod._id, newStatus: 'active' });
                          }
                        }}
                        className="text-green-600 border-green-200 hover:bg-green-50 cursor-pointer"
                      >
                        <CheckCircle className="h-3.5 w-3.5 mr-1" /> Aktifkan
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {data && data.pagination.pages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                    if (page > 1) handlePageChange(page - 1);
                  }}
                  className={page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              {[...Array(data.pagination.pages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.preventDefault();
                      handlePageChange(i + 1);
                    }}
                    isActive={page === i + 1}
                    className="cursor-pointer"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                    if (page < data.pagination.pages) handlePageChange(page + 1);
                  }}
                  className={
                    page >= data.pagination.pages
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
