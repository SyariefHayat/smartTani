'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Proposal } from '@/services/investment';
import { formatCurrency } from '@/lib/utils';
import { formatDate } from 'date-fns';
import { id } from 'date-fns/locale';
import { Eye, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

interface ProposalTableProps {
  proposals: Proposal[];
  loading: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export function ProposalTable({ proposals, loading, onApprove, onReject }: ProposalTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Menunggu Review</Badge>
        );
      case 'pending':
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Draft</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Disetujui</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Ditolak</Badge>;
      case 'open_for_funding':
        return (
          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
            Pendanaan Dibuka
          </Badge>
        );
      case 'funded':
        return (
          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
            Pendanaan Terpenuhi
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Judul Proposal</TableHead>
              <TableHead>Petani</TableHead>
              <TableHead>Dana Dibutuhkan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tgl Pengajuan</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                {[...Array(6)].map((_, j) => (
                  <TableCell key={j}>
                    <div className="h-4 w-full animate-pulse bg-gray-100 rounded" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Judul Proposal</TableHead>
            <TableHead>Petani</TableHead>
            <TableHead>Dana Dibutuhkan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tgl Pengajuan</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {proposals.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Tidak ada data proposal.
              </TableCell>
            </TableRow>
          ) : (
            proposals.map((proposal) => (
              <TableRow key={proposal.id}>
                <TableCell className="font-medium max-w-[300px] truncate">
                  {proposal.title}
                </TableCell>
                <TableCell>{proposal.farmer_id}</TableCell>
                <TableCell>{formatCurrency(proposal.funding_needed)}</TableCell>
                <TableCell>{getStatusBadge(proposal.status)}</TableCell>
                <TableCell>
                  {formatDate(new Date(proposal.created_at), 'dd MMM yyyy', { locale: id })}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Link href={`/admin/proposals/${proposal.id}`} passHref legacyBehavior>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-slate-600 border-slate-200 hover:bg-slate-50 gap-1 cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" /> Detail
                    </Button>
                  </Link>

                  {['submitted', 'pending'].includes(proposal.status) && onApprove && onReject && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (
                            confirm('Setujui proposal pendanaan ini agar dapat dibuka untuk umum?')
                          ) {
                            onApprove(proposal.id);
                          }
                        }}
                        className="text-green-600 border-green-200 hover:bg-green-50 gap-1 cursor-pointer"
                      >
                        <CheckCircle className="h-3.5 w-3.5" /> Setujui
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm('Tolak pengajuan proposal pendanaan ini?')) {
                            onReject(proposal.id);
                          }
                        }}
                        className="text-red-600 border-red-200 hover:bg-red-50 gap-1 cursor-pointer"
                      >
                        <XCircle className="h-3.5 w-3.5" /> Tolak
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
