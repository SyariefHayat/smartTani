'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { investmentService, Proposal } from '@/services/investment';
import { ProposalCard } from '@/components/features/investment/ProposalCard';
import { ProposalFilter } from '@/components/features/investment/ProposalFilter';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { SearchX, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export default function BrowseProposalsPage() {
  const [category, setCategory] = useState('all');
  const [province, setProvince] = useState('all');
  const [page, setPage] = useState(1);

  const { data: proposalsData, isLoading, isError } = useQuery({
    queryKey: ['proposals', { category, province, page }],
    queryFn: () => investmentService.getProposals({
      status: 'open_for_funding',
      category: category === 'all' ? undefined : category,
      location_province: province === 'all' ? undefined : province,
      page,
      limit: 12,
    }),
  });

  const proposals: Proposal[] = proposalsData?.data?.proposals || [];
  const meta = proposalsData?.data?.meta;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Investasi Tani</h1>
        <div className="h-10 w-full mb-8 bg-gray-100 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-[400px] w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold">Gagal memuat daftar proposal</h2>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Muat Ulang
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Investasi Tani</h1>
          <p className="text-gray-500 mt-1">Dukung petani lokal dan dapatkan bagi hasil yang menguntungkan.</p>
        </div>
      </div>

      <ProposalFilter 
        category={category}
        onCategoryChange={(val) => { setCategory(val); setPage(1); }}
        province={province}
        onProvinceChange={(val) => { setProvince(val); setPage(1); }}
      />

      {proposals.length === 0 ? (
        <div className="bg-white border rounded-xl p-20 text-center">
          <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <SearchX className="w-10 h-10 text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Proposal Tidak Ditemukan</h2>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">
            Maaf, saat ini belum ada proposal yang sesuai dengan filter Anda. 
            Coba ubah filter atau kembali lagi nanti.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {proposals.map((proposal) => (
              <ProposalCard key={proposal.id} proposal={proposal} />
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium">
                Halaman {page} dari {meta.totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                disabled={page === meta.totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
