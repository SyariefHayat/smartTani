'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { userService, GetUsersResponse } from '@/services/user';
import { UserTable } from '@/components/features/admin/users/UserTable';
import { UserFilter } from '@/components/features/admin/users/UserFilter';
import { toast } from 'sonner';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export default function AdminUsersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [data, setData] = useState<GetUsersResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const role = searchParams.get('role') || 'all';
  const status = searchParams.get('status') || 'all';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        role: role === 'all' ? undefined : role,
        status: status === 'all' ? undefined : status,
        page,
        limit: 10,
      };
      const response = await userService.getUsers(params);
      setData(response);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Gagal memuat data pengguna');
    } finally {
      setLoading(false);
    }
  }, [role, status, page]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, [fetchUsers]);

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

  const handleVerify = async (id: string) => {
    try {
      await userService.verifyUser(id);
      toast.success('Pengguna berhasil diverifikasi');

      fetchUsers();
    } catch {
      toast.error('Gagal memverifikasi pengguna');
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: 'active' | 'suspended') => {
    try {
      await userService.updateStatus(id, newStatus);
      toast.success(`Status pengguna diperbarui menjadi ${newStatus}`);

      fetchUsers();
    } catch {
      toast.error('Gagal memperbarui status pengguna');
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Kelola Pengguna</h2>
      </div>

      <UserFilter
        role={role}
        status={status}
        onRoleChange={(val) => updateFilters(val, status)}
        onStatusChange={(val) => updateFilters(role, val)}
      />

      <UserTable
        users={data?.users || []}
        loading={loading}
        onVerify={handleVerify}
        onSuspend={(id) => handleUpdateStatus(id, 'suspended')}
        onActivate={(id) => handleUpdateStatus(id, 'active')}
      />

      {data && data.meta.totalPages > 1 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                    if (page > 1) handlePageChange(page - 1);
                  }}
                  className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
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
                  className={page >= data.meta.totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
