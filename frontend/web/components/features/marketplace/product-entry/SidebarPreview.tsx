'use client';

import { Plus } from 'lucide-react';
import { Control, useWatch } from 'react-hook-form';
import { ProductFormValues } from './schema';
import Image from 'next/image';

interface SidebarPreviewProps {
  control: Control<ProductFormValues>;
}

export function SidebarPreview({ control }: SidebarPreviewProps) {
  const name = useWatch({ control, name: 'name' });
  const category = useWatch({ control, name: 'category' });
  const type = useWatch({ control, name: 'type' });
  const unit = useWatch({ control, name: 'unit' });
  const pricePerUnit = useWatch({ control, name: 'pricePerUnit' });
  const stock = useWatch({ control, name: 'stock' });
  const images = useWatch({ control, name: 'images' }) || [];

  const formatType = (val?: string) => {
    if (!val) return '-';
    switch (val) {
      case 'physical':
        return 'Fisik';
      case 'digital':
        return 'Digital';
      case 'service':
        return 'Layanan';
      default:
        return val;
    }
  };

  const formatPrice = (price?: number) => {
    if (price === undefined || price === null || isNaN(price)) return '-';
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Preview Produk
      </h2>
      {images.length > 0 ? (
        <div className="relative aspect-square rounded-lg border overflow-hidden bg-slate-50">
          <Image
            src={images[0]}
            alt="Product Preview Cover"
            fill
            unoptimized
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-slate-50 p-8 text-center text-muted-foreground">
          <div className="flex h-16 w-16 items-center justify-center rounded bg-slate-200/50">
            <Plus className="h-8 w-8 text-slate-400" />
          </div>
          <p className="text-xs">Belum ada gambar</p>
        </div>
      )}
      <div className="space-y-3">
        <div>
          <p className="text-[10px] font-semibold uppercase text-muted-foreground">Nama Produk</p>
          <p className="text-sm font-medium truncate">{name || '-'}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase text-muted-foreground">Kategori</p>
            <p className="text-sm capitalize">{category || '-'}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase text-muted-foreground">Tipe Produk</p>
            <p className="text-sm">{formatType(type)}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase text-muted-foreground">Harga</p>
            <p className="text-sm font-medium text-green-600">
              {formatPrice(pricePerUnit)}
              {pricePerUnit !== undefined && unit ? (
                <span className="text-[10px] font-normal text-muted-foreground uppercase">
                  /{unit}
                </span>
              ) : (
                ''
              )}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase text-muted-foreground">Stok</p>
            <p className="text-sm font-medium">
              {stock !== undefined && stock !== null && !isNaN(stock) ? `${stock} ` : '-'}
              {stock !== undefined && stock !== null && !isNaN(stock) && unit ? (
                <span className="text-[10px] font-normal text-muted-foreground uppercase">
                  {unit}
                </span>
              ) : (
                ''
              )}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase text-muted-foreground">Satuan</p>
            <p className="text-sm uppercase">{unit || '-'}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase text-muted-foreground">Rating</p>
            <p className="text-sm text-yellow-500">☆☆☆☆☆ (0)</p>
          </div>
        </div>
      </div>
      <p className="text-center text-[10px] italic text-muted-foreground">
        Preview terupdate secara real-time dari formulir.
      </p>
    </div>
  );
}
