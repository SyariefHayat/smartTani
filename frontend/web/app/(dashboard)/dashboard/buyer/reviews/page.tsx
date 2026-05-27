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
      toast.error('Layanan ulasan offline. Menggunakan data demo lokal.', {
        description: 'Menampilkan data review simulasi agar Anda tetap dapat menjelajahi layout.',
        duration: 5000,
      });
    }
  }, [isQueryError]);

  const activeReviews = isQueryError ? MOCK_REVIEWS : reviews || MOCK_REVIEWS;

  // Render Stars helper
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${
              i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Reconnect Banner */}
      {isQueryError && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800 font-semibold shadow-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 animate-pulse" />
            <p>
              Mode Offline Simulasi: Koneksi ke server ulasan terputus. Menampilkan data lokal demo
              agar Anda tetap dapat menjelajahi layout.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-7 cursor-pointer border-amber-300 text-amber-800 bg-white hover:bg-amber-100 font-bold shrink-0 text-[10px]"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            <RefreshCw className={`mr-1 h-3 w-3 ${isRefetching ? 'animate-spin' : ''}`} />
            {isRefetching ? 'Hubungkan...' : 'Coba Hubungkan Kembali'}
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl text-slate-800">
            Ulasan Saya
          </h1>
          <p className="text-sm text-slate-500">
            Kumpulan riwayat penilaian produk yang Anda beli.
          </p>
        </div>
      </div>

      {/* Reviews Cards List */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-28 w-full rounded-xl animate-pulse" />
          <Skeleton className="h-28 w-full rounded-xl animate-pulse" />
        </div>
      ) : activeReviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 text-center text-slate-400 bg-white border border-slate-200 rounded-xl shadow-xs gap-3">
          <MessageSquare className="h-10 w-10 text-slate-300 animate-pulse" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-700">Belum Ada Ulasan</p>
            <p className="text-xs text-slate-400">
              Anda belum pernah menulis ulasan produk belanjaan.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {activeReviews.map((rev) => (
            <Card
              key={rev.id}
              className="border border-slate-200 bg-white hover:shadow-xs transition-shadow shadow-xs overflow-hidden"
            >
              <CardHeader className="p-5 pb-3 border-b border-slate-100 flex flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center text-green-600 shrink-0">
                    <Sprout className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 line-clamp-1">
                      {rev.product_title || 'Komoditas Pertanian'}
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Penilaian: {format(new Date(rev.created_at), 'dd MMM yyyy')}
                    </p>
                  </div>
                </div>
                <div>{renderStars(rev.rating)}</div>
              </CardHeader>
              <CardContent className="p-5">
                <p className="text-xs font-medium text-slate-600 leading-relaxed italic">
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
