'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import { marketplaceService } from '@/services/marketplace';
import { cartService } from '@/services/cart';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { 
  MapPin, 
  Package, 
  ShoppingCart, 
  ChevronLeft, 
  Store,
  Tag,
  Info
} from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: productData, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => marketplaceService.getProductById(id as string),
    enabled: !!id,
  });

  const addToCartMutation = useMutation({
    mutationFn: (data: { productId: string; quantity: number }) => cartService.addToCart(data),
    onSuccess: () => {
      toast.success('Berhasil!', {
        description: 'Produk telah ditambahkan ke keranjang.',
      });
    },
    onError: (error) => {
      const axiosError = error as AxiosError<{ error: { message: string } }>;
      const message = axiosError.response?.data?.error?.message || 'Gagal menambahkan ke keranjang';
      toast.error('Gagal', {
        description: message,
      });
    },
  });

  const product = productData?.data;

  const handleQuantityChange = (val: number) => {
    if (!product) return;
    const newQty = Math.max(product.min_order, Math.min(product.stock, val));
    setQuantity(newQty);
  };

  const onAddToCart = () => {
    if (!product) return;
    addToCartMutation.mutate({
      productId: product.id || product._id,
      quantity,
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Produk tidak ditemukan</h1>
        <p className="text-gray-500 mt-2">Maaf, produk yang Anda cari tidak tersedia atau sudah dihapus.</p>
        <Button onClick={() => router.back()} className="mt-6" variant="outline">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        onClick={() => router.back()} 
        className="mb-6 -ml-2 text-gray-500"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Kembali ke Marketplace
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[selectedImage]}
                alt={product.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-20 h-20 text-gray-300" />
              </div>
            )}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="bg-red-500 text-white px-6 py-2 rounded-full font-bold text-xl uppercase tracking-wider">
                  Stok Habis
                </span>
              </div>
            )}
          </div>
          
          {product.images && product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-24 aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === idx ? 'border-green-600' : 'border-transparent'
                  }`}
                >
                  <Image src={img} alt={`${product.title} ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {product.category}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
            <p className="text-3xl font-bold text-green-600 mt-2">
              Rp {product.price_per_unit.toLocaleString('id-ID')}
              <span className="text-base text-gray-500 font-normal"> / {product.unit}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Stok</p>
                <p className="font-semibold">{product.stock} {product.unit}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Info className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Min. Order</p>
                <p className="font-semibold">{product.min_order} {product.unit}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 rounded-lg">
                <MapPin className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Lokasi</p>
                <p className="font-semibold">{product.location.city}, {product.location.province}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Store className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Penjual</p>
                <p className="font-semibold">{product.farmer?.full_name}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold">Deskripsi Produk</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          <div className="pt-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button 
                  className="px-4 py-2 hover:bg-gray-100 transition-colors border-r disabled:opacity-50"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= product.min_order || isOutOfStock}
                >
                  -
                </button>
                <input 
                  type="number" 
                  className="w-16 text-center border-none focus:ring-0" 
                  value={quantity}
                  onChange={(e) => handleQuantityChange(Number(e.target.value))}
                  disabled={isOutOfStock}
                />
                <button 
                  className="px-4 py-2 hover:bg-gray-100 transition-colors border-l disabled:opacity-50"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock || isOutOfStock}
                >
                  +
                </button>
              </div>
              <p className="text-sm text-gray-500">
                Subtotal: <span className="font-bold text-gray-900">
                  Rp {(product.price_per_unit * quantity).toLocaleString('id-ID')}
                </span>
              </p>
            </div>

            <div className="flex gap-4">
              <Button 
                size="lg" 
                className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12 text-lg"
                disabled={isOutOfStock || addToCartMutation.isPending}
                onClick={onAddToCart}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Tambah ke Keranjang
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
