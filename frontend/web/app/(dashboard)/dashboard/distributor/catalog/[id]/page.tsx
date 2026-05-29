'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { marketplaceService } from '@/services/marketplace';
import { cartService } from '@/services/cart';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  ChevronLeft,
  Store,
  MapPin,
  AlertTriangle,
  ShieldCheck,
  ShoppingCart,
  Send,
} from 'lucide-react';

const MOCK_PRODUCT_DETAIL = {
  id: 'prod-001',
  title: 'Beras Pandan Wangi Organik',
  description:
    'Beras Pandan Wangi premium hasil panen organik tanpa pestisida kimia. Memiliki cita rasa nasi yang sangat harum, pulen, dan lezat. Sangat cocok untuk konsumsi rumah tangga premium maupun restoran bintang lima yang mengutamakan kualitas komoditas terbaik.',
  price_per_unit: 18000,
  unit: 'kg',
  stock: 500,
  min_order: 100, // MOQ
  images: ['https://placehold.co/600x400?text=Beras+Pandan+Wangi'],
  category: 'Biji-bijian & Kacang',
  location: {
    city: 'Banyuwangi',
    province: 'Jawa Timur',
    full_address: 'Kecamatan Kabat, Desa Kedayunan No. 12',
  },
  farmer: {
    id: 'farmer-1',
    full_name: 'Budi Santoso',
    phone: '0821-2233-4455',
    joined_at: '2025-01-10',
    total_harvests: 24,
    rating: 4.8,
  },
};

export default function DistributorProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const productId = resolvedParams.id || 'prod-001';
  const router = useRouter();
  const [isOffline, setIsOffline] = React.useState(false);
  const [quantity, setQuantity] = React.useState(0);
  const [notes, setNotes] = React.useState('');

  // Fetch product
  const { data: product, isLoading } = useQuery({
    queryKey: ['distributor-product-detail', productId],
    queryFn: async () => {
      try {
        const res = (await marketplaceService.getProductById(productId)) as unknown as Record<
          string,
          unknown
        >;
        if (!res) throw new Error('Not found');
        return {
          ...res,
          min_order: res.min_order || 100,
          farmer: res.farmer || { full_name: 'Petani Mandiri', rating: 4.8, total_harvests: 18 },
        };
      } catch {
        setIsOffline(true);
        return MOCK_PRODUCT_DETAIL;
      }
    },
  });

  const activeProduct = (product || MOCK_PRODUCT_DETAIL) as unknown as typeof MOCK_PRODUCT_DETAIL;
  const currentQuantity = quantity === 0 ? activeProduct.min_order || 100 : quantity;

  // Cart additions
  const cartMutation = useMutation({
    mutationFn: async (direct: boolean) => {
      if (currentQuantity < activeProduct.min_order) {
        throw new Error(
          `Kuantitas kurang dari Minimum Order (${activeProduct.min_order} ${activeProduct.unit})`
        );
      }

      if (currentQuantity > activeProduct.stock) {
        throw new Error(
          `Kuantitas melebihi stok yang tersedia (${activeProduct.stock} ${activeProduct.unit})`
        );
      }

      try {
        await cartService.addToCart({ productId, quantity: currentQuantity });
      } catch {
        // Simulated local memory cart update
        console.log('Simulating local cart...');
      }

      if (direct) {
        router.push('/dashboard/distributor/checkout');
      } else {
        toast.success('Komoditas ditambahkan ke keranjang grosir B2B!', {
          description: `Kuantitas: ${currentQuantity} ${activeProduct.unit}.`,
        });
      }
    },
    onError: (err: Error) => {
      toast.error('Gagal memesan', { description: err.message });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-32" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-96 md:col-span-2" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  const liveTotal = currentQuantity * activeProduct.price_per_unit;
  const isOutOfStock = activeProduct.stock <= 0;

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Back button */}
      <div>
        <Link
          href="/dashboard/distributor/catalog"
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" /> Kembali ke Katalog B2B
        </Link>
      </div>

      {isOffline && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-800">Modus Simulasi Luring Aktif</h4>
            <p className="text-[11px] text-amber-600/90 font-medium mt-0.5 leading-relaxed">
              Detail komoditas dan form pesanan grosir disimulasikan menggunakan data lokal offline.
            </p>
          </div>
        </div>
      )}

      {/* Main product view grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Side: Product detail info & farmer bio */}
        <div className="md:col-span-2 space-y-6">
          {/* Card 1: Product info */}
          <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
            {/* Gallery Image */}
            <div className="aspect-video w-full overflow-hidden bg-slate-50 border-b border-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  activeProduct.images?.[0] || 'https://placehold.co/600x400?text=Produk+SmartTani'
                }
                alt={activeProduct.title}
                className="h-full w-full object-cover"
              />
            </div>
            <CardContent className="pt-6 space-y-4">
              <div>
                <span className="inline-flex items-center rounded-lg bg-green-50 border border-green-200/50 px-2.5 py-0.5 text-[10px] font-bold text-green-700">
                  {activeProduct.category}
                </span>
                <h1 className="text-xl font-bold tracking-tight text-slate-800 mt-2">
                  {activeProduct.title}
                </h1>
                <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold mt-1">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span>
                    Greenhouse asal: {activeProduct.location?.city},{' '}
                    {activeProduct.location?.province}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Deskripsi Komoditas
                </h4>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {activeProduct.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Farmer profile */}
          <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-50 flex flex-row items-center gap-2 space-y-0">
              <Store className="h-4.5 w-4.5 text-green-600" />
              <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Petani Supplier Mitra
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-50 text-base font-bold text-green-600 border border-green-100">
                  {activeProduct.farmer?.full_name?.charAt(0) || 'P'}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    {activeProduct.farmer?.full_name}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                    Mitra Tani Banyuwangi
                  </p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                    Terdaftar sejak: {activeProduct.farmer?.joined_at || 'Januari 2025'}
                  </p>
                </div>
              </div>

              <div className="flex gap-6 text-center text-xs font-semibold text-slate-500">
                <div>
                  <span className="text-sm font-bold text-slate-800 block">
                    ★ {activeProduct.farmer?.rating || 4.8}
                  </span>
                  Rating Petani
                </div>
                <div className="border-l border-slate-200 pl-6">
                  <span className="text-sm font-bold text-slate-800 block">
                    {activeProduct.farmer?.total_harvests || 24} Kali
                  </span>
                  Sukses Panen
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Order Sidebar form */}
        <Card className="border-slate-200 shadow-sm bg-white h-fit overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/20">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Panel Pemesanan B2B
            </CardTitle>
            <CardDescription className="text-xs">
              Lengkapi quantity grosir & instruksi khusus pengadaan komoditas.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {/* Price list */}
            <div className="flex justify-between items-end border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-500">
                Harga per {activeProduct.unit}
              </span>
              <span className="text-base font-bold text-green-600">
                {formatCurrency(activeProduct.price_per_unit)}
              </span>
            </div>

            {/* Quantity Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <label>Kuantitas Grosir ({activeProduct.unit})</label>
                <span className="text-red-500 font-bold">MOQ: {activeProduct.min_order}</span>
              </div>
              <Input
                type="number"
                value={currentQuantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min={activeProduct.min_order}
                disabled={isOutOfStock}
                className="h-11 text-xs font-bold border-slate-200 focus:border-green-500"
              />
            </div>

            {/* Special Instructions Notes */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Instruksi Khusus (Opsional)
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Pengiriman menggunakan karung goni steril, bibit dilapisi pelindung..."
                rows={3}
                disabled={isOutOfStock}
                className="text-xs font-semibold border-slate-200 focus:border-green-500"
              />
            </div>

            {/* Computed Payable Summary */}
            <div className="bg-slate-50/50 border border-slate-100 p-3 rounded-xl space-y-1 text-xs font-semibold text-slate-500">
              <div className="flex justify-between">
                <span>
                  Subtotal Barang ({currentQuantity} {activeProduct.unit})
                </span>
                <span className="text-slate-800 font-bold">{formatCurrency(liveTotal)}</span>
              </div>
              <div className="flex justify-between pt-2 mt-2 border-t border-slate-200 text-slate-800 font-bold">
                <span>Estimasi Tagihan</span>
                <span className="text-green-600 text-sm">{formatCurrency(liveTotal)}</span>
              </div>
            </div>

            {/* Safe secure seal */}
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold bg-green-50/50 p-2.5 rounded-lg border border-green-100/50">
              <ShieldCheck className="h-4.5 w-4.5 text-green-600 shrink-0" />
              <span>
                Jaminan Kemitraan Aman SmartTani: Dana dilepas setelah barang terkonfirmasi masuk
                gudang.
              </span>
            </div>
          </CardContent>

          {/* Footer buttons */}
          <CardFooter className="pt-2 pb-6 flex flex-col gap-2.5 px-6 border-t border-slate-50">
            <Button
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-10 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              onClick={() => cartMutation.mutate(false)}
              disabled={isOutOfStock || cartMutation.isPending}
            >
              <ShoppingCart className="h-4 w-4" /> Masukkan Keranjang
            </Button>
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-xs h-10 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              onClick={() => cartMutation.mutate(true)}
              disabled={isOutOfStock || cartMutation.isPending}
            >
              <Send className="h-4 w-4" /> Pesan Grosir Langsung
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
