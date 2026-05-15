'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cartService } from '@/services/cart';
import { orderService } from '@/services/order';
import { Form } from '@/components/ui/form';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { CheckoutForm, checkoutFormSchema, CheckoutFormValues } from '@/components/features/checkout/CheckoutForm';
import { CheckoutSummary } from '@/components/features/checkout/CheckoutSummary';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const PLATFORM_FEE_RATE = 0.02;
const SHIPPING_COST = 15000;

export default function CheckoutPage() {
  const { data: cartData, isLoading, isError } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartService.getCart(),
  });

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      recipient_name: '',
      phone_number: '',
      province: '',
      city: '',
      full_address: '',
      postal_code: '',
      notes: '',
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: async (values: CheckoutFormValues) => {
      const { notes, ...shippingAddress } = values;
      const orderResponse = await orderService.checkout({
        shippingAddress,
        notes,
      });
      
      const paymentResponse = await orderService.initiatePayment(orderResponse.data.id);
      return paymentResponse.data;
    },
    onSuccess: (data) => {
      toast.success('Pesanan Dibuat', { description: 'Mengalihkan ke halaman pembayaran...' });
      if (data.redirect_url) {
        window.location.href = data.redirect_url;
      }
    },
    onError: (error) => {
      const axiosError = error as AxiosError<{ error: { message: string } }>;
      const message = axiosError.response?.data?.error?.message || 'Gagal membuat pesanan';
      toast.error('Gagal', { description: message });
    },
  });

  const onSubmit = (values: CheckoutFormValues) => {
    checkoutMutation.mutate(values);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-8">
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <Skeleton className="h-[500px] w-full" />
        </div>
      </div>
    );
  }

  if (isError || !cartData?.data?.items?.length) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold">Keranjang kosong atau gagal memuat</h2>
        <Link href="/cart">
          <Button variant="outline" className="mt-4">Kembali ke Keranjang</Button>
        </Link>
      </div>
    );
  }

  const items = cartData.data.items;
  const subtotal = cartData.data.total;
  const platformFee = Math.round(subtotal * PLATFORM_FEE_RATE);
  const total = subtotal + platformFee + SHIPPING_COST;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link 
        href="/cart" 
        className="inline-flex items-center text-sm text-gray-500 hover:text-green-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Kembali ke Keranjang
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CheckoutForm form={form} />
          </div>

          <CheckoutSummary
            items={items}
            subtotal={subtotal}
            platformFee={platformFee}
            shippingCost={SHIPPING_COST}
            total={total}
            isSubmitting={checkoutMutation.isPending}
          />
        </form>
      </Form>
    </div>
  );
}
