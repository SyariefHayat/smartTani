'use client';

import { ICartItem } from '@/services/cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, CreditCard, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface CheckoutSummaryProps {
  items: ICartItem[];
  subtotal: number;
  platformFee: number;
  shippingCost: number;
  total: number;
  isSubmitting: boolean;
}

export function CheckoutSummary({
  items,
  subtotal,
  platformFee,
  shippingCost,
  total,
  isSubmitting,
}: CheckoutSummaryProps) {
  return (
    <aside className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pesanan Anda</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[300px] overflow-y-auto px-6 space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-3 py-2 border-b last:border-0">
                <div className="relative w-12 h-12 rounded border overflow-hidden flex-shrink-0 bg-gray-50">
                  {item.image ? (
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.title}</p>
                  <p className="text-xs text-gray-500">
                    {item.quantity} x Rp {item.price_per_unit.toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  Rp {item.subtotal.toLocaleString('id-ID')}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ringkasan Pembayaran</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span>Rp {subtotal.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Biaya Platform (2%)</span>
            <span>Rp {platformFee.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Ongkos Kirim</span>
            <span>Rp {shippingCost.toLocaleString('id-ID')}</span>
          </div>
          <div className="pt-3 border-t flex justify-between font-bold text-lg text-gray-900">
            <span>Total Tagihan</span>
            <span className="text-green-600">Rp {total.toLocaleString('id-ID')}</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg font-bold"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5 mr-2" />
                Bayar Sekarang
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      <p className="text-[10px] text-gray-400 text-center px-4">
        Dengan menekan tombol di atas, Anda menyetujui Syarat & Ketentuan yang berlaku di SmartTani.
      </p>
    </aside>
  );
}
