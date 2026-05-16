'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { logisticsService, Shipment } from '@/services/logistics';
import { ShipmentTable } from '@/components/features/logistics/shipments/ShipmentTable';
import { ShipmentFilter } from '@/components/features/logistics/shipments/ShipmentFilter';
import { toast } from 'sonner';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export default function LogisticsShipmentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [meta, setMeta] = useState({ total_pages: 1 });
  const [loading, setLoading] = useState(true);

  const status = searchParams.get('status') || 'all';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const fetchShipments = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        status: status === 'all' ? undefined : status,
        page,
        limit: 10,
      };
      const response = await logisticsService.getShipments(params);
      setShipments(response.data);
      setMeta(response.meta);
    } catch (error) {
      console.error('Failed to fetch shipments:', error);
      toast.error('Gagal memuat data pengiriman');
    } finally {
      setLoading(false);
    }
  }, [status, page]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchShipments();
  }, [fetchShipments]);

  const updateFilters = (newStatus: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newStatus === 'all') params.delete('status');
    else params.set('status', newStatus);

    params.set('page', '1');
    router.push(`/shipments?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/shipments?${params.toString()}`);
  };

  const handleUpdateStatus = async (orderId: string, targetStatus: string, notes?: string) => {
    try {
      switch (targetStatus) {
        case 'pickup':
          await logisticsService.pickupShipment(orderId, notes);
          break;
        case 'transit':
          await logisticsService.transitShipment(orderId, notes);
          break;
        case 'deliver':
          await logisticsService.deliverShipment(orderId, notes);
          break;
        default:
          throw new Error('Status target tidak valid');
      }
      toast.success(`Status pengiriman berhasil diperbarui ke ${targetStatus}`);

      fetchShipments();
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error(
        (error as any).response?.data?.error?.message || 'Gagal memperbarui status pengiriman'
      );
      throw error;
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Manajemen Pengiriman</h2>
      </div>

      <ShipmentFilter status={status} onStatusChange={updateFilters} />

      <ShipmentTable shipments={shipments} loading={loading} onUpdateStatus={handleUpdateStatus} />

      {meta.total_pages > 1 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) handlePageChange(page - 1);
                  }}
                  className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              {[...Array(meta.total_pages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(i + 1);
                    }}
                    isActive={page === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < meta.total_pages) handlePageChange(page + 1);
                  }}
                  className={page >= meta.total_pages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
