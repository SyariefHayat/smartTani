'use client';
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { investmentService, Proposal } from '@/services/investment';
import { ProposalTable } from '@/components/features/admin/proposals/ProposalTable';
import { ProposalFilter } from '@/components/features/admin/proposals/ProposalFilter';
import { AdminStatsCards, AdminStatItem } from '@/components/features/admin/shared/AdminStatsCards';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  AlertTriangle,
  Sprout,
} from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const MOCK_PROPOSALS: Proposal[] = [
  {
    id: 'prop-1',
    farmer_id: 'usr-1',
    title: 'Modernisasi Irigasi Tetes Cabe Rawit',
    description:
      'Pengadaan sistem irigasi otomatis hemat air berbasis sensor kelembaban tanah untuk mengoptimalkan panen cabe rawit kelompok tani.',
    commodity: 'Cabe Rawit',
    funding_needed: 25000000,
    min_investment: 100000,
    duration_months: 6,
    expected_roi_percent: 15,
    status: 'submitted',
    created_at: '2026-05-28T09:00:00Z',
    updated_at: '2026-05-28T09:00:00Z',
    images: [],
  } as any,
  {
    id: 'prop-2',
    farmer_id: 'usr-1',
    title: 'Pembangunan Greenhouse Melon Hidroponik',
    description:
      'Greenhouse tipe tunnel seluas 200m2 untuk budidaya melon premium sistem NFT di Lamongan.',
    commodity: 'Melon',
    funding_needed: 50000000,
    min_investment: 200000,
    duration_months: 8,
    expected_roi_percent: 18,
    status: 'approved',
    created_at: '2026-05-20T08:00:00Z',
    updated_at: '2026-05-22T08:00:00Z',
    images: [],
  } as any,
  {
    id: 'prop-3',
    farmer_id: 'usr-9',
    title: 'Ekspansi Lahan Padi Organik Varietas Mentik Susu',
    description:
      'Perluasan sewa lahan persawahan organik seluas 1 hektar dengan sertifikasi bebas pestisida kimia.',
    commodity: 'Padi',
    funding_needed: 35000000,
    min_investment: 150000,
    duration_months: 5,
    expected_roi_percent: 12,
    status: 'submitted',
    created_at: '2026-05-27T10:00:00Z',
    updated_at: '2026-05-27T10:00:00Z',
    images: [],
  } as any,
  {
    id: 'prop-4',
    farmer_id: 'usr-9',
    title: 'Budidaya Jamur Tiram Putih Media Baglog',
    description:
      'Penyusunan kumbung jamur tiram kapasitas 5000 baglog lengkap dengan pengabut air otomatis.',
    commodity: 'Jamur',
    funding_needed: 15000000,
    min_investment: 50000,
    duration_months: 4,
    expected_roi_percent: 10,
    status: 'rejected',
    created_at: '2026-05-25T11:00:00Z',
    updated_at: '2026-05-25T14:00:00Z',
    images: [],
  } as any,
];

export default function AdminProposalsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [isOffline, setIsOffline] = React.useState(false);
  const [searchVal, setSearchVal] = React.useState(searchParams.get('search') || '');

  const status = searchParams.get('status') || 'all';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const search = searchParams.get('search') || '';

  // Initialize localStorage for proposals
  React.useEffect(() => {
    if (!localStorage.getItem('admin-proposals')) {
      localStorage.setItem('admin-proposals', JSON.stringify(MOCK_PROPOSALS));
    }
  }, []);

  // Fetch Proposals Query
  const { data, isLoading } = useQuery<any>({
    queryKey: ['admin-proposals-list', status, page, search],
    queryFn: async () => {
      try {
        const params = {
          status: status === 'all' ? undefined : status,
          page,
          limit: 10,
        };
        const res = await investmentService.getProposals(params);
        let list = res.data.proposals;

        if (search) {
          list = list.filter(
            (p) =>
              p.title.toLowerCase().includes(search.toLowerCase()) ||
              p.commodity.toLowerCase().includes(search.toLowerCase())
          );
        }

        return {
          proposals: list,
          meta: {
            page,
            limit: 10,
            total: list.length,
            totalPages: Math.ceil(list.length / 10) || 1,
          },
        };
      } catch {
        setIsOffline(true);
        const stored = JSON.parse(localStorage.getItem('admin-proposals') || '[]');
        let filtered = [...stored];
        if (status !== 'all') {
          filtered = filtered.filter((p) => p.status === status);
        }
        if (search) {
          filtered = filtered.filter(
            (p) =>
              p.title.toLowerCase().includes(search.toLowerCase()) ||
              p.commodity.toLowerCase().includes(search.toLowerCase())
          );
        }

        return {
          proposals: filtered.slice((page - 1) * 10, page * 10),
          meta: {
            page,
            limit: 10,
            total: filtered.length,
            totalPages: Math.ceil(filtered.length / 10) || 1,
          },
        };
      }
    },
  });

  // Calculate statistics from localStorage
  const stats = React.useMemo(() => {
    const stored = JSON.parse(
      (typeof window !== 'undefined' && localStorage.getItem('admin-proposals')) ||
        JSON.stringify(MOCK_PROPOSALS)
    );
    const total = stored.length;
    const pending = stored.filter(
      (p: any) => p.status === 'submitted' || p.status === 'pending'
    ).length;
    const approved = stored.filter(
      (p: any) => p.status === 'approved' || p.status === 'open_for_funding'
    ).length;
    const rejected = stored.filter((p: any) => p.status === 'rejected').length;
    return { total, pending, approved, rejected };
  }, [data]);

  // Debounce search sync to URL
  React.useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchVal) params.set('search', searchVal);
      else params.delete('search');
      params.set('page', '1');
      router.push(`/admin/proposals?${params.toString()}`);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchVal, router, searchParams]);

  const updateFilters = (newStatus: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newStatus === 'all') params.delete('status');
    else params.set('status', newStatus);

    params.set('page', '1');
    router.push(`/admin/proposals?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/admin/proposals?${params.toString()}`);
  };

  // Inline Approve/Reject Proposal mutations
  const approveMutation = useMutation({
    mutationFn: async (proposalId: string) => {
      try {
        await investmentService.approveProposal(proposalId);
      } catch {
        const stored: Proposal[] = JSON.parse(localStorage.getItem('admin-proposals') || '[]');
        const updated = stored.map((p) => (p.id === proposalId ? { ...p, status: 'approved' } : p));
        localStorage.setItem('admin-proposals', JSON.stringify(updated));
      }
    },
    onSuccess: () => {
      toast.success('Proposal investasi berhasil disetujui!');
      queryClient.invalidateQueries({ queryKey: ['admin-proposals-list'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (proposalId: string) => {
      try {
        await investmentService.rejectProposal(proposalId, 'Ditolak oleh administrator platform.');
      } catch {
        const stored: Proposal[] = JSON.parse(localStorage.getItem('admin-proposals') || '[]');
        const updated = stored.map((p) => (p.id === proposalId ? { ...p, status: 'rejected' } : p));
        localStorage.setItem('admin-proposals', JSON.stringify(updated));
      }
    },
    onSuccess: () => {
      toast.error('Proposal investasi telah ditolak.');
      queryClient.invalidateQueries({ queryKey: ['admin-proposals-list'] });
    },
  });

  const statCards: AdminStatItem[] = [
    {
      label: 'Total Proposal',
      value: stats.total,
      icon: ClipboardList,
      color: 'text-slate-700',
      bgColor: 'bg-slate-100',
      description: 'Jumlah pengajuan penggalangan dana',
    },
    {
      label: 'Menunggu Review',
      value: stats.pending,
      icon: Clock,
      color: 'text-amber-700',
      bgColor: 'bg-amber-100',
      description: 'Pengajuan baru butuh kelayakan',
    },
    {
      label: 'Telah Disetujui',
      value: stats.approved,
      icon: CheckCircle2,
      color: 'text-green-700',
      bgColor: 'bg-green-100',
      description: 'Siap didanai oleh investor',
    },
    {
      label: 'Ditolak',
      value: stats.rejected,
      icon: XCircle,
      color: 'text-red-700',
      bgColor: 'bg-red-100',
      description: 'Pengajuan tidak memenuhi syarat',
    },
  ];

  return (
    <div className="w-full space-y-6 text-slate-900 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-1.5 md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Kelola Proposal Investasi 📋
          </h1>
          <p className="text-xs font-semibold text-slate-500">
            Review and moderasi pengajuan investasi modal kelompok tani, uji kalkulasi kelayakan
            komoditas, and approve penggalangan dana secara langsung.
          </p>
        </div>
      </div>

      {isOffline && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-800">Modus Simulasi Luring Aktif</h4>
            <p className="text-[11px] font-semibold text-amber-600 mt-0.5">
              Investment Service sedang tidak terhubung. Seluruh persetujuan proposal disimpan
              luring.
            </p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <AdminStatsCards stats={statCards} loading={isLoading} />

      {/* Search and Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Cari proposal atau komoditas..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="bg-white border-slate-200 text-xs font-semibold focus:ring-green-500 rounded-xl pl-9.5 h-10 w-full"
            />
          </div>

          <ProposalFilter status={status} onStatusChange={updateFilters} />
        </div>
      </div>

      {/* Table grid */}
      <ProposalTable
        proposals={data?.proposals || []}
        loading={isLoading}
        onApprove={(id) => approveMutation.mutate(id)}
        onReject={(id) => rejectMutation.mutate(id)}
      />

      {/* Pagination */}
      {data && data.meta.totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                    if (page > 1) handlePageChange(page - 1);
                  }}
                  className={page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              {[...Array(data.meta.totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.preventDefault();
                      handlePageChange(i + 1);
                    }}
                    isActive={page === i + 1}
                    className="cursor-pointer"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                    if (page < data.meta.totalPages) handlePageChange(page + 1);
                  }}
                  className={
                    page >= data.meta.totalPages
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
