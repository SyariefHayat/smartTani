'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { marketplaceService } from '@/services/marketplace';
import { getStoredAuthUser } from '@/lib/auth-storage';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';

const avatarColors = [
  { bg: 'bg-violet-100', text: 'text-violet-800' },
  { bg: 'bg-teal-100', text: 'text-teal-800' },
  { bg: 'bg-orange-100', text: 'text-orange-800' },
  { bg: 'bg-blue-100', text: 'text-blue-800' },
  { bg: 'bg-pink-100', text: 'text-pink-800' },
];

function getAvatarStyle(name: string) {
  const index = name.length % avatarColors.length;
  return avatarColors[index];
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= rating ? 'text-amber-400' : 'text-muted-foreground'}>
          ★
        </span>
      ))}
    </div>
  );
}

const CustomerReviews = ({ className }: { className?: string }) => {
  const user = getStoredAuthUser();
  const farmerId = user?.id;

  const { data: summaryResponse, isLoading: summaryLoading } = useQuery({
    queryKey: ['reviews-summary', farmerId],
    queryFn: () => marketplaceService.getReviewsSummary(farmerId!),
    enabled: !!farmerId,
  });

  const { data: reviewsResponse, isLoading: reviewsLoading } = useQuery({
    queryKey: ['farmer-reviews', farmerId],
    queryFn: () => marketplaceService.getFarmerReviews(farmerId!, { limit: 3 }),
    enabled: !!farmerId,
  });

  const summary = summaryResponse?.data;
  const reviews = reviewsResponse?.data || [];

  const ratingBreakdown = summary
    ? [5, 4, 3, 2, 1].map((star) => {
        const count = summary.rating_breakdown[star] || 0;
        const pct =
          summary.total_reviews > 0 ? Math.round((count / summary.total_reviews) * 100) : 0;
        return { star, pct };
      })
    : [];

  if (summaryLoading || reviewsLoading) {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24 mt-1" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full rounded-lg" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Ulasan pelanggan</p>
            <p className="text-xs text-muted-foreground">
              {summary?.total_reviews || 0} ulasan total
            </p>
          </div>
          <span className="text-xs bg-amber-50 text-amber-800 px-2 py-1 rounded-md">
            Toko terverifikasi
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Rating summary */}
        <div className="flex gap-5 items-center bg-muted/40 rounded-lg p-4">
          <div className="text-center shrink-0">
            <div className="text-4xl font-medium">{summary?.average_rating || 0}</div>
            <StarRow rating={Math.round(summary?.average_rating || 0)} />
            <p className="text-xs text-muted-foreground mt-1">dari 5</p>
          </div>
          <div className="flex-1 space-y-1.5">
            {ratingBreakdown.map(({ star, pct }) => (
              <div key={star} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-2 text-right">{star}</span>
                <span className="text-amber-400 text-[11px]">★</span>
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-7">{pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Review list */}
        <div className="divide-y">
          {reviews.length > 0 ? (
            reviews.map((r) => {
              const style = getAvatarStyle(r.buyer_name);
              return (
                <div key={r._id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex gap-3">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0',
                        style.bg,
                        style.text
                      )}
                    >
                      {getInitials(r.buyer_name)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{r.buyer_name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(r.created_at), {
                            addSuffix: true,
                            locale: localeId,
                          })}
                        </span>
                      </div>
                      <StarRow rating={r.rating} />
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {r.comment}
                      </p>
                      {r.product_title && (
                        <span className="text-[11px] bg-muted px-2 py-0.5 rounded mt-1.5 inline-block">
                          {r.product_title}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-6 text-center text-xs text-muted-foreground">
              Belum ada ulasan untuk toko ini.
            </div>
          )}
        </div>

        <button className="w-full text-sm text-muted-foreground border rounded-md py-2 hover:bg-muted transition-colors">
          Lihat semua ulasan
        </button>
      </CardContent>
    </Card>
  );
};

export default CustomerReviews;
