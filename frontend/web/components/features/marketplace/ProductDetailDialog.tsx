'use client';

import { Product } from '@/services/marketplace';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, MapPin, Package, DollarSign, Layers } from 'lucide-react';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';

interface ProductDetailDialogProps {
  product?: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
}

export function ProductDetailDialog({
  product,
  open,
  onOpenChange,
  onEdit,
}: ProductDetailDialogProps) {
  if (!product) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <div className="flex h-40 items-center justify-center">
            <span className="text-sm text-muted-foreground animate-pulse">
              Memuat detail produk...
            </span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const statusBadge = () => {
    switch (product.status) {
      case 'active':
        return (
          <Badge className="rounded-full border border-green-200 bg-green-50 px-3 py-0.5 font-medium text-green-600 hover:bg-green-50">
            Aktif
          </Badge>
        );
      case 'inactive':
        return (
          <Badge className="rounded-full border border-red-200 bg-red-50 px-3 py-0.5 font-medium text-red-600 hover:bg-red-50">
            Nonaktif
          </Badge>
        );
      default:
        return (
          <Badge className="rounded-full border border-yellow-200 bg-yellow-50 px-3 py-0.5 font-medium text-yellow-600 hover:bg-yellow-50">
            Pending
          </Badge>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto text-foreground">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-lg">{product.title}</DialogTitle>
              <DialogDescription className="mt-1">
                ID: {product._id || product.id}
              </DialogDescription>
            </div>
            {statusBadge()}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Images */}
          {product.images && product.images.length > 0 && (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {product.images.map((img, idx) => (
                <div key={idx} className="relative aspect-square overflow-hidden rounded-lg border">
                  <Image
                    src={img}
                    alt={`${product.title} - ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 rounded-lg border p-3">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-xs text-muted-foreground">Harga per {product.unit}</p>
                <p className="font-semibold">{formatCurrency(product.price_per_unit)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border p-3">
              <Package className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-xs text-muted-foreground">Stok</p>
                <p className="font-semibold">
                  {product.stock.toLocaleString('id-ID')} {product.unit}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border p-3">
              <Layers className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-xs text-muted-foreground">Kategori</p>
                <p className="font-semibold">{product.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border p-3">
              <MapPin className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-xs text-muted-foreground">Lokasi</p>
                <p className="font-semibold">
                  {product.location?.city}, {product.location?.province}
                </p>
              </div>
            </div>
          </div>

          {/* Min Order */}
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground mb-1">Minimal Order</p>
            <p className="text-sm font-medium">
              {product.min_order} {product.unit}
            </p>
          </div>

          {/* Description */}
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground mb-1">Deskripsi</p>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {product.description || 'Tidak ada deskripsi'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Tutup
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" /> Edit Produk
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
