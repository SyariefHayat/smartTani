'use client';

import { ColumnDef } from '@tanstack/react-table';
import { FarmerOrder } from '../farmer-orders/types';
import { OrderStatusBadge } from '../OrderStatusBadge';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Eye, FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import * as React from 'react';
import { toast } from 'sonner';
import { printInvoice } from '@/lib/print-invoice';

const SalesHistoryActionCell = ({ order }: { order: FarmerOrder }) => {
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const shortId = order.id.slice(-6).toUpperCase();

  const handleInvoiceClick = () => {
    toast.success(`Membuka print preview invoice #${shortId}`, {
      description: 'Silakan cetak atau simpan sebagai PDF dari dialog browser.',
    });
    printInvoice(order);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="h-8 border-slate-200 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
        onClick={() => setIsDetailOpen(true)}
      >
        <Eye className="mr-1 h-3.5 w-3.5" />
        Detail
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50 cursor-pointer"
        onClick={handleInvoiceClick}
      >
        <FileText className="mr-1 h-3.5 w-3.5" />
        Invoice
      </Button>

      {/* Details Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-md bg-white text-slate-900">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Detail Riwayat Pesanan #{shortId}</DialogTitle>
            <DialogDescription>
              Informasi lengkap transaksi riwayat penjualan yang telah selesai atau dibatalkan.
            </DialogDescription>
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
              className="w-full sm:w-auto cursor-pointer"
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
    cell: ({ row }) => (
      <span className="font-mono text-xs font-bold text-slate-700">
        #{(row.getValue('id') as string).slice(-6).toUpperCase()}
      </span>
    ),
  },
  {
    accessorKey: 'date',
    header: 'Tanggal',
    cell: ({ row }) => {
      const date = new Date(row.getValue('date'));
      return (
        <span className="text-sm text-slate-600">
          {format(date, 'dd MMM yyyy', { locale: id })}
        </span>
      );
    },
  },
  {
    accessorKey: 'customerName',
    header: 'Pelanggan',
    cell: ({ row }) => (
      <span className="font-medium text-sm text-slate-800">{row.getValue('customerName')}</span>
    ),
  },
  {
    accessorKey: 'totalAmount',
    header: 'Total Penjualan',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('totalAmount'));
      const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }).format(amount);
      return <span className="font-bold text-green-600">{formatted}</span>;
    },
  },
  {
    accessorKey: 'paymentMethod',
    header: 'Metode',
    cell: ({ row }) => (
      <span className="text-sm text-slate-600">{row.getValue('paymentMethod')}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <OrderStatusBadge status={row.getValue('status')} />,
  },
  {
    id: 'actions',
    header: 'Aksi',
    cell: ({ row }) => <SalesHistoryActionCell order={row.original} />,
  },
];
