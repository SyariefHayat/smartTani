'use client';

import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analytics';

export function useFarmerFinance(farmerId?: string, params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['farmer-finance', farmerId, params],
    queryFn: () => analyticsService.getFarmerFinance(farmerId!, params),
    enabled: !!farmerId,
  });
}
