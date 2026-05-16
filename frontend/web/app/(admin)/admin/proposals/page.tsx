'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { investmentService, Proposal } from '@/services/investment'
import { ProposalTable } from '@/components/features/admin/proposals/ProposalTable'
import { ProposalFilter } from '@/components/features/admin/proposals/ProposalFilter'
import { toast } from 'sonner'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

export default function AdminProposalsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [meta, setMeta] = useState({ totalPages: 1 })
  const [loading, setLoading] = useState(true)

  const status = searchParams.get('status') || 'all'
  const page = parseInt(searchParams.get('page') || '1', 10)

  const fetchProposals = useCallback(async () => {
    try {
      setLoading(true)
      const params = {
        status: status === 'all' ? undefined : status,
        page,
        limit: 10,
      }
      const response = await investmentService.getProposals(params)
      setProposals(response.data.proposals)
      setMeta(response.data.meta)
    } catch (error) {
      console.error('Failed to fetch proposals:', error)
      toast.error('Gagal memuat data proposal')
    } finally {
      setLoading(false)
    }
  }, [status, page])

  useEffect(() => {
    fetchProposals()
  }, [fetchProposals])

  const updateFilters = (newStatus: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (newStatus === 'all') params.delete('status')
    else params.set('status', newStatus)
    
    params.set('page', '1')
    router.push(`/admin/proposals?${params.toString()}`)
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    router.push(`/admin/proposals?${params.toString()}`)
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Kelola Proposal Investasi</h2>
      </div>

      <ProposalFilter
        status={status}
        onStatusChange={updateFilters}
      />

      <ProposalTable
        proposals={proposals}
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
