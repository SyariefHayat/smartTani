'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminService, AuditLogItem, GetAuditLogResponse } from '@/services/admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  FileText,
  Search,
  Download,
  AlertTriangle,
  History,
  User,
  ShieldAlert,
  Clock,
  Filter,
} from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const MOCK_AUDIT_LOGS = [
  {
    id: 'log-1',
    admin_id: 'admin-1',
    admin_name: 'Super Admin',
    action: 'VERIFY_USER',
    target_type: 'user',
    target_id: 'usr-2',
    details: 'Melakukan verifikasi berkas KTP dan mengaktifkan akun petani "Siti Aminah".',
    created_at: '2026-05-28T18:15:00Z',
  },
  {
    id: 'log-2',
    admin_id: 'admin-1',
    admin_name: 'Super Admin',
    action: 'SUSPEND_USER',
    target_type: 'user',
    target_id: 'usr-9',
    details:
      'Menangguhkan akses akun petani "Karno Saputro" karena laporan indikasi penipuan timbangan.',
    created_at: '2026-05-28T14:20:00Z',
  },
  {
    id: 'log-3',
    admin_id: 'admin-1',
    admin_name: 'Super Admin',
    action: 'DELETE_REVIEW',
    target_type: 'review',
    target_id: 'rev-1',
    details:
      'Menghapus ulasan terlaporkan produk "Pupuk Organik Super Humus 5kg" karena mengandung kata kasar.',
    created_at: '2026-05-27T11:05:00Z',
  },
  {
    id: 'log-4',
    admin_id: 'admin-1',
    admin_name: 'Super Admin',
    action: 'ASSIGN_COURIER',
    target_type: 'shipment',
    target_id: 'ship-102',
    details:
      'Menetapkan kurir "Kurir Kilat Lamongan" untuk melakukan penjemputan kiriman pesanan B2B.',
    created_at: '2026-05-26T09:30:00Z',
  },
];

export default function AdminAuditLogPage() {
  const [isOffline, setIsOffline] = React.useState(false);
  const [searchVal, setSearchVal] = React.useState('');
  const [actionFilter, setActionFilter] = React.useState('all');
  const [page, setPage] = React.useState(1);

  // Initialize localStorage if empty
  React.useEffect(() => {
    if (!localStorage.getItem('admin-audit-logs')) {
      localStorage.setItem('admin-audit-logs', JSON.stringify(MOCK_AUDIT_LOGS));
    }
  }, []);

  // Fetch Audit Log Query
  const { data, isLoading } = useQuery<GetAuditLogResponse>({
    queryKey: ['admin-audit-logs-list', actionFilter, page, searchVal],
    queryFn: async () => {
      try {
        const res = await adminService.getAuditLog({
          page,
          limit: 10,
          action: actionFilter === 'all' ? undefined : actionFilter,
        });

        // Search filtering logic
        if (searchVal && res.logs) {
          const query = searchVal.toLowerCase();
          res.logs = res.logs.filter(
            (log) =>
              log.details.toLowerCase().includes(query) ||
              log.admin_name.toLowerCase().includes(query) ||
              log.action.toLowerCase().includes(query)
          );
        }
        return res;
      } catch {
        setIsOffline(true);
        // Fallback to local storage
        const stored: AuditLogItem[] = JSON.parse(localStorage.getItem('admin-audit-logs') || '[]');
        let filtered = [...stored];

        if (actionFilter !== 'all') {
          filtered = filtered.filter((log) => log.action === actionFilter);
        }

        if (searchVal) {
          const query = searchVal.toLowerCase();
          filtered = filtered.filter(
            (log) =>
              log.details.toLowerCase().includes(query) ||
              log.admin_name.toLowerCase().includes(query) ||
              log.action.toLowerCase().includes(query) ||
              log.target_id.toLowerCase().includes(query)
          );
        }

        return {
          logs: filtered.slice((page - 1) * 10, page * 10),
          meta: {
            page,
            limit: 10,
            total: filtered.length,
          },
        };
      }
    },
  });

  const handleExportCSV = () => {
    const stored: AuditLogItem[] = JSON.parse(localStorage.getItem('admin-audit-logs') || '[]');
    const headers = 'Timestamp,Admin Name,Action,Target Type,Target ID,Details\n';
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      headers +
      stored
        .map(
          (l) =>
            `"${l.created_at}","${l.admin_name}","${l.action}","${l.target_type}","${l.target_id}","${l.details}"`
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smarttani-audit-log-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Log aktivitas admin berhasil diekspor ke CSV!');
  };

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'VERIFY_USER':
      case 'ACTIVATE_USER':
      case 'APPROVE_PROPOSAL':
        return 'bg-green-50 text-green-700 border-green-200/80';
      case 'SUSPEND_USER':
      case 'REJECT_PROPOSAL':
        return 'bg-red-50 text-red-700 border-red-200/80';
      case 'DELETE_REVIEW':
        return 'bg-purple-50 text-purple-700 border-purple-200/80';
      case 'ASSIGN_COURIER':
        return 'bg-blue-50 text-blue-700 border-blue-200/80';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200/80';
    }
  };

  const totalLogs = data?.meta?.total || 0;

  return (
    <div className="w-full space-y-6 text-slate-900 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-1.5 md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
            Audit Log Aktivitas <History className="h-6 w-6 text-slate-700" />
          </h1>
          <p className="text-xs font-semibold text-slate-500">
            Ledger digital kronologis mencatat semua aksi moderasi administrator SmartTani secara
            persisten demi keamanan sistem.
          </p>
        </div>
        <div>
          <Button
            onClick={handleExportCSV}
            size="sm"
            className="bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold gap-1.5 cursor-pointer shadow-sm"
          >
            <Download className="h-4 w-4" /> Unduh Ledger Audit
          </Button>
        </div>
      </div>

      {isOffline && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-800">Modus Simulasi Luring Aktif</h4>
            <p className="text-[11px] font-semibold text-amber-600 mt-0.5">
              Audit Service sedang luring. Ledger log aktivitas administrator dimuat and disimpan
              dari basis data peramban Anda.
            </p>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Cari rincian aksi atau nama admin..."
              value={searchVal}
              onChange={(e) => {
                setSearchVal(e.target.value);
                setPage(1);
              }}
              className="bg-white border-slate-200 text-xs font-semibold focus:ring-green-500 rounded-xl pl-9.5 h-10 w-full"
            />
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <span>Operasi:</span>
            <select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                setPage(1);
              }}
              className="bg-transparent border-none text-slate-700 font-bold focus:outline-none cursor-pointer"
            >
              <option value="all">Semua Operasi</option>
              <option value="VERIFY_USER">VERIFY_USER</option>
              <option value="SUSPEND_USER">SUSPEND_USER</option>
              <option value="ACTIVATE_USER">ACTIVATE_USER</option>
              <option value="DELETE_REVIEW">DELETE_REVIEW</option>
              <option value="ASSIGN_COURIER">ASSIGN_COURIER</option>
              <option value="DISMISS_REVIEW_REPORT">DISMISS_REVIEW_REPORT</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Tabular Card */}
      <Card className="border-slate-200 bg-white rounded-2xl shadow-xs overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-4 p-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-14 bg-slate-50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : !data || data.logs.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="h-10 w-10 text-slate-300 mx-auto" />
              <h4 className="text-slate-800 text-xs font-bold mt-3">Log aktivitas bersih</h4>
              <p className="text-slate-400 text-[10px] mt-1">
                Belum ada rekaman log operasi admin yang tersimpan di sistem.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-bold">
                    <th className="p-4">Waktu</th>
                    <th className="p-4">Administrator</th>
                    <th className="p-4">Kode Aksi</th>
                    <th className="p-4">Target ID</th>
                    <th className="p-4 max-w-[360px]">Rincian Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {data.logs.map((log: AuditLogItem) => (
                    <tr key={log.id} className="hover:bg-slate-50/30 transition-all">
                      <td className="p-4 text-slate-400 text-[10px] shrink-0">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 shrink-0" />
                          {new Date(log.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="flex items-center gap-1.5 font-bold text-slate-800">
                          <User className="h-3.5 w-3.5 text-slate-400" />
                          {log.admin_name}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-block px-2 py-1 text-[9px] font-extrabold rounded-lg border ${getActionBadgeColor(log.action)}`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500 text-[11px] font-mono">
                        {log.target_type}:{log.target_id}
                      </td>
                      <td className="p-4 text-slate-600 leading-relaxed font-semibold max-w-[360px]">
                        {log.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination components */}
      {data && totalLogs > 10 && (
        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                    if (page > 1) setPage(page - 1);
                  }}
                  className={page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              {[...Array(Math.ceil(totalLogs / 10))].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.preventDefault();
                      setPage(i + 1);
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
                    if (page < Math.ceil(totalLogs / 10)) setPage(page + 1);
                  }}
                  className={
                    page >= Math.ceil(totalLogs / 10)
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
