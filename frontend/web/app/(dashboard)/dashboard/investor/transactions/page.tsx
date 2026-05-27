'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { investmentService } from '@/services/investment';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ArrowUpRight,
  ArrowDownLeft,
  AlertTriangle,
  RefreshCw,
  Layers,
  Wallet,
} from 'lucide-react';

interface TransactionItem {
  id: string;
  date: string;
  type: 'investment' | 'fee' | 'return';
  proposal_title?: string;
  amount: number;
  status: string;
}

const MOCK_TRANSACTIONS: TransactionItem[] = [
  {
    id: 'TX-9901',
    date: '2026-05-20T08:05:00Z',
    type: 'investment', // Outflow
    proposal_title: 'Budidaya Cabai Merah Keriting Hidroponik',
    amount: 15000000,
    status: 'completed',
  },
  {
    id: 'TX-9902',
    date: '2026-05-20T08:05:00Z',
    type: 'fee', // Outflow
    proposal_title: 'Biaya Layanan Platform (Budidaya Cabai)',
    amount: 300000,
    status: 'completed',
  },
  {
    id: 'TX-8871',
    date: '2026-05-15T14:10:00Z',
    type: 'investment', // Outflow
    proposal_title: 'Peningkatan Hasil Panen Padi Mentik Wangi',
    amount: 25000000,
    status: 'completed',
  },
  {
    id: 'TX-8872',
    date: '2026-05-15T14:10:00Z',
    type: 'fee', // Outflow
    proposal_title: 'Biaya Layanan Platform (Peningkatan Padi)',
    amount: 500000,
    status: 'completed',
  },
  {
    id: 'TX-6610',
    date: '2026-04-12T10:30:00Z',
    type: 'investment', // Outflow
    proposal_title: 'Pengembangan Perkebunan Tomat Organik',
    amount: 8000000,
    status: 'completed',
  },
  {
    id: 'TX-7221',
    date: '2026-07-11T12:00:00Z',
    type: 'return', // Inflow
    proposal_title: 'Bagi Hasil Panen Raya (Budidaya Tomat Organik)',
    amount: 9280000,
    status: 'completed',
  },
];

export default function InvestorTransactionsPage() {
  const {
    data: portfolioResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['investor-transactions-list'],
    queryFn: () => investmentService.getPortfolio(),
  });

  const isQueryError = isError;

  React.useEffect(() => {
    if (isQueryError) {
      toast.error('Layanan transaksi offline. Menggunakan data demo lokal.', {
        description:
          'Menampilkan data mutasi rekening simulasi agar Anda tetap dapat menjelajahi layout.',
        duration: 5000,
      });
    }
  }, [isQueryError]);

  const rawInvestments = isQueryError ? null : portfolioResponse?.data;

  // Build a chronological transaction ledger dynamically if API works
  const transactions = React.useMemo(() => {
    if (isQueryError || !rawInvestments) {
      // Sort mock by date descending
      return [...MOCK_TRANSACTIONS].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }

    const list: TransactionItem[] = [];
    rawInvestments.forEach((inv) => {
      // 1. Add investment item
      list.push({
        id: `TX-I${inv.id.slice(-4)}`,
        date: inv.invested_at,
        type: 'investment',
        proposal_title: inv.proposal.title,
        amount: Number(inv.amount),
        status: 'completed',
      });

      // 2. Add platform fee item (approx 2%)
      list.push({
        id: `TX-F${inv.id.slice(-4)}`,
        date: inv.invested_at,
        type: 'fee',
        proposal_title: `Biaya Layanan Platform (${inv.proposal.commodity})`,
        amount: Number(inv.amount) * 0.02,
        status: 'completed',
      });

      // 3. Add ROI return item if completed
      if (inv.status === 'completed' && inv.actual_return) {
        list.push({
          id: `TX-R${inv.id.slice(-4)}`,
          date: inv.completed_at || inv.invested_at, // Completed at fallback
          type: 'return',
          proposal_title: `Bagi Hasil Panen (${inv.proposal.title})`,
          amount: Number(inv.actual_return),
          status: 'completed',
        });
      }
    });

    // Sort by date descending
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [rawInvestments, isQueryError]);

  if (isLoading && !isQueryError) {
    return (
      <div className="w-full space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Offline Alert */}
      {isQueryError && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 shadow-xs">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-xs font-bold">Layanan Transaksi Offline</p>
              <p className="text-[10px] text-amber-600 font-medium">
                Menampilkan data mutasi simulasi. Beberapa data transaksi baru hanya disimpan lokal.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="h-7 text-[10px] font-bold border-amber-300 text-amber-700 bg-white hover:bg-amber-100 hover:text-amber-800 cursor-pointer flex items-center gap-1 shrink-0"
          >
            <RefreshCw className="h-3 w-3" /> Coba Hubungkan Kembali
          </Button>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Riwayat Transaksi</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Audit seluruh mutasi debet/kredit dompet dan pendanaan modal Anda secara realtime.
        </p>
      </div>

      {/* Ledger Card Container */}
      <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-800">
            Buku Besar Transaksi Keuangan
          </CardTitle>
          <CardDescription className="text-xs mt-0.5">
            Catatan audit aliran kas masuk bagi hasil pertanian dan pengeluaran modal.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/75 border-b border-slate-100">
              <TableRow>
                <TableHead className="h-10 text-slate-600 font-bold text-xs uppercase tracking-wider pl-6">
                  ID Transaksi
                </TableHead>
                <TableHead className="h-10 text-slate-600 font-bold text-xs uppercase tracking-wider">
                  Tanggal
                </TableHead>
                <TableHead className="h-10 text-slate-600 font-bold text-xs uppercase tracking-wider">
                  Tipe
                </TableHead>
                <TableHead className="h-10 text-slate-600 font-bold text-xs uppercase tracking-wider">
                  Keterangan / Deskripsi
                </TableHead>
                <TableHead className="h-10 text-slate-600 font-bold text-xs uppercase tracking-wider">
                  Nominal Transaksi
                </TableHead>
                <TableHead className="h-10 text-slate-600 font-bold text-xs uppercase tracking-wider text-right pr-6">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => {
                const isReturn = tx.type === 'return';
                const isFee = tx.type === 'fee';

                const dateFormatted = new Date(tx.date).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <TableRow
                    key={tx.id}
                    className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0"
                  >
                    <TableCell className="py-4 pl-6 font-mono text-xs font-semibold text-slate-500">
                      #{tx.id}
                    </TableCell>
                    <TableCell className="py-4 text-xs font-medium text-slate-400">
                      {dateFormatted}
                    </TableCell>
                    <TableCell className="py-4">
                      {isReturn ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                          <ArrowDownLeft className="h-3 w-3" /> Dana Masuk
                        </span>
                      ) : isFee ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                          <Wallet className="h-3 w-3" /> Potongan Fee
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-2 py-0.5">
                          <ArrowUpRight className="h-3 w-3" /> Dana Keluar
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="py-4 text-xs font-semibold text-slate-800 max-w-sm truncate">
                      {tx.proposal_title}
                    </TableCell>
                    <TableCell
                      className={`py-4 text-xs font-bold ${
                        isReturn ? 'text-green-600' : 'text-slate-800'
                      }`}
                    >
                      {isReturn ? '+' : '-'}
                      {formatCurrency(tx.amount)}
                    </TableCell>
                    <TableCell className="py-4 text-right pr-6">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700 border border-emerald-150">
                        Sukses
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
