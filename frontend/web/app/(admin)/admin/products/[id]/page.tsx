'use client';
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { marketplaceService, Product } from '@/services/marketplace';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  ChevronLeft,
  Store,
  MapPin,
  Tag,
  User,
  ShoppingBag,
  CheckCircle,
  Ban,
  AlertTriangle,
  Mail,
  Boxes,
  Star,
} from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AdminProductDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = React.use(params);
  const queryClient = useQueryClient();

  const [isOffline, setIsOffline] = React.useState(false);

  // Fetch product detail query
  const { data: product, isLoading } = useQuery<any>({
    queryKey: ['admin-product-detail', id],
    queryFn: async () => {
      try {
        const res = await marketplaceService.getProductById(id);
        return res.data;
      } catch {
        setIsOffline(true);
        // Fallback from localStorage
        const stored = JSON.parse(localStorage.getItem('admin-products') || '[]');
        const found = stored.find((p: any) => p._id === id);

        if (!found) throw new Error('Product not found');

        return found;
      }
    },
  });

  // Moderate product status mutation
  const moderateMutation = useMutation({
    mutationFn: async (newStatus: 'active' | 'inactive') => {
      try {
        await marketplaceService.updateProductStatus(id, newStatus);
      } catch {
        // Offline persistent
        const stored: Product[] = JSON.parse(localStorage.getItem('admin-products') || '[]');
        const updated = stored.map((p) => (p._id === id ? { ...p, status: newStatus as any } : p));
        localStorage.setItem('admin-products', JSON.stringify(updated));
      }
    },
    onSuccess: (_, variables) => {
      toast.success(
        `Listing produk ini berhasil di-${variables === 'active' ? 'aktifkan' : 'suspend'}!`
      );
      queryClient.invalidateQueries({ queryKey: ['admin-product-detail', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-products-list'] });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Aktif</Badge>;
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Pending Review</Badge>
        );
      case 'inactive':
        return <Badge className="bg-red-100 text-red-700 border-red-200">Ditangguhkan</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const mockReviews = [
    {
      id: 'rev-1',
      author: 'Ahmad Setiawan',
      rating: 5,
      comment: 'Cabe rawitnya segar sekali, merah menyala, and pedasnya mantap! Recomended seller.',
      date: '2026-05-24T08:00:00Z',
    },
    {
      id: 'rev-2',
      author: 'Siti Aminah',
      rating: 4,
      comment: 'Pengiriman agak lambat karena hujan, tapi kualitas cabe tetap prima, tidak busuk.',
      date: '2026-05-23T11:00:00Z',
    },
  ];

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <Skeleton className="h-6 w-32" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-80 md:col-span-2 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full text-center py-20">
        <h3 className="text-sm font-bold text-slate-700">Produk Tidak Ditemukan</h3>
        <Link href="/admin/products">
          <Button size="sm" className="mt-4 bg-green-600 text-white rounded-xl">
            Kembali ke Daftar
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 text-slate-900 pb-12">
      {/* Back button */}
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" /> Kembali ke Daftar Produk
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
          Listing: {product.title} {getStatusBadge(product.status)}
        </h1>
        <p className="text-xs font-semibold text-slate-500">
          Ulas detail deskripsi produk, lokasi pemanenan tani, stok barang aktif, dan review
          penilaian dari pembeli.
        </p>
      </div>

      {isOffline && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-800">Modus Simulasi Luring Aktif</h4>
            <p className="text-[11px] font-semibold text-amber-600 mt-0.5">
              Marketplace Service sedang tidak terhubung. Seluruh perubahan status listing produk
              ini disimpan di database peramban Anda.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Columns: Main Details */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-slate-200 bg-white rounded-2xl shadow-sm">
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-800">
                Spesifikasi & Rincian Produk
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5 text-xs font-semibold text-slate-700">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <span className="text-slate-400 font-bold block">Harga Jual Per Unit</span>
                  <h3 className="text-lg font-bold text-green-700">
                    Rp {product.price_per_unit.toLocaleString('id-ID')} / {product.unit}
                  </h3>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 font-bold block">Stok Aktif / Minimum Batas</span>
                  <span className="text-slate-800 flex items-center gap-1">
                    <Boxes className="h-4 w-4 text-slate-400" />
                    {product.stock} {product.unit} (Min: {product.min_stock} {product.unit})
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 font-bold block">Kategori Produk</span>
                  <span className="text-slate-800 flex items-center gap-1.5">
                    <Tag className="h-4 w-4 text-slate-400" /> {product.category}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 font-bold block">Lokasi Panen Petani</span>
                  <span className="text-slate-800 flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-slate-400" /> {product.location?.city},{' '}
                    {product.location?.province}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 pt-3 border-t border-slate-100">
                <span className="text-slate-400 font-bold block">Deskripsi Lengkap Produk</span>
                <p className="text-slate-600 leading-relaxed text-[11px] font-medium bg-slate-50 border border-slate-100 rounded-xl p-4">
                  {product.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Customer Reviews Section */}
          <Card className="border-slate-200 bg-white rounded-2xl shadow-sm">
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-800">
                Ulasan & Penilaian Pembeli
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {mockReviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{rev.author}</span>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${i < rev.rating ? 'fill-current' : 'text-slate-200'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-600">{rev.comment}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Farmer info and moderation action */}
        <div className="space-y-6">
          {/* Farmer Contact Info */}
          <Card className="border-slate-200 bg-white rounded-2xl shadow-sm overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-sm font-bold text-slate-800">
                Informasi Pemilik Toko (Petani)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3.5 text-xs font-semibold text-slate-700">
              <div className="space-y-1">
                <span className="text-slate-400 font-bold block">Nama Petani</span>
                <span className="text-slate-800 flex items-center gap-1.5">
                  <User className="h-4 w-4 text-slate-400" />
                  {product.farmer?.full_name || 'Petani Mandiri'}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-bold block">Email Terdaftar</span>
                <span className="text-slate-800 flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-slate-400" />
                  {product.farmer?.email || 'petani@smarttani.com'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Moderation Panel */}
          <Card className="border-slate-200 bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-red-500 to-amber-500" />
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-800">
                Tindakan Moderasi Listing
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {product.status === 'active' ? (
                <div className="space-y-3">
                  <p className="text-[10px] text-slate-400 font-semibold leading-normal">
                    Menangguhkan listing ini akan langsung menghilangkannya dari pencarian katalog
                    marketplace publik SmartTani. Pengguna/pembeli tidak akan dapat membelinya
                    sementara waktu.
                  </p>
                  <Button
                    onClick={() => {
                      if (confirm('Konfirmasi penangguhan listing produk ini?')) {
                        moderateMutation.mutate('inactive');
                      }
                    }}
                    disabled={moderateMutation.isPending}
                    className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold gap-1.5 py-4 cursor-pointer"
                  >
                    <Ban className="h-4.5 w-4.5" /> Suspend Listing Produk
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-[10px] text-slate-400 font-semibold leading-normal">
                    Aktifkan kembali produk ini agar muncul kembali di katalog marketplace publik
                    SmartTani, and pembeli dapat melakukan order kembali.
                  </p>
                  <Button
                    onClick={() => {
                      if (confirm('Aktifkan kembali listing produk ini?')) {
                        moderateMutation.mutate('active');
                      }
                    }}
                    disabled={moderateMutation.isPending}
                    className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold gap-1.5 py-4 cursor-pointer"
                  >
                    <CheckCircle className="h-4.5 w-4.5" /> Aktifkan Listing Produk
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
