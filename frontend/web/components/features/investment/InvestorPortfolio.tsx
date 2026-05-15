'use client';

import { useQuery } from '@tanstack/react-query';
import { investmentService, Investment } from '@/services/investment';
import { useAuthStore } from '@/stores/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Wallet, TrendingUp, Landmark, PieChart } from 'lucide-react';

export function InvestorPortfolio() {
  const user = useAuthStore((state) => state.user);

  const { data: portfolioResponse, isLoading } = useQuery({
    queryKey: ['portfolio', user?.id],
    queryFn: () => investmentService.getPortfolio(),
    enabled: !!user?.id,
  });

  const investments = portfolioResponse?.data || [];
  const summary = portfolioResponse?.message;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">Aktif</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Selesai</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (user && user.role !== 'investor') {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-red-600">Akses Ditolak</h1>
        <p className="text-gray-500">Halaman ini hanya untuk investor.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Portofolio Investasi</h1>
        <p className="text-gray-500">Pantau pertumbuhan aset dan hasil investasi Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Investasi</CardTitle>
            <Wallet className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <div className="text-2xl font-bold">{formatCurrency(summary?.total_invested || 0)}</div>
            )}
            <p className="text-xs text-gray-500 mt-1">Ditempatkan di {summary?.total_investments || 0} proyek</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Proyeksi Return</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(summary?.total_projected_return || 0)}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">Estimasi hasil saat panen</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Realisasi Return</CardTitle>
            <Landmark className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(summary?.total_actual_return || 0)}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">Hasil yang sudah diterima</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Daftar Investasi</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Proyek / Proposal</TableHead>
              <TableHead>Komoditas</TableHead>
              <TableHead>Jumlah Investasi</TableHead>
              <TableHead>ROI Proyeksi</TableHead>
              <TableHead>ROI Aktual</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-10 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                </TableRow>
              ))
            ) : investments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-20 text-gray-500">
                  <PieChart className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  Anda belum memiliki investasi. 
                  Mulailah berinvestasi pada proyek tani yang tersedia.
                </TableCell>
              </TableRow>
            ) : (
              investments.map((inv: Investment) => (
                <TableRow key={inv.id}>
                  <TableCell>
                    <div className="font-medium text-gray-900">{inv.proposal.title}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(inv.invested_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  </TableCell>
                  <TableCell>{inv.proposal.commodity}</TableCell>
                  <TableCell>{formatCurrency(Number(inv.amount))}</TableCell>
                  <TableCell className="text-blue-600 font-medium">
                    +{inv.proposal.projected_roi_percent}%
                  </TableCell>
                  <TableCell>
                    {inv.status === 'completed' && inv.actual_return ? (
                      <span className="text-green-600 font-medium">
                        {formatCurrency(Number(inv.actual_return))}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(inv.status)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
