'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { investmentService } from '@/services/investment';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowUpRight, ArrowDownLeft, Wallet, TrendingUp } from 'lucide-react';

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

  const summaryMetrics = React.useMemo(() => {
    const totalOutflow = transactions
      .filter((tx) => tx.type === 'investment')
      .reduce((sum, tx) => sum + tx.amount, 0);
    const totalInflow = transactions
      .filter((tx) => tx.type === 'return')
      .reduce((sum, tx) => sum + tx.amount, 0);
    const totalFee = transactions
      .filter((tx) => tx.type === 'fee')
      .reduce((sum, tx) => sum + tx.amount, 0);

    return {
      totalOutflow,
      totalInflow,
      totalFee,
    };
  }, [transactions]);

  if (isLoading && !isQueryError) {
    return (
      <div className="w-full space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl text-slate-900">
          Riwayat Transaksi
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Audit seluruh mutasi debet/kredit dompet dan pendanaan modal Anda secara realtime.
        </p>
      </div>

      {/* Grid Statistik (Sesuai Gaya Farmer SectionCard & Overview) */}
      {isQueryError ? (
        <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
          Gagal memuat data statistik / Koneksi ke server terputus
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {[
            {
              title: 'Kas Keluar (Investasi)',
              value: formatCurrency(summaryMetrics.totalOutflow),
              footer: 'Total dana ditanam terlaporkan',
              icon: ArrowUpRight,
              iconColorClass: 'text-red-500',
            },
            {
              title: 'Kas Masuk (Bagi Hasil)',
              value: formatCurrency(summaryMetrics.totalInflow),
              footer: 'Total imbal hasil panen cair',
              icon: ArrowDownLeft,
              iconColorClass: 'text-emerald-500',
            },
            {
              title: 'Potongan Platform Fee',
              value: formatCurrency(summaryMetrics.totalFee),
              footer: 'Total platform fee terpotong',
              icon: Wallet,
              iconColorClass: 'text-amber-500',
            },
            {
              title: 'Total Transaksi',
              value: `${transactions.length} Mutasi`,
              footer: 'Jumlah mutasi tercatat',
              icon: TrendingUp,
              iconColorClass: 'text-blue-500',
            },
          ].map((card, index) => {
            const Icon = card.icon;
            return (
              <Card key={index} className="min-w-0">
                <CardHeader className="gap-1">
                  <CardDescription className="truncate text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {card.title}
                  </CardDescription>
                  <CardTitle
                    className="truncate text-xl font-semibold tabular-nums lg:text-2xl text-slate-800"
                    title={card.value}
                  >
                    {card.value}
                  </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                  <div className="flex w-full min-w-0 items-center gap-1 font-medium text-slate-500">
                    <Icon className={`size-4 shrink-0 ${card.iconColorClass}`} />
                    <span className="truncate">{card.footer}</span>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Ledger Card Container */}
      <Card className="w-full overflow-hidden border border-slate-200 shadow-sm bg-white">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div>
            <CardTitle className="text-sm font-bold text-slate-800">
              Buku Besar Transaksi Keuangan
            </CardTitle>
            <CardDescription className="text-xs mt-0.5 text-slate-500">
              Catatan audit aliran kas masuk bagi hasil pertanian dan pengeluaran modal.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isQueryError ? (
            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm m-6">
              Gagal memuat daftar riwayat transaksi / Koneksi ke server terputus
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-100">
                    <TableHead className="py-3.5 pl-6 text-slate-600 font-bold text-xs uppercase tracking-wider">
                      ID Transaksi
                    </TableHead>
                    <TableHead className="py-3.5 text-slate-600 font-bold text-xs uppercase tracking-wider">
                      Tanggal
                    </TableHead>
                    <TableHead className="py-3.5 text-slate-600 font-bold text-xs uppercase tracking-wider">
                      Tipe
                    </TableHead>
                    <TableHead className="py-3.5 text-slate-600 font-bold text-xs uppercase tracking-wider">
                      Keterangan / Deskripsi
                    </TableHead>
                    <TableHead className="py-3.5 text-slate-600 font-bold text-xs uppercase tracking-wider">
                      Nominal Transaksi
                    </TableHead>
                    <TableHead className="py-3.5 text-slate-600 font-bold text-xs uppercase tracking-wider text-right pr-6">
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
                        className="hover:bg-slate-50/30 transition-colors border-b border-slate-100/80 last:border-0"
                      >
                        <TableCell className="py-4 pl-6 font-mono text-xs font-bold text-slate-500">
                          #{tx.id}
                        </TableCell>
                        <TableCell className="py-4 whitespace-nowrap">
                          <span className="text-xs text-slate-600 font-medium">
                            {dateFormatted}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 whitespace-nowrap">
                          {isReturn ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              Kas Masuk
                            </span>
                          ) : isFee ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                              Platform Fee
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold text-blue-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                              Investasi
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex flex-col min-w-[200px]">
                            <span className="font-semibold text-slate-900 text-sm line-clamp-1">
                              {tx.proposal_title || 'Mutasi Keuangan'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 whitespace-nowrap">
                          {isReturn ? (
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50/80 border border-emerald-200/50 px-2.5 py-1 rounded">
                              +{formatCurrency(tx.amount)}
                            </span>
                          ) : isFee ? (
                            <span className="text-xs font-bold text-amber-700 bg-amber-50/80 border border-amber-200/50 px-2.5 py-1 rounded">
                              -{formatCurrency(tx.amount)}
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-blue-600 bg-blue-50/80 border border-blue-200/50 px-2.5 py-1 rounded">
                              -{formatCurrency(tx.amount)}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="py-4 text-right pr-6 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Sukses
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
