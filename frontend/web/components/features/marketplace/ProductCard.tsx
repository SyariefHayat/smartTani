'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/services/marketplace';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Package } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.stock <= 0;
  const productId = product.id || product._id;

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0 relative aspect-square">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
            Habis
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-green-600 transition-colors">
          {product.title}
        </h3>
        <p className="text-green-600 font-bold text-xl mt-1">
          Rp {product.price_per_unit.toLocaleString('id-ID')}
          <span className="text-xs text-gray-500 font-normal"> / {product.unit}</span>
        </p>
        <div className="flex items-center gap-1 text-gray-500 text-sm mt-2">
          <MapPin className="w-4 h-4" />
          <span className="line-clamp-1">{product.location.city}, {product.location.province}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
          <Package className="w-4 h-4" />
          <span>Stok: {product.stock} {product.unit}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/marketplace/${productId}`} className="w-full">
          <Button 
            className="w-full bg-green-600 hover:bg-green-700 text-white" 
            disabled={isOutOfStock}
          >
            Lihat Detail
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
