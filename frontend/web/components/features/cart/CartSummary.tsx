'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface CartSummaryProps {
  subtotal: number;
  platformFee: number;
  total: number;
  canCheckout: boolean;
}

export function CartSummary({ subtotal, platformFee, total, canCheckout }: CartSummaryProps) {
  return (
    <aside>
      <Card className="sticky top-24">
        <CardHeader>
          <CardTitle className="text-lg">Ringkasan Belanja</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>Rp {subtotal.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Biaya Platform</span>
            <span>Rp {platformFee.toLocaleString('id-ID')}</span>
          </div>
          <div className="pt-4 border-t flex justify-between font-bold text-lg text-gray-900">
            <span>Total</span>
            <span className="text-green-600">Rp {total.toLocaleString('id-ID')}</span>
          </div>
        </CardContent>
        <CardFooter>
          <Link href="/checkout" className="w-full">
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg font-bold"
              disabled={!canCheckout}
            >
              Checkout
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
      {!canCheckout && (
        <p className="text-xs text-red-500 mt-4 text-center">
          Ada produk yang tidak tersedia. Hapus atau sesuaikan sebelum checkout.
        </p>
      )}
    </aside>
  );
}
