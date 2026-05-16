'use client';

import { MessageCircle, Reply, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

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

export function ReviewStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="border-none shadow-sm bg-white rounded-xl">
        <CardContent className="p-6 flex items-center gap-6">
          <div className="flex flex-col items-center justify-center space-y-1 border-r pr-6">
            <span className="text-4xl font-bold text-slate-900">4.8</span>
            <div className="flex gap-0.5">{renderStars(5)}</div>
            <span className="text-xs text-slate-500 font-medium">dari 5.0</span>
          </div>
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const percentages = { 5: 85, 4: 10, 3: 3, 2: 0, 1: 2 };
              const counts = { 5: 120, 4: 15, 3: 4, 2: 0, 1: 2 };
              const percent = percentages[rating as keyof typeof percentages];
              const count = counts[rating as keyof typeof counts];
              
              return (
                <div key={rating} className="flex items-center gap-2 text-xs">
                  <span className="w-2 font-medium">{rating}</span>
                  <Star className={cn("w-3 h-3", percent > 0 ? "fill-yellow-400 text-yellow-400" : "fill-slate-200 text-slate-200")} />
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${percent}%` }} />
                  </div>
                  <span className="w-6 text-right text-slate-500">{count}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm bg-white rounded-xl">
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
            Sebanyak <span className="font-bold text-slate-700">95%</span> pembeli memberikan
            rating positif (4-5 bintang) untuk produk Anda.
          </p>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm bg-white rounded-xl">
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
  );
}
