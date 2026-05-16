'use client';

import { useState } from 'react';
import {
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { ReviewHeader } from './review-list/ReviewHeader';
import { ReviewStats } from './review-list/ReviewStats';
import { ReviewFilters } from './review-list/ReviewFilters';
import { ReviewItem } from './review-list/ReviewItem';
import { Review } from './review-list/types';

// Mock data
const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    customerName: 'Budi Santoso',
    customerAvatar: '/avatars/01.png',
    productName: 'Pupuk Organik Cair Hayati - 1 Liter',
    rating: 5,
    date: '2024-05-14T10:30:00',
    comment:
      'Pupuknya sangat bagus, tanaman padi saya tumbuh lebih hijau dan cepat setelah pakai ini. Pengiriman juga sangat cepat. Rekomendasi banget buat petani lain!',
    status: 'replied',
    reply:
      'Terima kasih banyak Bapak Budi atas kepercayaannya. Senang mendengar hasil panennya meningkat. Ditunggu pesanan selanjutnya ya Pak!',
  },
  {
    id: '2',
    customerName: 'Siti Aminah',
    customerAvatar: '',
    productName: 'Benih Jagung Hibrida P35',
    rating: 4,
    date: '2024-05-12T14:15:00',
    comment:
      'Benihnya bagus, daya tumbuhnya tinggi. Cuma sayangnya kemasan agak penyok pas sampai, untung isinya aman.',
    status: 'unreplied',
    reply: '',
  },
  {
    id: '3',
    customerName: 'Ahmad Dahlan',
    customerAvatar: '/avatars/03.png',
    productName: 'Pestisida Alami Anti-Hama',
    rating: 5,
    date: '2024-05-10T09:20:00',
    comment:
      'Sangat ampuh membasmi kutu daun di tanaman cabai saya. Baunya juga tidak menyengat karena alami. Mantap!',
    status: 'replied',
    reply:
      'Alhamdulillah, terima kasih ulasannya Pak Ahmad. Kami selalu berusaha memberikan produk organik terbaik.',
  },
  {
    id: '4',
    customerName: 'Joko Widodo',
    customerAvatar: '',
    productName: 'Cangkul Baja Modern',
    rating: 3,
    date: '2024-05-08T16:45:00',
    comment:
      'Cangkulnya lumayan tajam, tapi gagangnya terasa agak kurang kokoh kalau dipakai di tanah yang sangat keras. Sesuai harga lah.',
    status: 'unreplied',
    reply: '',
  },
];

export function FarmerReviewList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredReviews = MOCK_REVIEWS.filter((review) => {
    const matchesSearch =
      review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter;
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;

    return matchesSearch && matchesRating && matchesStatus;
  });

  return (
    <div className="w-full text-slate-900">
      <div className="mx-auto flex w-full flex-col gap-4">
        <ReviewHeader />
        
        <ReviewStats />

        <ReviewFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          ratingFilter={ratingFilter}
          setRatingFilter={setRatingFilter}
        />

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))
          ) : (
            <Card className="border-none shadow-sm rounded-xl">
              <CardContent className="h-64 flex flex-col items-center justify-center text-center p-6">
                <MessageCircle className="w-12 h-12 text-slate-300 mb-3" />
                <p className="font-medium text-slate-600">Tidak ada ulasan ditemukan</p>
                <p className="text-sm text-slate-400 mt-1 max-w-sm">
                  Coba sesuaikan kata kunci pencarian atau ubah filter untuk menemukan ulasan yang
                  Anda cari.
                </p>
                <Button
                  variant="outline"
                  className="mt-4 bg-white"
                  onClick={() => {
                    setSearchTerm('');
                    setRatingFilter('all');
                    setStatusFilter('all');
                  }}
                >
                  Reset Filter
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pagination (Mock) */}
        {filteredReviews.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 mt-2">
            <p className="text-xs text-slate-500">
              Menampilkan{' '}
              <span className="font-medium text-slate-900">1 - {filteredReviews.length}</span> dari{' '}
              <span className="font-medium text-slate-900">{filteredReviews.length}</span> ulasan
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-white border-slate-200"
                disabled
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  className="h-8 w-8 p-0 bg-green-700 text-white hover:bg-green-800 shadow-sm"
                >
                  1
                </Button>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-white border-slate-200"
                disabled
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
