'use client';

import { useState } from 'react';
import { 
  Search, 
  MessageCircle, 
  Star, 
  Filter,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Flag,
  Reply
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Textarea } from '@/components/ui/textarea';

// Mock data
const MOCK_REVIEWS = [
  {
    id: '1',
    customerName: 'Budi Santoso',
    customerAvatar: '/avatars/01.png',
    productName: 'Pupuk Organik Cair Hayati - 1 Liter',
    rating: 5,
    date: '2024-05-14T10:30:00',
    comment: 'Pupuknya sangat bagus, tanaman padi saya tumbuh lebih hijau dan cepat setelah pakai ini. Pengiriman juga sangat cepat. Rekomendasi banget buat petani lain!',
    status: 'replied',
    reply: 'Terima kasih banyak Bapak Budi atas kepercayaannya. Senang mendengar hasil panennya meningkat. Ditunggu pesanan selanjutnya ya Pak!',
  },
  {
    id: '2',
    customerName: 'Siti Aminah',
    customerAvatar: '',
    productName: 'Benih Jagung Hibrida P35',
    rating: 4,
    date: '2024-05-12T14:15:00',
    comment: 'Benihnya bagus, daya tumbuhnya tinggi. Cuma sayangnya kemasan agak penyok pas sampai, untung isinya aman.',
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
    comment: 'Sangat ampuh membasmi kutu daun di tanaman cabai saya. Baunya juga tidak menyengat karena alami. Mantap!',
    status: 'replied',
    reply: 'Alhamdulillah, terima kasih ulasannya Pak Ahmad. Kami selalu berusaha memberikan produk organik terbaik.',
  },
  {
    id: '4',
    customerName: 'Joko Widodo',
    customerAvatar: '',
    productName: 'Cangkul Baja Modern',
    rating: 3,
    date: '2024-05-08T16:45:00',
    comment: 'Cangkulnya lumayan tajam, tapi gagangnya terasa agak kurang kokoh kalau dipakai di tanah yang sangat keras. Sesuai harga lah.',
    status: 'unreplied',
    reply: '',
  },
];

export function FarmerReviewList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const filteredReviews = MOCK_REVIEWS.filter(review => {
    const matchesSearch = review.productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter;
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
    
    return matchesSearch && matchesRating && matchesStatus;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star 
        key={index} 
        className={cn(
          "w-4 h-4",
          index < rating ? "fill-yellow-400 text-yellow-400" : "fill-slate-100 text-slate-200"
        )} 
      />
    ));
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 bg-slate-50 min-h-screen text-slate-900 w-full max-w-full overflow-x-hidden">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/farmer">Marketplace</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Ulasan Pembeli</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ulasan Pembeli</h1>
          <p className="text-muted-foreground text-sm">Kelola ulasan dan balas masukan dari pelanggan Anda.</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6 flex items-center gap-6">
            <div className="flex flex-col items-center justify-center space-y-1 border-r pr-6">
              <span className="text-4xl font-bold text-slate-900">4.8</span>
              <div className="flex gap-0.5">
                {renderStars(5)}
              </div>
              <span className="text-xs text-slate-500 font-medium">dari 5.0</span>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2 font-medium">5</span>
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full" style={{ width: '85%' }} />
                </div>
                <span className="w-6 text-right text-slate-500">120</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2 font-medium">4</span>
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full" style={{ width: '10%' }} />
                </div>
                <span className="w-6 text-right text-slate-500">15</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2 font-medium">3</span>
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full" style={{ width: '3%' }} />
                </div>
                <span className="w-6 text-right text-slate-500">4</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-2 font-medium">2</span>
                <Star className="w-3 h-3 fill-slate-200 text-slate-200" />
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full" style={{ width: '0%' }} />
                </div>
                <span className="w-6 text-right">0</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-2 font-medium">1</span>
                <Star className="w-3 h-3 fill-slate-200 text-slate-200" />
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full" style={{ width: '2%' }} />
                </div>
                <span className="w-6 text-right">2</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Total Ulasan</p>
                <h3 className="text-2xl font-bold">141</h3>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Sebanyak <span className="font-bold text-slate-700">95%</span> pembeli memberikan rating positif (4-5 bintang) untuk produk Anda.
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Reply className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Perlu Dibalas</p>
                <h3 className="text-2xl font-bold">12</h3>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Merespon ulasan pelanggan dapat meningkatkan kepercayaan dan reputasi toko Anda.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Cari ulasan, nama pembeli, atau nama produk..." 
                className="pl-10 h-10 border-slate-200 bg-slate-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px] h-10 border-slate-200 bg-white">
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="replied">Sudah Dibalas</SelectItem>
                  <SelectItem value="unreplied">Belum Dibalas</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-[140px] h-10 border-slate-200 bg-white">
                  <SelectValue placeholder="Semua Bintang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Bintang</SelectItem>
                  <SelectItem value="5">Bintang 5</SelectItem>
                  <SelectItem value="4">Bintang 4</SelectItem>
                  <SelectItem value="3">Bintang 3</SelectItem>
                  <SelectItem value="2">Bintang 2</SelectItem>
                  <SelectItem value="1">Bintang 1</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <Card key={review.id} className="border-none shadow-sm overflow-hidden bg-white">
              <CardContent className="p-0">
                <div className="p-5 flex flex-col md:flex-row gap-6">
                  {/* Left Column: User & Rating */}
                  <div className="w-full md:w-64 shrink-0 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-slate-100 shadow-sm">
                        <AvatarImage src={review.customerAvatar} alt={review.customerName} />
                        <AvatarFallback className="bg-slate-100 text-slate-600 text-xs font-bold">
                          {getInitials(review.customerName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">{review.customerName}</span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {new Date(review.date).toLocaleDateString('id-ID', { 
                            day: 'numeric', month: 'long', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <div className="flex gap-0.5">
                        {renderStars(review.rating)}
                      </div>
                      <Badge variant="secondary" className="bg-slate-50 text-slate-600 border-none font-normal text-[10px] px-2">
                        Pembeli Terverifikasi
                      </Badge>
                    </div>
                  </div>

                  {/* Right Column: Content & Reply */}
                  <div className="flex-1 flex flex-col gap-3 min-w-0">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <p className="text-xs font-medium text-slate-500 mb-1 border-b border-slate-100 pb-1 inline-block">
                          Produk: <span className="text-green-700 font-semibold">{review.productName}</span>
                        </p>
                        <p className="text-sm text-slate-700 leading-relaxed mt-1">
                          "{review.comment}"
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-slate-400 hover:text-slate-600 rounded-full">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                            <Flag className="w-4 h-4 mr-2" /> Laporkan Ulasan
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Reply Section */}
                    {review.status === 'replied' ? (
                      <div className="mt-2 bg-slate-50 border border-slate-100 rounded-lg p-4 relative">
                        <div className="absolute top-0 left-6 w-3 h-3 bg-slate-50 border-t border-l border-slate-100 -translate-y-1/2 rotate-45" />
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-1.5 py-0">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Dibalas
                          </Badge>
                          <span className="text-[10px] font-semibold text-slate-500">Penjual (Anda)</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                          {review.reply}
                        </p>
                      </div>
                    ) : (
                      <div className="mt-2">
                        {replyingTo === review.id ? (
                          <div className="space-y-3 bg-green-50/50 border border-green-100 rounded-lg p-4 relative">
                            <div className="absolute top-0 left-6 w-3 h-3 bg-green-50/50 border-t border-l border-green-100 -translate-y-1/2 rotate-45" />
                            <Textarea 
                              placeholder="Tulis balasan Anda di sini..."
                              className="min-h-[80px] text-sm bg-white resize-none"
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              autoFocus
                            />
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => { setReplyingTo(null); setReplyText(''); }}
                                className="text-slate-500"
                              >
                                Batal
                              </Button>
                              <Button 
                                size="sm" 
                                className="bg-green-700 hover:bg-green-800 text-white"
                                onClick={() => {
                                  // Mock submit
                                  review.status = 'replied';
                                  review.reply = replyText;
                                  setReplyingTo(null);
                                  setReplyText('');
                                }}
                              >
                                Kirim Balasan
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-amber-600 border-amber-200 bg-amber-50 hover:bg-amber-100 hover:text-amber-700 text-xs h-8 mt-1"
                            onClick={() => { setReplyingTo(review.id); setReplyText(''); }}
                          >
                            <Reply className="w-3.5 h-3.5 mr-1.5" /> Balas Ulasan
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-none shadow-sm">
            <CardContent className="h-64 flex flex-col items-center justify-center text-center p-6">
              <MessageCircle className="w-12 h-12 text-slate-300 mb-3" />
              <p className="font-medium text-slate-600">Tidak ada ulasan ditemukan</p>
              <p className="text-sm text-slate-400 mt-1 max-w-sm">
                Coba sesuaikan kata kunci pencarian atau ubah filter untuk menemukan ulasan yang Anda cari.
              </p>
              <Button 
                variant="outline" 
                className="mt-4 bg-white"
                onClick={() => { setSearchTerm(''); setRatingFilter('all'); setStatusFilter('all'); }}
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
            Menampilkan <span className="font-medium text-slate-900">1 - {filteredReviews.length}</span> dari <span className="font-medium text-slate-900">{filteredReviews.length}</span> ulasan
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8 bg-white border-slate-200" disabled>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-1">
              <Button size="sm" className="h-8 w-8 p-0 bg-green-700 text-white hover:bg-green-800 shadow-sm">1</Button>
            </div>
            <Button variant="outline" size="icon" className="h-8 w-8 bg-white border-slate-200" disabled>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
