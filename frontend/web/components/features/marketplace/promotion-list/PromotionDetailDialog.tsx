'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Percent, Tag, Calendar, UserCheck, PlayCircle } from 'lucide-react';

import { marketplaceService } from '@/services/marketplace';
import { Promotion } from './types';

interface PromotionDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promo?: Promotion | null;
  farmerId?: string;
}

export function PromotionDetailDialog({
  open,
  onOpenChange,
  promo,
  farmerId,
}: PromotionDetailDialogProps) {
  // Query to fetch all farmer products to map IDs to titles
  const { data: productsResponse, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['farmer-products-all', farmerId],
    queryFn: () => marketplaceService.getProducts({ farmer_id: farmerId, limit: 1000 }),
    enabled: open && !!farmerId && !!promo,
  });

  if (!promo) return null;

  const products = productsResponse?.data?.products || [];

  const matchedProducts = products.filter((p) => promo.product_ids?.includes(p._id));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="border-none bg-green-100 font-medium text-green-700 hover:bg-green-100">
            Aktif
          </Badge>
        );
      case 'scheduled':
        return (
          <Badge className="border-none bg-blue-100 font-medium text-blue-600 hover:bg-blue-100">
            Terjadwal
          </Badge>
        );
      case 'expired':
        return (
          <Badge className="border-none bg-red-100 font-medium text-red-600 hover:bg-red-100">
            Berakhir
          </Badge>
        );
      case 'inactive':
        return (
          <Badge className="border-none bg-slate-100 font-medium text-slate-500 hover:bg-slate-100">
            Nonaktif
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md text-slate-900 bg-white">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <DialogTitle className="text-lg">{promo.title}</DialogTitle>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-xs font-bold uppercase text-slate-700">
                  {promo.code || 'PROMO'}
                </span>
                {getStatusBadge(promo.status)}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Main Info */}
          <div className="grid grid-cols-2 gap-4 rounded-xl border p-4 bg-slate-50">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                Nilai Promo
              </span>
              <div className="flex items-center gap-1.5 text-slate-800">
                {promo.type === 'discount_percent' ? (
                  <Percent className="h-4 w-4 text-pink-500" />
                ) : (
                  <Tag className="h-4 w-4 text-indigo-500" />
                )}
                <span className="font-extrabold text-lg text-slate-900">
                  {promo.type === 'discount_percent'
                    ? `${promo.value}%`
                    : `Rp ${promo.value.toLocaleString('id-ID')}`}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                Penggunaan
              </span>
              <div className="flex items-center gap-1.5 text-slate-800">
                <UserCheck className="h-4 w-4 text-emerald-500" />
                <span className="font-extrabold text-lg text-slate-900">
                  {promo.usageCount || 0}{' '}
                  <span className="text-xs text-slate-400 font-normal">/ {promo.limit || 100}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-2 rounded-xl border p-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> Periode Berlaku
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 pt-1">
              <div>
                <p className="text-[10px] text-slate-400">Mulai</p>
                <p className="font-semibold text-slate-800">
                  {new Date(promo.start_date).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">Berakhir</p>
                <p className="font-semibold text-slate-800">
                  {new Date(promo.end_date).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Products List */}
          <div className="space-y-2 rounded-xl border p-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <PlayCircle className="h-3.5 w-3.5" /> Produk Terkait
            </h3>
            {isLoadingProducts ? (
              <div className="flex h-16 items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                <span className="ml-2 text-xs text-slate-500">Mencocokkan produk...</span>
              </div>
            ) : matchedProducts.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Tidak ada produk terkait.</p>
            ) : (
              <ScrollArea className="h-28 pr-2">
                <ul className="space-y-2">
                  {matchedProducts.map((p) => (
                    <li
                      key={p._id}
                      className="flex items-center justify-between text-xs border-b pb-1.5 last:border-0"
                    >
                      <span className="font-medium text-slate-700 truncate max-w-[250px]">
                        {p.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">Stok: {p.stock}</span>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            )}
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
            Tutup Detail
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
