'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { marketplaceService, GetProductsParams } from '@/services/marketplace';
import { toast } from 'sonner';

export function useFarmerProducts(farmerId?: string, params?: GetProductsParams) {
  return useQuery({
    queryKey: ['farmer-products', farmerId, params],
    queryFn: () => marketplaceService.getProducts({ ...params, farmer_id: farmerId }),
    enabled: !!farmerId,
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      marketplaceService.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmer-products'] });
      toast.success('Produk berhasil diperbarui');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Gagal memperbarui produk');
    },
  });
}
