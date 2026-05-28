'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService, GetUsersResponse, User } from '@/services/user';
import { UserTable } from '@/components/features/admin/users/UserTable';
import { UserFilter } from '@/components/features/admin/users/UserFilter';
import { AdminStatsCards, AdminStatItem } from '@/components/features/admin/shared/AdminStatsCards';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Users, ShieldCheck, UserX, Clock, Search, FileDown, AlertTriangle } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const MOCK_USERS: User[] = [
  {
    id: 'usr-1',
    email: 'petani1@smarttani.com',
    role: 'petani',
    full_name: 'Bambang Sugiharto',
    status: 'active',
    created_at: '2026-01-10T08:00:00Z',
    updated_at: '2026-01-10T08:00:00Z',
  },
  {
    id: 'usr-2',
    email: 'petani2@smarttani.com',
    role: 'petani',
    full_name: 'Siti Aminah',
    status: 'pending_verification',
    created_at: '2026-05-27T09:30:00Z',
    updated_at: '2026-05-27T09:30:00Z',
  },
  {
    id: 'usr-3',
    email: 'buyer1@gmail.com',
    role: 'buyer',
    full_name: 'Dewi Lestari',
    status: 'active',
    created_at: '2026-02-15T10:00:00Z',
    updated_at: '2026-02-15T10:00:00Z',
  },
  {
    id: 'usr-4',
    email: 'investor1@smarttani.com',
    role: 'investor',
    full_name: 'Heri Susanto',
    status: 'active',
    created_at: '2026-03-01T11:00:00Z',
    updated_at: '2026-03-01T11:00:00Z',
  },
  {
    id: 'usr-5',
    email: 'distributor1@tani.com',
    role: 'distributor',
    full_name: 'CV Tani Jaya',
    status: 'active',
    created_at: '2026-04-12T14:00:00Z',
    updated_at: '2026-04-12T14:00:00Z',
  },
  {
    id: 'usr-6',
    email: 'logistik1@smarttani.com',
    role: 'logistik',
    full_name: 'Kurir Kilat Lamongan',
    status: 'active',
    created_at: '2026-05-01T09:00:00Z',
    updated_at: '2026-05-01T09:00:00Z',
  },
  {
    id: 'usr-7',
    email: 'siswa1@academy.com',
    role: 'siswa',
    full_name: 'Ahmad Ghozali',
    status: 'active',
    created_at: '2026-05-20T10:00:00Z',
    updated_at: '2026-05-20T10:00:00Z',
  },
  {
    id: 'usr-8',
    email: 'instruktur1@academy.com',
    role: 'instruktur',
    full_name: 'Dr. Ir. Heri Susanto',
    status: 'active',
    created_at: '2026-05-18T08:00:00Z',
    updated_at: '2026-05-18T08:00:00Z',
  },
  {
    id: 'usr-9',
    email: 'petani3@smarttani.com',
    role: 'petani',
    full_name: 'Karno Saputro',
    status: 'suspended',
    created_at: '2026-01-20T08:00:00Z',
    updated_at: '2026-01-20T08:00:00Z',
  },
  {
    id: 'usr-10',
    email: 'buyer2@gmail.com',
    role: 'buyer',
    full_name: 'Dian Permana',
    status: 'active',
    created_at: '2026-05-25T11:00:00Z',
    updated_at: '2026-05-25T11:00:00Z',
  },
];

export default function AdminUsersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [isOffline, setIsOffline] = React.useState(false);
  const [searchVal, setSearchVal] = React.useState(searchParams.get('search') || '');

  const role = searchParams.get('role') || 'all';
  const status = searchParams.get('status') || 'all';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const search = searchParams.get('search') || '';

  // Initialize localStorage once if not exists
  React.useEffect(() => {
    if (!localStorage.getItem('admin-users')) {
      localStorage.setItem('admin-users', JSON.stringify(MOCK_USERS));
    }
  }, []);

  // Fetch Users Query
  const { data, isLoading } = useQuery<GetUsersResponse>({
    queryKey: ['admin-users-list', role, status, page, search],
    queryFn: async () => {
      try {
        const params = {
          role: role === 'all' ? undefined : role,
          status: status === 'all' ? undefined : status,
          page,
          limit: 10,
        };
        const res = await userService.getUsers(params);

        // Handle client search manually since backend might not support it
        if (search) {
          res.users = res.users.filter(
            (u) =>
              u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
              u.email.toLowerCase().includes(search.toLowerCase())
          );
        }
        return res;
      } catch {
        setIsOffline(true);
        // Load from local storage fallback
        const stored = JSON.parse(localStorage.getItem('admin-users') || '[]');
        let filtered = [...stored];
        if (role !== 'all') {
          filtered = filtered.filter((u) => u.role === role);
        }
        if (status !== 'all') {
          filtered = filtered.filter((u) => u.status === status);
        }
        if (search) {
          filtered = filtered.filter(
            (u) =>
              u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
              u.email.toLowerCase().includes(search.toLowerCase())
          );
        }

        return {
          users: filtered.slice((page - 1) * 10, page * 10),
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

  // Calculate statistics from localStorage stored users
  const stats = React.useMemo(() => {
    const stored = JSON.parse(
      (typeof window !== 'undefined' && localStorage.getItem('admin-users')) ||
        JSON.stringify(MOCK_USERS)
    );
    const total = stored.length;
    const pending = stored.filter((u: any) => u.status === 'pending_verification').length;
    const active = stored.filter((u: any) => u.status === 'active').length;
    const suspended = stored.filter((u: any) => u.status === 'suspended').length;
    return { total, pending, active, suspended };
  }, [data]);

  // Debounced search sync to URL
  React.useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchVal) params.set('search', searchVal);
      else params.delete('search');
      params.set('page', '1');
      router.push(`/admin/users?${params.toString()}`);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchVal, router, searchParams]);

  const updateFilters = (newRole: string, newStatus: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newRole === 'all') params.delete('role');
    else params.set('role', newRole);

    if (newStatus === 'all') params.delete('status');
    else params.set('status', newStatus);

    params.set('page', '1');
    router.push(`/admin/users?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/admin/users?${params.toString()}`);
  };

  // Verify User mutation
  const verifyMutation = useMutation({
    mutationFn: async (userId: string) => {
      try {
        await userService.verifyUser(userId);
      } catch {
        // Offline persistent update
        const stored: User[] = JSON.parse(localStorage.getItem('admin-users') || '[]');
        const updated = stored.map((u) => (u.id === userId ? { ...u, status: 'active' } : u));
        localStorage.setItem('admin-users', JSON.stringify(updated));
      }
    },
    onSuccess: () => {
      toast.success('Pengguna berhasil diverifikasi!');
      queryClient.invalidateQueries({ queryKey: ['admin-users-list'] });
    },
  });

  // Suspend/Activate User status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({
      userId,
      newStatus,
    }: {
      userId: string;
      newStatus: 'active' | 'suspended';
    }) => {
      try {
        await userService.updateStatus(userId, newStatus);
      } catch {
        // Offline persistent update
        const stored: User[] = JSON.parse(localStorage.getItem('admin-users') || '[]');
        const updated = stored.map((u) => (u.id === userId ? { ...u, status: newStatus } : u));
        localStorage.setItem('admin-users', JSON.stringify(updated));
      }
    },
    onSuccess: (_, variables) => {
      toast.success(
        `Pengguna berhasil di-${variables.newStatus === 'active' ? 'aktifkan' : 'suspend'}!`
      );
      queryClient.invalidateQueries({ queryKey: ['admin-users-list'] });
    },
  });

  // Export CSV
  const handleExportCSV = () => {
    const stored: User[] = JSON.parse(localStorage.getItem('admin-users') || '[]');
    const headers = 'ID,Full Name,Email,Role,Status,Created At\n';
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      headers +
      stored
        .map(
          (u) =>
            `"${u.id}","${u.full_name || '-'}","${u.email}","${u.role}","${u.status}","${u.created_at}"`
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smarttani-users-report-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Data pengguna berhasil diekspor ke CSV!');
  };

  const statCards: AdminStatItem[] = [
    {
      label: 'Total Pengguna',
      value: stats.total,
      icon: Users,
      color: 'text-slate-700',
      bgColor: 'bg-slate-100',
      description: 'Jumlah seluruh anggota terdaftar',
    },
    {
      label: 'Verifikasi Pending',
      value: stats.pending,
      icon: Clock,
      color: 'text-amber-700',
      bgColor: 'bg-amber-100',
      description: 'Menunggu peninjauan berkas KTP',
    },
    {
      label: 'Akun Aktif',
      value: stats.active,
      icon: ShieldCheck,
      color: 'text-green-700',
      bgColor: 'bg-green-100',
      description: 'Pengguna beroperasi penuh',
    },
    {
      label: 'Ditangguhkan',
      value: stats.suspended,
      icon: UserX,
      color: 'text-red-700',
      bgColor: 'bg-red-100',
      description: 'Akun di-suspend sementara',
    },
  ];

  return (
    <div className="w-full space-y-6 text-slate-900 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-1.5 md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Kelola Pengguna 👥</h1>
          <p className="text-xs font-semibold text-slate-500">
            Verifikasi identitas petani, ubah status keanggotaan, cari data, dan lakukan ekspor
            laporan CSV secara nasional.
          </p>
        </div>
        <div>
          <Button
            onClick={handleExportCSV}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold gap-1.5 cursor-pointer shadow-sm"
          >
            <FileDown className="h-4 w-4" /> Ekspor Laporan CSV
          </Button>
        </div>
      </div>

      {isOffline && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-800">Modus Simulasi Luring Aktif</h4>
            <p className="text-[11px] font-semibold text-amber-600 mt-0.5">
              Auth Service sedang tidak terhubung. Seluruh perubahan verifikasi and suspend disimpan
              di database peramban Anda.
            </p>
          </div>
        </div>
      )}

      {/* Stats Cards Row */}
      <AdminStatsCards stats={statCards} loading={isLoading} />

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Cari nama atau email..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="bg-white border-slate-200 text-xs font-semibold focus:ring-green-500 rounded-xl pl-9.5 h-10 w-full"
            />
          </div>
          <UserFilter
            role={role}
            status={status}
            onRoleChange={(val) => updateFilters(val, status)}
            onStatusChange={(val) => updateFilters(role, val)}
          />
        </div>
      </div>

      {/* User Table Grid */}
      <UserTable
        users={data?.users || []}
        loading={isLoading}
        onVerify={(id) => verifyMutation.mutate(id)}
        onSuspend={(id) => updateStatusMutation.mutate({ userId: id, newStatus: 'suspended' })}
        onActivate={(id) => updateStatusMutation.mutate({ userId: id, newStatus: 'active' })}
      />

      {/* Pagination component */}
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
