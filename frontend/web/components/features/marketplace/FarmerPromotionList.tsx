'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PromotionHeader } from './promotion-list/PromotionHeader';
import { PromotionStats } from './promotion-list/PromotionStats';
import { PromotionFilters } from './promotion-list/PromotionFilters';
import { PromotionTable } from './promotion-list/PromotionTable';
import { PromotionBanner } from './promotion-list/PromotionBanner';
import { promotionService } from '@/services/promotion';
import { useAuthStore } from '@/stores/auth';

export function FarmerPromotionList() {
  const user = useAuthStore((s) => s.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const {
    data: promos = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['promotions', { farmer_id: user?.id }],
    queryFn: () => promotionService.getPromotions(user?.id),
    enabled: !!user?.id,
  });

  const filteredPromos = promos.filter((promo) => {
    const matchesSearch =
      promo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (promo.code || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || promo.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleReset = () => {
    setSearchTerm('');
    setActiveTab('all');
  };

  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4 text-center">
        <p className="text-destructive">Gagal mengambil data promosi</p>
        <button
          onClick={() => window.location.reload()}
          className="text-sm font-medium text-green-600 hover:underline"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  return (
    <div className="w-full text-slate-900">
      <div className="mx-auto flex w-full flex-col gap-4">
        <PromotionHeader />

        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {isLoading ? (
                <div className="flex w-full gap-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : (
                <PromotionStats promos={promos} />
              )}
              <PromotionFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <PromotionTable promos={filteredPromos} onReset={handleReset} />
        )}
        <PromotionBanner />
      </div>
    </div>
  );
}
