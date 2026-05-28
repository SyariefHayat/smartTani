'use client';
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { investmentService } from '@/services/investment';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AdminStatsCards, AdminStatItem } from '@/components/features/admin/shared/AdminStatsCards';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import {
  TrendingUp,
  Search,
  Eye,
  AlertTriangle,
  ShieldCheck,
  Clock,
  CheckCircle2,
  User,
} from 'lucide-react';
import Link from 'next/link';

interface InvestmentRecord {
  id: string;
  proposal_id: string;
  proposal_title: string;
  investor_id: string;
  investor_name: string;
  amount: number;
  expected_roi: number;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
}

const MOCK_INVESTMENTS: InvestmentRecord[] = [
  {
    id: 'inv-1',
    proposal_id: 'prop-2',
    proposal_title: 'Pembangunan Greenhouse Melon Hidroponik',
    investor_id: 'usr-4',
    investor_name: 'Heri Susanto',
    amount: 25000000,
    expected_roi: 18,
    status: 'active',
    created_at: '2026-05-22T08:00:00Z',
  },
  {
    id: 'inv-2',
    proposal_id: 'prop-2',
    proposal_title: 'Pembangunan Greenhouse Melon Hidroponik',
    investor_id: 'usr-4',
    investor_name: 'Heri Susanto',
    amount: 15000000,
    expected_roi: 18,
    status: 'active',
    created_at: '2026-05-23T11:00:00Z',
  },
];

export default function AdminInvestmentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isOffline, setIsOffline] = React.useState(false);

  const status = searchParams.get('status') || 'all';

  // Initialize localStorage for investments
  React.useEffect(() => {
    if (!localStorage.getItem('admin-investments')) {
      localStorage.setItem('admin-investments', JSON.stringify(MOCK_INVESTMENTS));
    }
  }, []);

  // Fetch investments
  const { data: investments = [], isLoading } = useQuery<InvestmentRecord[]>({
    queryKey: ['admin-investments-list', status],
    queryFn: async () => {
      try {
        const res = await investmentService.getPortfolio(); // or admin endpoint
        return res.data as any;
      } catch {
        setIsOffline(true);
        const stored = JSON.parse(localStorage.getItem('admin-investments') || '[]');
        let filtered = [...stored];
        if (status !== 'all') {
          filtered = filtered.filter((i) => i.status === status);
        }
        return filtered;
      }
    },
  });

  // Calculate statistics from localStorage
  const stats = React.useMemo(() => {
    const stored = JSON.parse(
      (typeof window !== 'undefined' && localStorage.getItem('admin-investments')) ||
        JSON.stringify(MOCK_INVESTMENTS)
    );
    const totalCount = stored.length;
    const totalInvested = stored.reduce((acc: number, i: any) => acc + i.amount, 0);
    const active = stored.filter((i: any) => i.status === 'active').length;
    const completed = stored.filter((i: any) => i.status === 'completed').length;
    return { totalCount, totalInvested, active, completed };
  }, [investments]);

  const updateFilters = (newStatus: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newStatus === 'all') params.delete('status');
    else params.set('status', newStatus);
    router.push(`/admin/investments?${params.toString()}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-purple-100 text-purple-700 border-purple-200">
            Aktif (Berjalan)
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200">Selesai (ROI Cair)</Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const statCards: AdminStatItem[] = [
    {
      label: 'Dana Terhimpun',
      value: `Rp ${stats.totalInvested.toLocaleString('id-ID')}`,
      icon: TrendingUp,
      color: 'text-slate-700',
      bgColor: 'bg-slate-100',
      description: 'Akumulasi dana investasi platform',
    },
    {
      label: 'Transaksi Funding',
      value: stats.totalCount,
      icon: Clock,
      color: 'text-amber-700',
      bgColor: 'bg-amber-100',
      description: 'Jumlah penanaman modal sukses',
    },
    {
      label: 'Funding Aktif',
      value: stats.active,
      icon: ShieldCheck,
      color: 'text-blue-700',
      bgColor: 'bg-blue-100',
      description: 'Proyek tani sedang berjalan',
    },
    {
      label: 'Proyek Selesai',
      value: stats.completed,
      icon: CheckCircle2,
      color: 'text-green-700',
      bgColor: 'bg-green-100',
      description: 'Bagi hasil ROI telah cair',
    },
  ];

  return (
    <div className="w-full space-y-6 text-slate-900 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-1.5 md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Kelola Investasi & Permodalan 💼
          </h1>
          <p className="text-xs font-semibold text-slate-500">
            Kendalikan and awasi aliran pembiayaan modal petani, monitoring ROI bagi hasil, and
            tracking transaksi pendanaan investor.
          </p>
        </div>
      </div>

      {isOffline && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-800">Modus Simulasi Luring Aktif</h4>
            <p className="text-[11px] font-semibold text-amber-600 mt-0.5">
              Investment Service sedang tidak terhubung. Histori pemodalan dimuat secara luring.
            </p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <AdminStatsCards stats={statCards} loading={isLoading} />

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 flex justify-between items-center">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
          Daftar Manifest Investasi
        </span>
        <div>
          <Select value={status} onValueChange={updateFilters}>
            <SelectTrigger className="w-[180px] bg-white border-slate-200 text-xs rounded-xl focus:ring-green-500 h-10">
              <SelectValue placeholder="Pilih Status" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 rounded-xl">
              <SelectItem value="all" className="text-xs cursor-pointer">
                Semua Status
              </SelectItem>
              <SelectItem value="active" className="text-xs cursor-pointer">
                Aktif (Berjalan)
              </SelectItem>
              <SelectItem value="completed" className="text-xs cursor-pointer">
                Selesai (Bagi Hasil)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Investments Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50/70 border-b border-slate-100">
            <TableRow>
              <TableHead className="text-xs font-bold text-slate-700 p-4">
                Proposal Proyek
              </TableHead>
              <TableHead className="text-xs font-bold text-slate-700">Investor</TableHead>
              <TableHead className="text-xs font-bold text-slate-700">Nilai Investasi</TableHead>
              <TableHead className="text-xs font-bold text-slate-700">Ekspektasi ROI</TableHead>
              <TableHead className="text-xs font-bold text-slate-700">Status</TableHead>
              <TableHead className="text-xs font-bold text-slate-700 p-4">Tanggal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-xs font-semibold text-slate-700">
            {isLoading ? (
              [...Array(2)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="p-4">
                    <div className="h-4 bg-slate-100 rounded w-40 animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-slate-100 rounded w-24 animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-slate-100 rounded w-20 animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-slate-100 rounded w-12 animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-slate-100 rounded w-20 animate-pulse" />
                  </TableCell>
                  <TableCell className="p-4">
                    <div className="h-4 bg-slate-100 rounded w-20 animate-pulse" />
                  </TableCell>
                </TableRow>
              ))
            ) : investments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-slate-400 font-semibold">
                  Tidak ada data permodalan masuk.
                </TableCell>
              </TableRow>
            ) : (
              investments.map((inv) => (
                <TableRow key={inv.id} className="hover:bg-slate-50/40 border-b border-slate-100">
                  <TableCell className="p-4 font-bold text-slate-800 max-w-[250px] truncate">
                    {inv.proposal_title}
                  </TableCell>
                  <TableCell className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    {inv.investor_name}
                  </TableCell>
                  <TableCell className="font-bold text-green-700">
                    Rp {inv.amount.toLocaleString('id-ID')}
                  </TableCell>
                  <TableCell className="text-purple-700 font-bold">
                    {inv.expected_roi}% per musim
                  </TableCell>
                  <TableCell>{getStatusBadge(inv.status)}</TableCell>
                  <TableCell className="p-4 text-slate-400">
                    {new Date(inv.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
