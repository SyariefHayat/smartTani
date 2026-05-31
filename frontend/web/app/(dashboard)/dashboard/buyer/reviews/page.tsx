'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService, ProductReview } from '@/services/review';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MessageSquare, AlertTriangle, RefreshCw, Eye, Sprout } from 'lucide-react';
import { format } from 'date-fns';

const MOCK_REVIEWS: ProductReview[] = [
  {
    id: 'R-01',
    buyer_id: 'B-01',
    product_id: 'P-01',
    product_title: 'Cabai Merah Keriting Unggul',
    rating: 5,
    comment: 'Kualitas cabai segar dan sangat mantap! Pengiriman cepat sekali dikemas dengan aman.',
    created_at: '2026-05-27T10:00:00Z',
  },
  {
    id: 'R-02',
    buyer_id: 'B-01',
    product_id: 'P-02',
    product_title: 'Pupuk Kompos Organik Bio-Tani',
    rating: 4,
    comment:
      'Bagus untuk tanaman tomat saya. Mikroba alami di dalamnya membuat tanaman jadi subur.',
    created_at: '2026-05-26T14:30:00Z',
  },
  {
    id: 'R-03',
    buyer_id: 'B-01',
    product_id: 'P-03',
    product_title: 'Alat Semprot Hama Premium',
    rating: 5,
    comment: 'Kapasitas besar 15L sangat memuaskan, semprotan merata kencang.',
    created_at: '2026-05-24T08:15:00Z',
  },
];

export default function BuyerReviewsPage() {
  const queryClient = useQueryClient();

  // 1. Fetch Reviews
  const {
    data: reviews,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['buyer-reviews'],
    queryFn: async () => reviewService.getMyReviews(),
  });

  const isQueryError = isError;

  React.useEffect(() => {
    if (isQueryError) {
      toast.error('Gagal memuat daftar ulasan. Koneksi ke server terputus.');
    }
  }, [isQueryError]);

  const activeReviews = isQueryError ? [] : reviews || [];

  // Render Stars helper
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${
              i < rating ? 'text-amber-400 fill-amber-400' : 'text-muted/40'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl text-foreground">
            Ulasan Saya
          </h1>
          <p className="text-sm text-muted-foreground">
            Kumpulan riwayat penilaian produk yang Anda beli.
          </p>
        </div>
      </div>

      {/* Reviews Cards List */}
      {isQueryError ? (
        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
          Gagal memuat daftar ulasan produk / Koneksi ke server terputus
        </div>
      ) : isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-28 w-full rounded-xl animate-pulse" />
          <Skeleton className="h-28 w-full rounded-xl animate-pulse" />
        </div>
      ) : activeReviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 text-center text-muted-foreground bg-card border border-border rounded-xl shadow-xs gap-3">
          <MessageSquare className="h-10 w-10 text-muted/60 animate-pulse" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-card-foreground">Belum Ada Ulasan</p>
            <p className="text-xs text-muted-foreground/80">
              Anda belum pernah menulis ulasan produk belanjaan.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {activeReviews.map((rev) => (
            <Card
              key={rev.id}
              className="border border-border bg-card hover:shadow-xs transition-shadow shadow-xs overflow-hidden"
            >
              <CardHeader className="p-5 pb-3 border-b border-border/60 flex flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground shrink-0">
                    <Sprout className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-card-foreground line-clamp-1">
                      {rev.product_title || 'Komoditas Pertanian'}
                    </h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Penilaian: {format(new Date(rev.created_at), 'dd MMM yyyy')}
                    </p>
                  </div>
                </div>
                <div>{renderStars(rev.rating)}</div>
              </CardHeader>
              <CardContent className="p-5">
                <p className="text-xs font-medium text-muted-foreground/90 leading-relaxed italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
