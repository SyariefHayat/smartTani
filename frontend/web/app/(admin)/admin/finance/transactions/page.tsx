'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
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
  Wallet,
  Search,
  Eye,
  AlertTriangle,
  FileDown,
  ArrowUpDown,
  ChevronLeft,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';

interface Transaction {
  id: string;
  type: 'order' | 'investment' | 'refund' | 'payout';
  user_name: string;
  amount: number;
  fee_amount: number;
  status: 'success' | 'pending' | 'failed';
  created_at: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    type: 'order',
    user_name: 'Dewi Lestari (Buyer)',
    amount: 8500000,
    fee_amount: 425000,
    status: 'success',
    created_at: '2026-05-28T09:00:00Z',
  },
  {
    id: 'tx-2',
    type: 'investment',
    user_name: 'Heri Susanto (Investor)',
    amount: 25000000,
    fee_amount: 500000,
    status: 'success',
    created_at: '2026-05-28T10:00:00Z',
  },
  {
    id: 'tx-3',
    type: 'refund',
    user_name: 'Dian Permana (Buyer)',
    amount: 180000,
    fee_amount: 0,
    status: 'pending',
    created_at: '2026-05-27T14:30:00Z',
  },
  {
    id: 'tx-4',
    type: 'payout',
    user_name: 'Bambang Sugiharto (Petani)',
    amount: 12000000,
    fee_amount: 120000,
    status: 'success',
    created_at: '2026-05-26T11:00:00Z',
  },
];

export default function AdminFinanceTransactionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isOffline, setIsOffline] = React.useState(true);

  const type = searchParams.get('type') || 'all';

  // Initialize localStorage for transactions
  React.useEffect(() => {
    if (!localStorage.getItem('admin-transactions')) {
      localStorage.setItem('admin-transactions', JSON.stringify(MOCK_TRANSACTIONS));
    }
  }, []);

  // Fetch transactions query
  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ['admin-transactions-list', type],
    queryFn: async () => {
      const stored = JSON.parse(localStorage.getItem('admin-transactions') || '[]');
      let filtered = [...stored];
      if (type !== 'all') {
        filtered = filtered.filter((t) => t.type === type);
      }
      return filtered;
    },
  });

  const updateFilters = (newType: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newType === 'all') params.delete('type');
    else params.set('type', newType);
    router.push(`/admin/finance/transactions?${params.toString()}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Sukses</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-700 border-red-200">Gagal</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'order':
        return (
          <Badge variant="secondary" className="bg-slate-100 text-slate-700">
            Marketplace Order
          </Badge>
        );
      case 'investment':
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            Investasi
          </Badge>
        );
      case 'refund':
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-700">
            Refund
          </Badge>
        );
      case 'payout':
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
            Pencairan Dana
          </Badge>
        );
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const handleExportCSV = () => {
    const stored: Transaction[] = JSON.parse(localStorage.getItem('admin-transactions') || '[]');
    const headers = 'Transaction ID,Type,User Name,Amount,Fee,Status,Created At\n';
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      headers +
      stored
        .map(
          (t) =>
            `"${t.id}","${t.type}","${t.user_name}","${t.amount}","${t.fee_amount}","${t.status}","${t.created_at}"`
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smarttani-transactions-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Histori log transaksi keuangan berhasil diekspor!');
  };

  return (
    <div className="w-full space-y-6 text-slate-900 pb-12">
      {/* Back button */}
      <div>
        <Link
          href="/admin/finance"
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" /> Kembali ke Arus Keuangan
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-1.5 md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Log Mutasi Keuangan Platform 📝
          </h1>
          <p className="text-xs font-semibold text-slate-500">
            Daftar kronologi mutasi keuangan marketplace B2B/B2C, pencairan dana petani, and
            penyerahan komisi platform fee.
          </p>
        </div>
        <div>
          <Button
            onClick={handleExportCSV}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold gap-1.5 cursor-pointer shadow-sm"
          >
            <FileDown className="h-4 w-4" /> Ekspor Log CSV
          </Button>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3 shadow-sm">
        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-amber-800">Modus Simulasi Luring Aktif</h4>
          <p className="text-[11px] font-semibold text-amber-600 mt-0.5">
            Database log mutasi dimuat secara luring dari database lokal peramban Anda.
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 flex justify-between items-center">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
          Daftar Mutasi Kas
        </span>
        <div>
          <Select value={type} onValueChange={updateFilters}>
            <SelectTrigger className="w-[180px] bg-white border-slate-200 text-xs rounded-xl focus:ring-green-500 h-10">
              <SelectValue placeholder="Pilih Jenis" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 rounded-xl">
              <SelectItem value="all" className="text-xs cursor-pointer">
                Semua Jenis
              </SelectItem>
              <SelectItem value="order" className="text-xs cursor-pointer">
                Marketplace Order
              </SelectItem>
              <SelectItem value="investment" className="text-xs cursor-pointer">
                Investasi
              </SelectItem>
              <SelectItem value="refund" className="text-xs cursor-pointer">
                Refund
              </SelectItem>
              <SelectItem value="payout" className="text-xs cursor-pointer">
                Pencairan Dana
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mutasi Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50/70 border-b border-slate-100">
            <TableRow>
              <TableHead className="text-xs font-bold text-slate-700 p-4">ID Mutasi</TableHead>
              <TableHead className="text-xs font-bold text-slate-700">Jenis Layanan</TableHead>
              <TableHead className="text-xs font-bold text-slate-700">Anggota Pengguna</TableHead>
              <TableHead className="text-xs font-bold text-slate-700">Total Mutasi</TableHead>
              <TableHead className="text-xs font-bold text-slate-700">
                Komisi Fee Platform
              </TableHead>
              <TableHead className="text-xs font-bold text-slate-700">Status</TableHead>
              <TableHead className="text-xs font-bold text-slate-700 p-4">
                Tanggal Transaksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-xs font-semibold text-slate-700">
            {isLoading ? (
              [...Array(2)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="p-4">
                    <div className="h-4 bg-slate-100 rounded w-20 animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-slate-100 rounded w-28 animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-slate-100 rounded w-24 animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-slate-100 rounded w-16 animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-slate-100 rounded w-16 animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-slate-100 rounded w-16 animate-pulse" />
                  </TableCell>
                  <TableCell className="p-4">
                    <div className="h-4 bg-slate-100 rounded w-20 animate-pulse" />
                  </TableCell>
                </TableRow>
              ))
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-slate-400 font-semibold">
                  Tidak ada data mutasi kas terekam.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((tx) => (
                <TableRow key={tx.id} className="hover:bg-slate-50/40 border-b border-slate-100">
                  <TableCell className="p-4 font-mono text-slate-800">{tx.id}</TableCell>
                  <TableCell>{getTypeBadge(tx.type)}</TableCell>
                  <TableCell>{tx.user_name}</TableCell>
                  <TableCell
                    className={
                      tx.type === 'refund' || tx.type === 'payout'
                        ? 'text-red-600 font-bold'
                        : 'text-green-700 font-bold'
                    }
                  >
                    {tx.type === 'refund' || tx.type === 'payout' ? '-' : '+'} Rp{' '}
                    {tx.amount.toLocaleString('id-ID')}
                  </TableCell>
                  <TableCell className="text-indigo-700 font-bold">
                    {tx.fee_amount > 0 ? `Rp ${tx.fee_amount.toLocaleString('id-ID')}` : '-'}
                  </TableCell>
                  <TableCell>{getStatusBadge(tx.status)}</TableCell>
                  <TableCell className="p-4 text-slate-400">
                    {new Date(tx.created_at).toLocaleString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
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
