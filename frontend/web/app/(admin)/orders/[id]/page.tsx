'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { orderService, Order } from '@/services/order'
import { formatCurrency } from '@/lib/utils'
import { formatDate } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Package, User, MapPin, Calendar } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function AdminOrderDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrder() {
      try {
        setLoading(true)
        const response = await orderService.getOrderById(id as string)
        setOrder(response.data)
      } catch (error) {
        console.error('Failed to fetch order:', error)
        toast.error('Gagal memuat detail order')
        router.push('/admin/orders')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchOrder()
  }, [id, router])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_payment':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Menunggu Pembayaran</Badge>
      case 'paid':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Sudah Dibayar</Badge>
      case 'confirmed_seller':
        return <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">Dikonfirmasi Penjual</Badge>
      case 'shipped':
        return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Dikirim</Badge>
      case 'delivered':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Diterima</Badge>
      case 'completed':
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Selesai</Badge>
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Dibatalkan</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return <div className="p-8">Memuat detail order...</div>
  }

  if (!order) return null

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Kembali
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Detail Order</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Package className="h-5 w-5" /> Order #{order.id.split('-')[0].toUpperCase()}
                  </CardTitle>
                  <CardDescription>Dibuat pada {formatDate(new Date(order.created_at), 'dd MMMM yyyy HH:mm', { locale: idLocale })}</CardDescription>
                </div>
                {getStatusBadge(order.status)}
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produk</TableHead>
                    <TableHead className="text-center">Jumlah</TableHead>
                    <TableHead className="text-right">Harga</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="font-medium">Produk #{item.product_id.split('-')[0]}</div>
                        <div className="text-xs text-muted-foreground">Farmer: {item.farmer_id}</div>
                      </TableCell>
                      <TableCell className="text-center">{item.quantity} kg</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.price_per_unit)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(item.subtotal)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal Produk</span>
                  <span>{formatCurrency(order.total_amount - order.shipping_cost - order.platform_fee)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Biaya Layanan</span>
                  <span>{formatCurrency(order.platform_fee)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ongkos Kirim</span>
                  <span>{formatCurrency(order.shipping_cost)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total Pembayaran</span>
                  <span className="text-green-600">{formatCurrency(order.total_amount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" /> Informasi Buyer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground">Buyer ID</p>
                <p className="font-medium">{order.buyer_id}</p>
              </div>
              {order.notes && (
                <div>
                  <p className="text-muted-foreground">Catatan</p>
                  <p className="italic">"{order.notes}"</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" /> Alamat Pengiriman
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-bold">{order.shipping_address.recipient_name}</p>
              <p>{order.shipping_address.phone_number}</p>
              <p>{order.shipping_address.full_address}</p>
              <p>{order.shipping_address.city}, {order.shipping_address.province}</p>
              <p>{order.shipping_address.postal_code}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
