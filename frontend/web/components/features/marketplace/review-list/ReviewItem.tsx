'use client';

import { useState } from 'react';
import { CheckCircle2, Flag, MoreVertical, Reply, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Review } from './types';

interface ReviewItemProps {
  review: Review;
}

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }).map((_, index) => (
    <Star
      key={index}
      className={cn(
        'w-4 h-4',
        index < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-slate-100 text-slate-200'
      )}
    />
  ));
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

export function ReviewItem({ review }: ReviewItemProps) {
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [currentReview, setCurrentReview] = useState(review);

  const handleSendReply = () => {
    // Mock submit
    setCurrentReview({
      ...currentReview,
      status: 'replied',
      reply: replyText,
    });
    setReplying(false);
    setReplyText('');
  };

  return (
    <Card className="border-none shadow-sm overflow-hidden bg-white rounded-xl">
      <CardContent className="p-0">
        <div className="p-5 flex flex-col md:flex-row gap-6">
          {/* Left Column: User & Rating */}
          <div className="w-full md:w-64 shrink-0 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-slate-100 shadow-sm">
                <AvatarImage src={currentReview.customerAvatar} alt={currentReview.customerName} />
                <AvatarFallback className="bg-slate-100 text-slate-600 text-xs font-bold">
                  {getInitials(currentReview.customerName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900">
                  {currentReview.customerName}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {new Date(currentReview.date).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex gap-0.5">{renderStars(currentReview.rating)}</div>
              <Badge
                variant="secondary"
                className="bg-slate-50 text-slate-600 border-none font-normal text-[10px] px-2"
              >
                Pembeli Terverifikasi
              </Badge>
            </div>
          </div>

          {/* Right Column: Content & Reply */}
          <div className="flex-1 flex flex-col gap-3 min-w-0">
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1 border-b border-slate-100 pb-1 inline-block">
                  Produk:{' '}
                  <span className="text-green-700 font-semibold">{currentReview.productName}</span>
                </p>
                <p className="text-sm text-slate-700 leading-relaxed mt-1">
                  &quot;{currentReview.comment}&quot;
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-slate-400 hover:text-slate-600 rounded-full"
                  >
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
            {currentReview.status === 'replied' ? (
              <div className="mt-2 bg-slate-50 border border-slate-100 rounded-lg p-4 relative">
                <div className="absolute top-0 left-6 w-3 h-3 bg-slate-50 border-t border-l border-slate-100 -translate-y-1/2 rotate-45" />
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-1.5 py-0 text-[10px]">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Dibalas
                  </Badge>
                  <span className="text-[10px] font-semibold text-slate-500">Penjual (Anda)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                  {currentReview.reply}
                </p>
              </div>
            ) : (
              <div className="mt-2">
                {replying ? (
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
                        onClick={() => {
                          setReplying(false);
                          setReplyText('');
                        }}
                        className="text-slate-500"
                      >
                        Batal
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-700 hover:bg-green-800 text-white"
                        onClick={handleSendReply}
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
                    onClick={() => {
                      setReplying(true);
                      setReplyText('');
                    }}
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
  );
}
