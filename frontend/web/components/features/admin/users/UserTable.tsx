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
import { User } from '@/services/user';
import { formatDate } from 'date-fns';
import { id } from 'date-fns/locale';
import { CheckCircle, ShieldAlert } from 'lucide-react';

interface UserTableProps {
  users: User[];
  loading: boolean;
  onVerify: (id: string) => void;
  onSuspend: (id: string) => void;
  onActivate: (id: string) => void;
}

export function UserTable({ users, loading, onVerify, onSuspend, onActivate }: UserTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Aktif</Badge>;
      case 'pending_verification':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            Menunggu Verifikasi
          </Badge>
        );
      case 'suspended':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Ditangguhkan</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleLabel = (role: string) => {
    const roles: Record<string, string> = {
      petani: 'Petani',
      buyer: 'Buyer',
      investor: 'Investor',
      distributor: 'Distributor',
      logistik: 'Logistik',
      admin: 'Admin',
    };
    return roles[role] || role;
  };

  if (loading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tgl Daftar</TableHead>
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
            <TableHead>Nama</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tgl Daftar</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Tidak ada data pengguna.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.full_name || '-'}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{getRoleLabel(user.role)}</TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell>
                  {formatDate(new Date(user.created_at), 'dd MMM yyyy', { locale: id })}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {user.status === 'pending_verification' && user.role === 'petani' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600 border-green-200 hover:bg-green-50"
                      onClick={() => onVerify(user.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" /> Verifikasi
                    </Button>
                  )}
                  {user.status === 'active' && user.role !== 'admin' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => onSuspend(user.id)}
                    >
                      <ShieldAlert className="h-4 w-4 mr-1" /> Suspend
                    </Button>
                  )}
                  {user.status === 'suspended' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      onClick={() => onActivate(user.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" /> Aktifkan
                    </Button>
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
