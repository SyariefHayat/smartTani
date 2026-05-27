'use client';

import { ColumnDef } from '@tanstack/react-table';
import { FarmerOrder } from './types';
import { OrderStatusBadge } from '../OrderStatusBadge';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, CheckCircle, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/order';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import * as React from 'react';

const OrderActionCell = ({ order }: { order: FarmerOrder }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const { mutate: confirmOrder, isPending } = useMutation({
    mutationFn: () => orderService.confirmOrder(order.id),
    onSuccess: () => {
      toast.success('Pesanan berhasil dikonfirmasi');
      queryClient.invalidateQueries({ queryKey: ['farmer-orders'] });
      setIsOpen(false);
    },
    onError: (error: Error) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const message = (error as any).response?.data?.message || error.message;
      toast.error('Gagal mengkonfirmasi pesanan: ' + message);
    },
  });

  return (
    <div className="flex items-center justify-end gap-1.5">
      {/* Primary Detail Action */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 cursor-pointer text-slate-500 hover:text-slate-900 font-medium text-xs"
        onClick={() => setIsDetailOpen(true)}
      >
        <Eye className="mr-1.5 h-3.5 w-3.5 shrink-0" />
        Detail
      </Button>

      {/* Action Dropdown for conditional actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 text-slate-900 bg-white">
          {order.status === 'paid' && (
            <DropdownMenuItem
              className="cursor-pointer font-semibold text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50/50"
              onClick={() => setIsOpen(true)}
            >
              <CheckCircle className="mr-2 h-4 w-4 shrink-0 text-emerald-600" />
              Konfirmasi Pesanan
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:text-destructive"
            onClick={() => {
              toast.error('Gagal membatalkan pesanan', {
                description:
                  'Pesanan yang telah dibayar atau dikonfirmasi tidak dapat dibatalkan secara manual oleh penjual demi keamanan transaksi.',
              });
            }}
          >
            Batalkan Pesanan
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Confirm Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-white text-slate-900">
          <DialogHeader>
            <DialogTitle>Konfirmasi Pesanan</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin mengkonfirmasi pesanan <strong>#{order.id}</strong>? Tindakan
              ini akan memberitahu pembeli dan melanjutkan ke proses pengemasan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
              onClick={() => confirmOrder()}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" /> : null}
              Ya, Konfirmasi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Detail Pesanan #{order.id}</DialogTitle>
            <DialogDescription>Informasi lengkap transaksi pembelian pelanggan.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 text-sm text-slate-800">
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-muted-foreground">Nama Pelanggan:</span>
              <span className="font-semibold text-slate-900">{order.customerName}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-muted-foreground">Metode Pembayaran:</span>
              <span className="text-slate-900">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-muted-foreground">Tanggal Transaksi:</span>
              <span className="text-slate-900">
                {format(new Date(order.date), 'dd MMMM yyyy HH:mm', { locale: id })}
              </span>
            </div>
            <div className="border-b pb-2 space-y-1">
              <span className="font-medium text-muted-foreground block">Daftar Item:</span>
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between pl-2">
                  <span className="text-slate-700">
                    • {item.quantity}x {item.name}
                  </span>
                  <span className="font-semibold text-slate-900 font-mono">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      maximumFractionDigits: 0,
                    }).format(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-1">
              <span className="font-bold text-slate-900">Total Pendapatan:</span>
              <span className="font-extrabold text-green-600 text-base">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  maximumFractionDigits: 0,
                }).format(order.totalAmount)}
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setIsDetailOpen(false)}
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const columns: ColumnDef<FarmerOrder>[] = [
  {
    accessorKey: 'id',
    header: 'ID Pesanan',
    cell: ({ row }) => <span className="font-mono text-xs">#{row.getValue('id')}</span>,
  },
  {
    accessorKey: 'date',
    header: 'Tanggal',
    cell: ({ row }) => {
      const date = new Date(row.getValue('date'));
      return <span className="text-sm">{format(date, 'dd MMM yyyy', { locale: id })}</span>;
    },
  },
  {
    accessorKey: 'customerName',
    header: 'Pelanggan',
    cell: ({ row }) => <span className="font-medium text-sm">{row.getValue('customerName')}</span>,
  },
  {
    accessorKey: 'totalAmount',
    header: 'Total Penghasilan',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('totalAmount'));
      const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(amount);
      return <span className="font-bold text-green-600">{formatted}</span>;
    },
  },
  {
    accessorKey: 'paymentMethod',
    header: 'Metode',
    cell: ({ row }) => <span className="text-sm">{row.getValue('paymentMethod')}</span>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <OrderStatusBadge status={row.getValue('status')} />,
  },
  {
    id: 'actions',
    cell: ({ row }) => <OrderActionCell order={row.original} />,
  },
];
