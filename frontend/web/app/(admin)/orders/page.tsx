'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { orderService, Order } from '@/services/order'
import { OrderTable } from '@/components/features/admin/orders/OrderTable'
import { OrderFilter } from '@/components/features/admin/orders/OrderFilter'
import { toast } from 'sonner'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

export default function AdminOrdersPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [orders, setOrders] = useState<Order[]>([])
  const [meta, setMeta] = useState({ totalPages: 1 })
  const [loading, setLoading] = useState(true)

  const status = searchParams.get('status') || 'all'
  const page = parseInt(searchParams.get('page') || '1', 10)

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      const params = {
        status: status === 'all' ? undefined : status,
        page,
        limit: 10,
      }
      const response = await orderService.getOrders(params)
      setOrders(response.data.orders)
      setMeta(response.data.meta)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      toast.error('Gagal memuat data order')
    } finally {
      setLoading(false)
    }
  }, [status, page])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const updateFilters = (newStatus: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (newStatus === 'all') params.delete('status')
    else params.set('status', newStatus)
    
    params.set('page', '1')
    router.push(`/admin/orders?${params.toString()}`)
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    router.push(`/admin/orders?${params.toString()}`)
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Kelola Order</h2>
      </div>

      <OrderFilter
        status={status}
        onStatusChange={updateFilters}
      />

      <OrderTable
        orders={orders}
        loading={loading}
      />

      {meta.totalPages > 1 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault()
                    if (page > 1) handlePageChange(page - 1)
                  }}
                  className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              {[...Array(meta.totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      handlePageChange(i + 1)
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
                  onClick={(e) => {
                    e.preventDefault()
                    if (page < meta.totalPages) handlePageChange(page + 1)
                  }}
                  className={page >= meta.totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
