'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/services/order';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FileText, Download, Printer, AlertTriangle, ChevronLeft } from 'lucide-react';

const MOCK_INVOICES = [
  {
    invoice_no: 'INV/20260527/ORD98822',
    order_id: 'ORD-98822',
    total_amount: 14500000,
    created_at: '2026-05-27T08:00:00Z',
    items_summary: 'Beras Pandan Wangi (500kg), Tomat Segar (300kg), Cabai Rawit (40kg)',
    seller_name: 'Budi Santoso',
    items: [
      { title: 'Beras Pandan Wangi Organik', price: 18000, quantity: 500, unit: 'kg' },
      { title: 'Tomat Merah Segar', price: 12000, quantity: 300, unit: 'kg' },
      { title: 'Cabai Rawit Merah Super', price: 45000, quantity: 40, unit: 'kg' },
    ],
  },
  {
    invoice_no: 'INV/20260520/ORD98790',
    order_id: 'ORD-98790',
    total_amount: 11200000,
    created_at: '2026-05-20T10:00:00Z',
    items_summary: 'Beras Pandan Wangi (300kg), Wortel Segar (150kg)',
    seller_name: 'Agus Salim',
    items: [
      { title: 'Beras Pandan Wangi Organik', price: 18000, quantity: 300, unit: 'kg' },
      { title: 'Wortel Brastagi Segar', price: 8000, quantity: 150, unit: 'kg' },
    ],
  },
  {
    invoice_no: 'INV/20260518/ORD98755',
    order_id: 'ORD-98755',
    total_amount: 6000000,
    created_at: '2026-05-18T16:00:00Z',
    items_summary: 'Susu Sapi Murni Segar (600L)',
    seller_name: 'Budi Santoso',
    items: [{ title: 'Susu Sapi Segar Murni', price: 10000, quantity: 600, unit: 'liter' }],
  },
];

export default function DistributorInvoicesPage() {
  const [isOffline, setIsOffline] = React.useState(false);

  // Fetch completed orders to generate invoices
  const { data: invoices, isLoading } = useQuery({
    queryKey: ['distributor-invoices'],
    queryFn: async () => {
      try {
        const res = await orderService.getOrders();
        const completedRes = (
          (res.data?.orders || []) as unknown as Record<string, unknown>[]
        ).filter((o: Record<string, unknown>) => o.status === 'completed');
        const mapped = completedRes.map((o: Record<string, unknown>) => ({
          invoice_no: `INV/${new Date((o.created_at || o.createdAt) as string).toISOString().slice(0, 10).replace(/-/g, '')}/${(o.id as string).replace(/-/g, '')}`,
          order_id: o.id as string,
          total_amount: o.total_amount as number,
          created_at: (o.created_at || o.createdAt) as string,
          items_summary:
            (o.items as Record<string, unknown>[] | undefined)
              ?.map((item) => `${item.title} (${item.quantity}${item.unit})`)
              .join(', ') || 'Pengadaan Komoditas Tani',
          seller_name:
            ((o.seller as Record<string, unknown> | undefined)?.full_name as string) ||
            'Petani Mandiri',
          items: ((o.items as Record<string, unknown>[] | undefined) || []).map((item) => ({
            title: item.title as string,
            price: item.price as number,
            quantity: item.quantity as number,
            unit: item.unit as string,
          })),
        }));
        if (!mapped || mapped.length === 0) throw new Error('Empty');
        return mapped;
      } catch {
        setIsOffline(true);
        return MOCK_INVOICES;
      }
    },
  });

  const activeInvoices = (invoices || MOCK_INVOICES) as unknown as typeof MOCK_INVOICES;

  const handleDownloadInvoice = (inv: (typeof MOCK_INVOICES)[number]) => {
    toast.loading('Menyiapkan dokumen cetak invoice...', { id: 'print-inv' });

    // Open print preview in a clean HTML layout
    setTimeout(() => {
      toast.dismiss('print-inv');
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast.error('Gagal membuka preview', { description: 'Mohon izinkan pop-up browser Anda.' });
        return;
      }

      const subtotal = inv.items.reduce(
        (sum: number, item: (typeof MOCK_INVOICES)[number]['items'][number]) =>
          sum + item.price * item.quantity,
        0
      );
      const platformFee = 10000;
      const shippingCost = 170000;
      const grandTotal = subtotal + platformFee + shippingCost;

      const itemsRowsHtml = inv.items
        .map(
          (item: (typeof MOCK_INVOICES)[number]['items'][number]) => `
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 12px 0; font-size: 11px; font-weight: bold; color: #1e293b;">${item.title}</td>
          <td style="padding: 12px 0; font-size: 11px; color: #475569; text-align: right;">Rp ${item.price.toLocaleString('id-ID')}</td>
          <td style="padding: 12px 0; font-size: 11px; color: #475569; text-align: center;">${item.quantity} ${item.unit}</td>
          <td style="padding: 12px 0; font-size: 11px; font-weight: bold; color: #1e293b; text-align: right;">Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</td>
        </tr>
      `
        )
        .join('');

      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice - ${inv.invoice_no}</title>
            <style>
              body { font-family: 'Inter', system-ui, sans-serif; padding: 40px; color: #1e293b; }
              .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
              .logo { font-size: 20px; font-weight: 800; color: #16a34a; }
              .invoice-title { font-size: 18px; font-weight: 800; color: #0f172a; text-transform: uppercase; text-align: right; }
              .details { display: flex; justify-content: space-between; margin-top: 30px; font-size: 11px; line-height: 1.6; }
              .bill-to { font-weight: bold; font-size: 12px; margin-bottom: 8px; color: #0f172a; }
              table { width: 100%; border-collapse: collapse; margin-top: 40px; }
              th { border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; text-align: left; }
              .summary { margin-top: 30px; font-size: 11px; line-height: 2; width: 300px; margin-left: auto; text-align: right; }
              .summary div { display: flex; justify-content: space-between; }
              .grand-total { border-top: 1px solid #cbd5e1; padding-top: 8px; font-size: 13px; font-weight: bold; color: #16a34a; }
              .footer { margin-top: 60px; border-top: 1px solid #f1f5f9; padding-top: 20px; text-align: center; font-size: 10px; color: #94a3b8; font-weight: 500; }
            </style>
          </head>
          <body>
            <div class="header">
              <div>
                <div class="logo">SmartTani</div>
                <div style="font-size: 10px; color: #64748b; margin-top: 4px; font-weight: 600;">PLATFORM PERTANIAN INTEGRASI B2B</div>
              </div>
              <div>
                <div class="invoice-title">INVOICE RESMI</div>
                <div style="font-size: 10px; color: #64748b; margin-top: 4px; font-weight: 600; text-align: right;">NO: ${inv.invoice_no}</div>
              </div>
            </div>

            <div class="details">
              <div>
                <div class="bill-to">Dari (Supplier):</div>
                <strong>${inv.seller_name}</strong><br>
                Greenhouse Petani Mandiri<br>
                Banyuwangi, Jawa Timur
              </div>
              <div style="text-align: right;">
                <div class="bill-to font-bold">Kepada (Distributor):</div>
                <strong>Distributor Sembako Mandiri</strong><br>
                Gudang Utama Blok C, Jl. Raya Industri No. 45<br>
                Surabaya, Jawa Timur
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th style="width: 50%;">Deskripsi Barang</th>
                  <th style="width: 15%; text-align: right;">Harga Unit</th>
                  <th style="width: 15%; text-align: center;">Kuantitas</th>
                  <th style="width: 20%; text-align: right;">Total Harga</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRowsHtml}
              </tbody>
            </table>

            <div class="summary">
              <div>
                <span>Subtotal Barang:</span>
                <strong>Rp ${subtotal.toLocaleString('id-ID')}</strong>
              </div>
              <div>
                <span>Logistik Rantai Pasok:</span>
                <strong>Rp ${shippingCost.toLocaleString('id-ID')}</strong>
              </div>
              <div>
                <span>Biaya Jasa Platform B2B:</span>
                <strong>Rp ${platformFee.toLocaleString('id-ID')}</strong>
              </div>
              <div class="grand-total" style="margin-top: 10px;">
                <span>Total Pembayaran:</span>
                <strong>Rp ${grandTotal.toLocaleString('id-ID')}</strong>
              </div>
            </div>

            <div class="footer">
              Terima kasih telah bertransaksi melalui SmartTani Ecosystem. Dokumen ini adalah bukti transaksi B2B sah.<br>
              © 2026 SmartTani Indonesia. All rights reserved.
            </div>

            <script>
              window.onload = function() {
                window.print();
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }, 800);
  };

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Back button */}
      <div>
        <Link
          href="/dashboard/distributor/finance"
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" /> Kembali ke Keuangan
        </Link>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Daftar Invoice Belanja B2B
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Cetak atau unduh dokumen invoice resmi lunas sebagai berkas pelaporan pengeluaran modal
          usaha Anda.
        </p>
      </div>

      {isOffline && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-800">Modus Simulasi Luring Aktif</h4>
            <p className="text-[11px] text-amber-600/90 font-medium mt-0.5 leading-relaxed">
              Arsip berkas invoice lunas digenerasikan menggunakan arsip pesanan simulasi lokal.
            </p>
          </div>
        </div>
      )}

      {/* Invoice list */}
      <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : activeInvoices.length === 0 ? (
            <div className="py-14 text-center">
              <FileText className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-xs font-bold text-slate-800">
                Belum ada invoice diterbitkan
              </h3>
              <p className="mt-1 text-[11px] text-slate-500 font-semibold">
                Selesaikan penerimaan pesanan grosir untuk menerbitkan invoice lunas.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="border-b border-slate-100">
                    <TableHead className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider py-3 pl-4">
                      No. Invoice
                    </TableHead>
                    <TableHead className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                      Tanggal Terbit
                    </TableHead>
                    <TableHead className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                      Mitra Petani
                    </TableHead>
                    <TableHead className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                      Komoditas Barang
                    </TableHead>
                    <TableHead className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider text-right">
                      Nominal Lunas
                    </TableHead>
                    <TableHead className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider text-center">
                      Status
                    </TableHead>
                    <TableHead className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider text-center">
                      Unduh
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeInvoices.map((inv: (typeof MOCK_INVOICES)[number]) => (
                    <TableRow
                      key={inv.invoice_no}
                      className="border-b border-slate-100 hover:bg-slate-50/40"
                    >
                      <TableCell className="font-bold text-xs py-3 pl-4 text-slate-800">
                        {inv.invoice_no}
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-slate-500">
                        {new Date(inv.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-slate-600">
                        {inv.seller_name}
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-slate-600 max-w-[200px] truncate">
                        {inv.items_summary}
                      </TableCell>
                      <TableCell className="text-xs font-bold text-slate-800 text-right">
                        {formatCurrency(inv.total_amount)}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center rounded-lg border border-green-200/50 bg-green-50 px-2.5 py-0.5 text-[9.5px] font-bold text-green-700">
                          Lunas
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          size="sm"
                          onClick={() => handleDownloadInvoice(inv)}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold text-[10px] h-7.5 px-2.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer mx-auto shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5" /> PDF /{' '}
                          <Printer className="w-3.5 h-3.5" /> Cetak
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
