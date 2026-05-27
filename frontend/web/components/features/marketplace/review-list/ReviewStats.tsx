'use client';

import { MessageCircle, Reply, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ReviewSummary } from '@/services/marketplace';

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }).map((_, index) => (
    <Star
      key={index}
      className={cn(
        'w-4 h-4',
        index < Math.round(rating)
          ? 'fill-yellow-400 text-yellow-400'
          : 'fill-slate-100 text-slate-200'
      )}
    />
  ));
};

interface ReviewStatsProps {
  summary?: ReviewSummary;
  isLoading?: boolean;
}

export function ReviewStats({ summary, isLoading }: ReviewStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Rating Card Skeleton */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-5 flex items-center gap-6">
            <div className="flex flex-col items-center justify-center space-y-2 border-r pr-6 shrink-0 h-[100px] w-[130px]">
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-12" />
            </div>
            <div className="flex-1 space-y-2.5">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2">
                  <Skeleton className="h-3 w-3" />
                  <Skeleton className="h-3 w-3" />
                  <Skeleton className="flex-1 h-1.5 rounded-full" />
                  <Skeleton className="h-3 w-6" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Total Reviews Card Skeleton */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-5 flex flex-col justify-between h-full min-h-[140px]">
            <div className="flex items-center gap-4">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
            <Skeleton className="h-8 w-full mt-4" />
          </CardContent>
        </Card>

        {/* Reply Needed Card Skeleton */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-5 flex flex-col justify-between h-full min-h-[140px]">
            <div className="flex items-center gap-4">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
            <Skeleton className="h-8 w-full mt-4" />
          </CardContent>
        </Card>
      </div>
    );
  }
  const avgRating = summary?.average_rating || 0;
  const totalReviews = summary?.total_reviews || 0;
  const breakdown = summary?.rating_breakdown || {};

  const positivePercent =
    totalReviews > 0
      ? Math.round(((Number(breakdown[5] || 0) + Number(breakdown[4] || 0)) / totalReviews) * 100)
      : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Average Rating Card */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-5 flex items-center gap-6">
          <div className="flex flex-col items-center justify-center space-y-1 border-r pr-6 shrink-0">
            <span className="text-4xl font-bold text-slate-900 leading-none">
              {avgRating.toFixed(1)}
            </span>
            <div className="flex gap-0.5 mt-2">{renderStars(avgRating)}</div>
            <span className="text-[10px] text-slate-400 font-semibold mt-1">dari 5.0</span>
          </div>
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = Number(breakdown[rating] || 0);
              const percent = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;

              return (
                <div key={rating} className="flex items-center gap-2 text-xs">
                  <span className="w-2 font-semibold text-slate-600">{rating}</span>
                  <Star
                    className={cn(
                      'w-3 h-3',
                      percent > 0
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-slate-200 text-slate-200'
                    )}
                  />
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-[10px] text-slate-400 font-mono">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Total Reviews Card */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-5 flex flex-col justify-between h-full min-h-[140px]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold">Total Ulasan</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
                {totalReviews.toLocaleString('id-ID')}
              </h3>
            </div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed mt-4">
            Sebanyak <span className="font-semibold text-slate-700">{positivePercent}%</span>{' '}
            pembeli memberikan rating positif (4-5 bintang) untuk produk Anda.
          </p>
        </CardContent>
      </Card>

      {/* Reply Needed Card */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-5 flex flex-col justify-between h-full min-h-[140px]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
              <Reply className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold">Perlu Dibalas</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">0</h3>
            </div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed mt-4">
            Merespon ulasan pelanggan dapat meningkatkan kepercayaan dan reputasi toko Anda secara
            signifikan.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
