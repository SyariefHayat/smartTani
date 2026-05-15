'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '@/services/cart';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { CartItemCard } from '@/components/features/cart/CartItemCard';
import { CartSummary } from '@/components/features/cart/CartSummary';
import { CartSkeleton } from '@/components/features/cart/CartSkeleton';
import { EmptyCart } from '@/components/features/cart/EmptyCart';

const PLATFORM_FEE = 2000;

export default function CartPage() {
  const queryClient = useQueryClient();

  const { data: cartData, isLoading, isError } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartService.getCart(),
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      cartService.updateCartItem(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      const axiosError = error as AxiosError<{ error: { message: string } }>;
      const message = axiosError.response?.data?.error?.message || 'Gagal mengubah jumlah';
      toast.error('Gagal', { description: message });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: (productId: string) => cartService.removeFromCart(productId),
    onSuccess: () => {
      toast.success('Dihapus', { description: 'Produk dihapus dari keranjang.' });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      const axiosError = error as AxiosError<{ error: { message: string } }>;
      const message = axiosError.response?.data?.error?.message || 'Gagal menghapus produk';
      toast.error('Gagal', { description: message });
    },
  });

  const cart = cartData?.data;
  const items = cart?.items || [];
  const subtotal = cart?.total || 0;
  const total = subtotal > 0 ? subtotal + PLATFORM_FEE : 0;
  const canCheckout = items.length > 0 && items.every((item) => item.isAvailable);

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    updateQuantityMutation.mutate({ productId, quantity });
  };

  const handleRemoveItem = (productId: string) => {
    removeItemMutation.mutate(productId);
  };

  if (isLoading) return <CartSkeleton />;

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold">Gagal memuat keranjang</h2>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Muat Ulang
        </Button>
      </div>
    );
  }

  if (items.length === 0) return <EmptyCart />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Keranjang Belanja</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItemCard
              key={item.productId}
              item={item}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemoveItem}
              isUpdating={updateQuantityMutation.isPending || removeItemMutation.isPending}
            />
          ))}
        </div>

        <CartSummary
          subtotal={subtotal}
          platformFee={PLATFORM_FEE}
          total={total}
          canCheckout={canCheckout}
        />
      </div>
    </div>
  );
}
