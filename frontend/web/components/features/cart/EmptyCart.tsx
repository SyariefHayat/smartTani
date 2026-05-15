import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export function EmptyCart() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <div className="bg-gray-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
        <ShoppingBag className="w-12 h-12 text-gray-300" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900">Keranjang Kosong</h2>
      <p className="text-gray-500 mt-2">Wah, keranjang belanjamu masih kosong nih.</p>
      <Link href="/marketplace">
        <Button className="mt-8 bg-green-600 hover:bg-green-700">Mulai Belanja</Button>
      </Link>
    </div>
  );
}
