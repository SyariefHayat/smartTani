'use client';

import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analytics';

export function useFarmerAnalytics(farmerId?: string) {
  return useQuery({
    queryKey: ['farmer-analytics', farmerId],
    queryFn: () => analyticsService.getFarmerAnalytics(farmerId!),
    enabled: !!farmerId,
  });
}
