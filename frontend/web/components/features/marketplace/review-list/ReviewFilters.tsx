'use client';

import { Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ReviewFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  ratingFilter: string;
  setRatingFilter: (value: string) => void;
}

export function ReviewFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  ratingFilter,
  setRatingFilter,
}: ReviewFiltersProps) {
  return (
    <Card className="border-none shadow-sm overflow-hidden rounded-xl">
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
  );
}
