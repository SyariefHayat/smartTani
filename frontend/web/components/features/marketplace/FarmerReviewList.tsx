'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { marketplaceService } from '@/services/marketplace';
import { getStoredAuthUser } from '@/lib/auth-storage';

import { ReviewHeader } from './review-list/ReviewHeader';
import { ReviewStats } from './review-list/ReviewStats';
import { ReviewFilters } from './review-list/ReviewFilters';
import { ReviewItem } from './review-list/ReviewItem';
import { Review } from './review-list/types';

export function FarmerReviewList() {
  const user = getStoredAuthUser();
  const farmerId = user?.id;

  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: summaryResponse, isLoading: summaryLoading } = useQuery({
    queryKey: ['reviews-summary', farmerId],
    queryFn: () => marketplaceService.getReviewsSummary(farmerId!),
    enabled: !!farmerId,
  });

  const { data: reviewsResponse, isLoading: reviewsLoading } = useQuery({
    queryKey: ['farmer-reviews', farmerId, page],
    queryFn: () => marketplaceService.getFarmerReviews(farmerId!, { page, limit }),
    enabled: !!farmerId,
  });

  const summary = summaryResponse?.data;
  const rawReviews = reviewsResponse?.data || [];
  const total = reviewsResponse?.meta?.total || 0;
  const totalPages = Math.ceil(total / limit);

  // Filter reviews client-side based on search and rating (if not implemented in backend)
  // Note: Backend findByFarmerId doesn't support search/rating filtering yet.
  // For now, we'll do client-side filtering on the current page.
  const reviews: Review[] = rawReviews
    .map((r) => ({
      id: r._id,
      customerName: r.buyer_name,
      customerAvatar: '',
      productName: r.product_title || 'Produk tidak ditemukan',
      rating: r.rating,
      date: r.created_at,
      comment: r.comment,
      status: 'unreplied' as const, // Reply feature not implemented in backend yet
      reply: '',
    }))
    .filter((review) => {
      const matchesSearch =
        review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter;
      const matchesStatus = statusFilter === 'all' || review.status === statusFilter;

      return matchesSearch && matchesRating && matchesStatus;
    });

  return (
    <div className="w-full text-slate-900">
      <div className="mx-auto flex w-full flex-col gap-4">
        <ReviewHeader />

        <ReviewStats summary={summary} isLoading={summaryLoading} />

        <Card className="rounded-xl border border-slate-100 bg-white shadow-sm">
          <CardContent className="space-y-4 pt-4">
            <ReviewFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              ratingFilter={ratingFilter}
              setRatingFilter={setRatingFilter}
            />

            {/* Reviews List */}
            <div className="divide-y divide-slate-100 rounded-lg border border-slate-100 bg-white px-5">
              {reviewsLoading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="py-5 flex flex-col md:flex-row gap-6 border-b border-slate-100 last:border-b-0"
                  >
                    {/* Left Column: User & Rating */}
                    <div className="w-full md:w-64 shrink-0 flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex flex-col gap-1.5 flex-1">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-28" />
                      </div>
                    </div>

                    {/* Right Column: Content */}
                    <div className="flex-1 flex flex-col gap-3 min-w-0">
                      <div className="flex justify-between items-start gap-4">
                        <div className="min-w-0 flex-1 space-y-2">
                          <Skeleton className="h-3.5 w-40" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-5/6" />
                        </div>
                        <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                      </div>
                    </div>
                  </div>
                ))
              ) : reviews.length > 0 ? (
                reviews.map((review) => <ReviewItem key={review.id} review={review} />)
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center py-6">
                  <MessageCircle className="w-12 h-12 text-slate-300 mb-3" />
                  <p className="font-medium text-slate-600">Tidak ada ulasan ditemukan</p>
                  <p className="text-sm text-slate-400 mt-1 max-w-sm">
                    Coba sesuaikan kata kunci pencarian atau ubah filter untuk menemukan ulasan yang
                    Anda cari.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 bg-white cursor-pointer"
                    onClick={() => {
                      setSearchTerm('');
                      setRatingFilter('all');
                      setStatusFilter('all');
                    }}
                  >
                    Reset Filter
                  </Button>
                </div>
              )}
            </div>

            {/* Pagination */}
            {!reviewsLoading && total > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-100">
                <p className="text-sm text-slate-500">
                  Menampilkan{' '}
                  <span className="font-semibold text-slate-900">
                    {(page - 1) * limit + 1} - {Math.min(page * limit, total)}
                  </span>{' '}
                  dari <span className="font-semibold text-slate-900">{total}</span> ulasan
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer text-slate-700 bg-white"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Sebelumnya
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer text-slate-700 bg-white"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Berikutnya
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
