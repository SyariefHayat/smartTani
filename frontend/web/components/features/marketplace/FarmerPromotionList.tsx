'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { PromotionHeader } from './promotion-list/PromotionHeader';
import { PromotionStats } from './promotion-list/PromotionStats';
import { PromotionTable } from './promotion-list/PromotionTable';
import { PromotionFormDialog } from './promotion-list/PromotionFormDialog';
import { PromotionDetailDialog } from './promotion-list/PromotionDetailDialog';
import { promotionService } from '@/services/promotion';
import { useAuthStore } from '@/stores/auth';
import { Promotion as UIPromotion, PromotionTableActions } from './promotion-list/types';

export function FarmerPromotionList() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('all');

  // Dialog States
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [selectedPromo, setSelectedPromo] = React.useState<UIPromotion | null>(null);

  const mockPromotions = React.useMemo(
    () => [
      {
        _id: 'mock-promo-1',
        farmer_id: 'mock-farmer',
        product_ids: [],
        title: 'Diskon Awal Musim Tanam',
        code: 'TANAMMURAH',
        type: 'discount_percent' as const,
        value: 10,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        usageCount: 24,
        limit: 100,
        status: 'active' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: 'mock-promo-2',
        farmer_id: 'mock-farmer',
        product_ids: [],
        title: 'Subsidi Ongkir Jawa Timur',
        code: 'ONGKIRJATIM',
        type: 'discount_amount' as const,
        value: 15000,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        usageCount: 89,
        limit: 100,
        status: 'active' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: 'mock-promo-3',
        farmer_id: 'mock-farmer',
        product_ids: [],
        title: 'Promo Gajian Tani',
        code: 'GAJIANTANI',
        type: 'discount_percent' as const,
        value: 5,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        usageCount: 0,
        limit: 50,
        status: 'scheduled' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    []
  );

  const {
    data: rawPromos = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['promotions', { farmer_id: user?.id }],
    queryFn: async () => {
      if (!user?.id) return [];
      const data = await promotionService.getPromotions(user.id);
      // Map mock values for UI compatibility if needed
      return data.map((p) => {
        const uiPromo = p as unknown as UIPromotion;
        return {
          ...uiPromo,
          code:
            uiPromo.code ||
            uiPromo.title.slice(0, 4).toUpperCase() + Math.floor(100 + Math.random() * 900),
          usageCount: uiPromo.usageCount || Math.floor(Math.random() * 15),
          limit: uiPromo.limit || 100,
        };
      });
    },
    enabled: !!user?.id,
  });

  const isOffline = !!error;

  React.useEffect(() => {
    if (isOffline) {
      toast.error('Layanan promosi sedang offline. Menggunakan data demo lokal.');
    }
  }, [isOffline]);

  const promos = React.useMemo(() => {
    if (isOffline || !rawPromos || rawPromos.length === 0) {
      return mockPromotions;
    }
    return rawPromos;
  }, [rawPromos, isOffline, mockPromotions]);

  // Toggle status mutation
  const toggleMutation = useMutation({
    mutationFn: (promo: UIPromotion) => {
      const nextStatus = promo.status === 'active' ? 'inactive' : 'active';
      return promotionService.updatePromotion(promo._id, { status: nextStatus });
    },
    onSuccess: () => {
      toast.success('Berhasil', { description: 'Status promo berhasil diubah.' });
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error('Gagal', {
        description: err?.response?.data?.message || 'Gagal mengubah status promo',
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => promotionService.deletePromotion(id),
    onSuccess: () => {
      toast.success('Berhasil', { description: 'Promo berhasil dihapus.' });
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      setDeleteOpen(false);
      setSelectedPromo(null);
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error('Gagal', {
        description: err?.response?.data?.message || 'Gagal menghapus promo',
      });
    },
  });

  const tableActions: PromotionTableActions = React.useMemo(
    () => ({
      onViewDetail: (promo) => {
        setSelectedPromo(promo);
        setDetailOpen(true);
      },
      onEdit: (promo) => {
        setSelectedPromo(promo);
        setEditOpen(true);
      },
      onToggleStatus: (promo) => {
        toggleMutation.mutate(promo);
      },
      onDelete: (promo) => {
        setSelectedPromo(promo);
        setDeleteOpen(true);
      },
    }),
    [toggleMutation]
  );

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

  React.useEffect(() => {
    if (error) {
      toast.error(
        'Gagal memuat data promosi: ' +
          (error instanceof Error ? error.message : 'Terjadi kesalahan')
      );
    }
  }, [error]);

  return (
    <div className="w-full text-slate-900">
      <div className="mx-auto flex w-full flex-col gap-4">
        <PromotionHeader onAddPromo={() => setCreateOpen(true)} />

        {isOffline && (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800 font-semibold shadow-xs">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-600 animate-pulse" />
              <p>
                Layanan Promosi Offline: Gagal memuat data teraktual. Menggunakan data demo lokal.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-red-300 text-red-800 bg-white hover:bg-red-100 font-bold shrink-0 text-[10px] cursor-pointer"
              onClick={() => refetch()}
              disabled={isRefetching}
            >
              {isRefetching ? 'Menghubungkan...' : 'Coba Hubungkan Kembali'}
            </Button>
          </div>
        )}

        <PromotionStats promos={promos} />

        <PromotionTable
          promos={filteredPromos}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onReset={handleReset}
          actions={tableActions}
          isLoading={isLoading}
        />
      </div>

      {/* Create Promotion Dialog */}
      <PromotionFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        promo={null}
        farmerId={user?.id}
      />

      {/* Edit Promotion Dialog */}
      <PromotionFormDialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setSelectedPromo(null);
        }}
        promo={selectedPromo}
        farmerId={user?.id}
      />

      {/* Performance Detail Dialog */}
      <PromotionDetailDialog
        open={detailOpen}
        onOpenChange={(open) => {
          setDetailOpen(open);
          if (!open) setSelectedPromo(null);
        }}
        promo={selectedPromo}
        farmerId={user?.id}
      />

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="bg-white text-slate-900">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kampanye Promo</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus promo <strong>{selectedPromo?.title}</strong>? Aksi
              ini permanen dan kupon tidak akan bisa digunakan lagi oleh pembeli.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="cursor-pointer"
              onClick={() => {
                setDeleteOpen(false);
                setSelectedPromo(null);
              }}
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90 cursor-pointer"
              onClick={() => {
                if (selectedPromo) {
                  deleteMutation.mutate(selectedPromo._id);
                }
              }}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Menghapus...' : 'Hapus Promo'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
