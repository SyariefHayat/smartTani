'use client';

import { useState } from 'react';
import { MessageCircle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
      status: 'unreplied', // Reply feature not implemented in backend yet
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

  const isLoading = summaryLoading || reviewsLoading;

  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-700" />
      </div>
    );
  }

  return (
    <div className="w-full text-slate-900">
      <div className="mx-auto flex w-full flex-col gap-4">
        <ReviewHeader />

        <ReviewStats summary={summary} />

        <ReviewFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          ratingFilter={ratingFilter}
          setRatingFilter={setRatingFilter}
        />

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((review) => <ReviewItem key={review.id} review={review} />)
          ) : (
            <Card className="border-none shadow-sm rounded-xl">
              <CardContent className="h-64 flex flex-col items-center justify-center text-center p-6">
                <MessageCircle className="w-12 h-12 text-slate-300 mb-3" />
                <p className="font-medium text-slate-600">Tidak ada ulasan ditemukan</p>
                <p className="text-sm text-slate-400 mt-1 max-w-sm">
                  Coba sesuaikan kata kunci pencarian atau ubah filter untuk menemukan ulasan yang
                  Anda cari.
                </p>
                <Button
                  variant="outline"
                  className="mt-4 bg-white"
                  onClick={() => {
                    setSearchTerm('');
                    setRatingFilter('all');
                    setStatusFilter('all');
                  }}
                >
                  Reset Filter
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pagination */}
        {total > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 mt-2">
            <p className="text-xs text-slate-500">
              Menampilkan{' '}
              <span className="font-medium text-slate-900">
                {(page - 1) * limit + 1} - {Math.min(page * limit, total)}
              </span>{' '}
              dari <span className="font-medium text-slate-900">{total}</span> ulasan
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-white border-slate-200"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <Button
                    key={i + 1}
                    size="sm"
                    className={cn(
                      'h-8 w-8 p-0 shadow-sm',
                      page === i + 1
                        ? 'bg-green-700 text-white hover:bg-green-800'
                        : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                    )}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-white border-slate-200"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
