'use client';

import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analytics';

export function useFarmerRevenueChart(
  farmerId?: string,
  params?: { from_date?: string; to_date?: string }
) {
  return useQuery({
    queryKey: ['farmer-revenue-chart', farmerId, params],
    queryFn: () => analyticsService.getFarmerRevenueChart(farmerId!, params),
    enabled: !!farmerId,
  });
}
