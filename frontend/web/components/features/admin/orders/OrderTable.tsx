'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Order } from '@/services/order'
import { formatCurrency } from '@/lib/utils'
import { formatDate } from 'date-fns'
import { id } from 'date-fns/locale'
import { Eye } from 'lucide-react'
import Link from 'next/link'

interface OrderTableProps {
  orders: Order[]
  loading: boolean
}

export function OrderTable({ orders, loading }: OrderTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_payment':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Menunggu Pembayaran</Badge>
      case 'paid':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Sudah Dibayar</Badge>
      case 'confirmed_seller':
        return <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">Dikonfirmasi Penjual</Badge>
      case 'processing':
        return <Badge className="bg-sky-100 text-sky-700 hover:bg-sky-100">Diproses</Badge>
      case 'shipped':
        return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Dikirim</Badge>
      case 'delivered':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Diterima</Badge>
      case 'completed':
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Selesai</Badge>
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Dibatalkan</Badge>
      case 'refund_requested':
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Permintaan Refund</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Buyer ID</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal</TableHead>
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
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Buyer ID</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Tidak ada data order.
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs uppercase">{order.id.split('-')[0]}...</TableCell>
                <TableCell className="text-xs">{order.buyer_id}</TableCell>
                <TableCell>{formatCurrency(order.total_amount)}</TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell>
                  {formatDate(new Date(order.created_at), 'dd MMM yyyy HH:mm', { locale: id })}
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/orders/${order.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" /> Detail
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
