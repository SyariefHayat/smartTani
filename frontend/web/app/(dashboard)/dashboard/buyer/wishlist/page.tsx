'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistService, WishlistItem } from '@/services/wishlist';
import { cartService } from '@/services/cart';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Trash2, Store, AlertTriangle, RefreshCw } from 'lucide-react';

const MOCK_WISHLIST: WishlistItem[] = [
  {
    id: 'W-01',
    buyer_id: 'B-01',
    product_id: 'P-01',
    created_at: '2026-05-27T10:00:00Z',
    product: {
      id: 'P-01',
      title: 'Cabai Merah Keriting Unggul',
      price_per_unit: 25000,
      stock: 120,
      images: [],
      description: 'Cabai segar petikan langsung dari petani mitra Lamongan.',
    },
  },
  {
    id: 'W-02',
    buyer_id: 'B-01',
    product_id: 'P-02',
    created_at: '2026-05-26T18:00:00Z',
    product: {
      id: 'P-02',
      title: 'Pupuk Kompos Organik Bio-Tani',
      price_per_unit: 30000,
      stock: 45,
      images: [],
      description: 'Pupuk organik penyubur mikroba tanah alami.',
    },
  },
  {
    id: 'W-03',
    buyer_id: 'B-01',
    product_id: 'P-03',
    created_at: '2026-05-25T08:15:00Z',
    product: {
      id: 'P-03',
      title: 'Bibit Tomat Hibrida F1',
      price_per_unit: 18000,
      stock: 0,
      images: [],
      description: 'Daya tumbuh tinggi, tahan layu bakteri.',
    },
  },
];

export default function BuyerWishlistPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // 1. Fetch Wishlist
  const {
    data: wishlistItems,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['buyer-wishlist'],
    queryFn: async () => wishlistService.getWishlist(),
  });

  const isQueryError = isError;

  React.useEffect(() => {
    if (isQueryError) {
      toast.error('Layanan sedang offline. Menggunakan data demo lokal.');
    }
  }, [isQueryError]);

  const activeItems = isQueryError ? MOCK_WISHLIST : wishlistItems || MOCK_WISHLIST;

  // 2. Remove mutation
  const removeMutation = useMutation({
    mutationFn: async (productId: string) => wishlistService.removeFromWishlist(productId),
    onSuccess: () => {
      toast.success('Produk berhasil dihapus dari Wishlist');
      queryClient.invalidateQueries({ queryKey: ['buyer-wishlist'] });
    },
    onError: () => {
      toast.error('Gagal menghapus produk dari Wishlist');
    },
  });

  // 3. Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async (productId: string) =>
      cartService.addToCart({ productId: productId, quantity: 1 }),
    onSuccess: () => {
      toast.success('Produk berhasil ditambahkan ke keranjang belanja!');
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: () => {
      toast.error('Gagal menambahkan produk ke keranjang belanja');
    },
  });

  const handleRemove = (productId: string) => {
    if (isQueryError) {
      toast.success('Produk berhasil dihapus dari Wishlist (Simulasi)');
      return;
    }
    removeMutation.mutate(productId);
  };

  const handleAddToCart = (productId: string, stock: number) => {
    if (stock <= 0) {
      toast.error('Stok produk sedang habis');
      return;
    }
    if (isQueryError) {
      toast.success('Produk berhasil ditambahkan ke keranjang belanja! (Simulasi)');
      return;
    }
    addToCartMutation.mutate(productId);
  };

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Wishlist & Pinned</h1>
          <p className="text-sm text-slate-500">
            Daftar produk favorit yang ingin Anda beli kembali.
          </p>
        </div>
      </div>

      {/* Grid of Wishlist Items */}
      {isLoading ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full rounded-xl animate-pulse" />
          ))}
        </div>
      ) : activeItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 text-center text-slate-400 bg-white border border-slate-200 rounded-xl shadow-xs gap-3">
          <Heart className="h-10 w-10 text-slate-300 animate-pulse" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-700">Wishlist Anda Kosong</p>
            <p className="text-xs text-slate-400">
              Jelajahi marketplace SmartTani dan tambahkan produk yang Anda sukai ke dalam favorit.
            </p>
          </div>
          <Button
            className="mt-2 bg-green-600 hover:bg-green-700 font-bold text-xs cursor-pointer"
            onClick={() => router.push('/marketplace')}
          >
            <Store className="mr-2 h-4 w-4" /> Cari Produk
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {activeItems.map((item) => {
            const prod = item.product;
            if (!prod) return null;
            const isOutOfStock = prod.stock <= 0;

            return (
              <Card
                key={item.id}
                className="border border-slate-200 bg-white hover:shadow-md transition-all shadow-xs flex flex-col justify-between overflow-hidden group"
              >
                <CardHeader className="p-0 relative">
                  {/* Real Image or Fallback placeholder */}
                  {prod.images && prod.images.length > 0 ? (
                    <div className="h-44 w-full relative border-b border-slate-100 overflow-hidden">
                      <img
                        src={prod.images[0]}
                        alt={prod.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {isOutOfStock && (
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center text-white text-xs font-bold uppercase tracking-widest">
                          Stok Habis
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-44 w-full bg-slate-50 flex items-center justify-center border-b border-slate-100 font-extrabold text-slate-300 text-3xl uppercase tracking-wider relative">
                      {prod.title.slice(0, 3)}
                      {isOutOfStock && (
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center text-white text-xs font-bold uppercase tracking-widest">
                          Stok Habis
                        </div>
                      )}
                    </div>
                  )}
                  {/* Heart button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 hover:bg-white text-rose-500 shadow-sm cursor-pointer"
                    onClick={() => handleRemove(prod.id)}
                  >
                    <Heart className="h-4.5 w-4.5 fill-rose-500" />
                  </Button>
                </CardHeader>
                <CardContent className="p-5 flex-1 space-y-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase">
                      Pertanian
                    </span>
                    <h3
                      className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-green-600 transition-colors"
                      title={prod.title}
                    >
                      {prod.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>
                  <div className="flex justify-between items-center pt-2">
                    <p className="text-sm font-extrabold text-slate-800">
                      {formatCurrency(prod.price_per_unit)}
                      <span className="text-[10px] text-slate-400 font-semibold ml-0.5">/unit</span>
                    </p>
                    <span
                      className={`text-[10px] font-bold ${isOutOfStock ? 'text-rose-500' : 'text-slate-400'}`}
                    >
                      {isOutOfStock ? 'Stok Habis' : `Stok: ${prod.stock}`}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="p-5 pt-0 border-t border-slate-50 mt-auto">
                  <Button
                    className="w-full font-bold text-xs cursor-pointer mt-4 bg-green-600 hover:bg-green-700"
                    disabled={isOutOfStock}
                    onClick={() => handleAddToCart(prod.id, prod.stock)}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" /> Tambah ke Keranjang
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
