'use client';
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService, Order } from '@/services/order';
import { OrderTable } from '@/components/features/admin/orders/OrderTable';
import { OrderFilter } from '@/components/features/admin/orders/OrderFilter';
import { AdminStatsCards, AdminStatItem } from '@/components/features/admin/shared/AdminStatsCards';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  ShoppingCart,
  Clock,
  CheckCircle,
  FileDown,
  Search,
  AlertTriangle,
  ShieldAlert,
  Truck,
} from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const MOCK_ORDERS: Order[] = [
  {
    id: 'order-1',
    buyer_id: 'usr-3',
    total_amount: 8500000,
    platform_fee: 425000,
    shipping_cost: 25000,
    status: 'completed',
    shipping_address: {
      recipient_name: 'Dewi Lestari',
      phone_number: '08123456789',
      province: 'Jawa Timur',
      city: 'Lamongan',
      full_address: 'Jl. Alang-alang No. 10',
      postal_code: '62293',
    },
    created_at: '2026-05-28T09:00:00Z',
    items: [],
  },
  {
    id: 'order-2',
    buyer_id: 'usr-3',
    total_amount: 95000,
    platform_fee: 4750,
    shipping_cost: 12000,
    status: 'processing',
    shipping_address: {
      recipient_name: 'Dewi Lestari',
      phone_number: '08123456789',
      province: 'Jawa Timur',
      city: 'Lamongan',
      full_address: 'Jl. Alang-alang No. 10',
      postal_code: '62293',
    },
    created_at: '2026-05-28T10:00:00Z',
    items: [],
  },
  {
    id: 'order-3',
    buyer_id: 'usr-10',
    total_amount: 180000,
    platform_fee: 9000,
    shipping_cost: 15000,
    status: 'pending_payment',
    shipping_address: {
      recipient_name: 'Dian Permana',
      phone_number: '0876543210',
      province: 'Jawa Barat',
      city: 'Bandung',
      full_address: 'Jl. Dago No. 12',
      postal_code: '40135',
    },
    created_at: '2026-05-27T14:30:00Z',
    items: [],
  },
  {
    id: 'order-4',
    buyer_id: 'usr-10',
    total_amount: 12000000,
    platform_fee: 600000,
    shipping_cost: 150000,
    status: 'shipped',
    shipping_address: {
      recipient_name: 'Dian Permana',
      phone_number: '0876543210',
      province: 'Jawa Barat',
      city: 'Bandung',
      full_address: 'Jl. Dago No. 12',
      postal_code: '40135',
    },
    created_at: '2026-05-26T11:00:00Z',
    items: [],
  },
];

export default function AdminOrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [isOffline, setIsOffline] = React.useState(false);
  const [searchVal, setSearchVal] = React.useState(searchParams.get('search') || '');

  const status = searchParams.get('status') || 'all';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const search = searchParams.get('search') || '';

  // Initialize localStorage for orders
  React.useEffect(() => {
    if (!localStorage.getItem('admin-orders')) {
      localStorage.setItem('admin-orders', JSON.stringify(MOCK_ORDERS));
    }
  }, []);

  // Fetch Orders Query
  const { data, isLoading } = useQuery<any>({
    queryKey: ['admin-orders-list', status, page, search],
    queryFn: async () => {
      try {
        const params = {
          status: status === 'all' ? undefined : status,
          page,
          limit: 10,
        };
        const res = await orderService.getOrders(params);
        let list = res.data.orders;

        if (search) {
          list = list.filter(
            (o) =>
              o.id.toLowerCase().includes(search.toLowerCase()) ||
              o.buyer_id.toLowerCase().includes(search.toLowerCase())
          );
        }

        return {
          orders: list,
          meta: {
            page,
            limit: 10,
            total: list.length,
            totalPages: Math.ceil(list.length / 10) || 1,
          },
        };
      } catch {
        setIsOffline(true);
        const stored = JSON.parse(localStorage.getItem('admin-orders') || '[]');
        let filtered = [...stored];
        if (status !== 'all') {
          filtered = filtered.filter((o) => o.status === status);
        }
        if (search) {
          filtered = filtered.filter(
            (o) =>
              o.id.toLowerCase().includes(search.toLowerCase()) ||
              o.buyer_id.toLowerCase().includes(search.toLowerCase())
          );
        }

        return {
          orders: filtered.slice((page - 1) * 10, page * 10),
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

  // Calculate statistics from localStorage
  const stats = React.useMemo(() => {
    const stored = JSON.parse(
      (typeof window !== 'undefined' && localStorage.getItem('admin-orders')) ||
        JSON.stringify(MOCK_ORDERS)
    );
    const total = stored.length;
    const pendingPayment = stored.filter((o: any) => o.status === 'pending_payment').length;
    const inProgress = stored.filter((o: any) =>
      ['paid', 'processing', 'confirmed_seller', 'shipped'].includes(o.status)
    ).length;
    const completed = stored.filter((o: any) => o.status === 'completed').length;
    return { total, pendingPayment, inProgress, completed };
  }, [data]);

  // Debounce search input sync
  React.useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchVal) params.set('search', searchVal);
      else params.delete('search');
      params.set('page', '1');
      router.push(`/admin/orders?${params.toString()}`);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchVal, router, searchParams]);

  const updateFilters = (newStatus: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newStatus === 'all') params.delete('status');
    else params.set('status', newStatus);

    params.set('page', '1');
    router.push(`/admin/orders?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/admin/orders?${params.toString()}`);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const stored: Order[] = JSON.parse(localStorage.getItem('admin-orders') || '[]');
    const headers = 'Order ID,Buyer ID,Total Amount,Status,Created At\n';
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      headers +
      stored
        .map((o) => `"${o.id}","${o.buyer_id}","${o.total_amount}","${o.status}","${o.created_at}"`)
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smarttani-orders-report-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Data transaksi pesanan berhasil diekspor ke CSV!');
  };

  const statCards: AdminStatItem[] = [
    {
      label: 'Total Pesanan',
      value: stats.total,
      icon: ShoppingCart,
      color: 'text-slate-700',
      bgColor: 'bg-slate-100',
      description: 'Volume pesanan kumulatif',
    },
    {
      label: 'Belum Bayar',
      value: stats.pendingPayment,
      icon: Clock,
      color: 'text-amber-700',
      bgColor: 'bg-amber-100',
      description: 'Menunggu transfer pembayaran bank',
    },
    {
      label: 'Dalam Proses',
      value: stats.inProgress,
      icon: Truck,
      color: 'text-blue-700',
      bgColor: 'bg-blue-100',
      description: 'Diproses penjual atau dalam transit',
    },
    {
      label: 'Pesanan Selesai',
      value: stats.completed,
      icon: CheckCircle,
      color: 'text-green-700',
      bgColor: 'bg-green-100',
      description: 'Diterima sukses oleh pelanggan',
    },
  ];

  return (
    <div className="w-full space-y-6 text-slate-900 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-1.5 md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Kelola Transaksi Pesanan 🛒
          </h1>
          <p className="text-xs font-semibold text-slate-500">
            Pantau arus transaksi pesanan marketplace B2C dan B2B, awasi status pembayaran invoice,
            and lakukan ekspor laporan CSV keuangan.
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
              Order Service sedang tidak terhubung. Seluruh histori transaksi dimuat secara luring.
            </p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <AdminStatsCards stats={statCards} loading={isLoading} />

      {/* Search and Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Cari berdasarkan Order ID..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="bg-white border-slate-200 text-xs font-semibold focus:ring-green-500 rounded-xl pl-9.5 h-10 w-full"
            />
          </div>

          <OrderFilter status={status} onStatusChange={updateFilters} />
        </div>
      </div>

      {/* Table grid */}
      <OrderTable orders={data?.orders || []} loading={isLoading} />

      {/* Pagination */}
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
