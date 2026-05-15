'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface ProposalFilterProps {
  category: string;
  onCategoryChange: (value: string) => void;
  province: string;
  onProvinceChange: (value: string) => void;
}

const commodityOptions = [
  { value: 'all', label: 'Semua Komoditas' },
  { value: 'Padi', label: 'Padi' },
  { value: 'Jagung', label: 'Jagung' },
  { value: 'Cabai', label: 'Cabai' },
  { value: 'Bawang Merah', label: 'Bawang Merah' },
  { value: 'Kentang', label: 'Kentang' },
];

const provinceOptions = [
  { value: 'all', label: 'Semua Lokasi' },
  { value: 'Jawa Barat', label: 'Jawa Barat' },
  { value: 'Jawa Tengah', label: 'Jawa Tengah' },
  { value: 'Jawa Timur', label: 'Jawa Timur' },
  { value: 'Sumatera Utara', label: 'Sumatera Utara' },
  { value: 'Sulawesi Selatan', label: 'Sulawesi Selatan' },
];

export function ProposalFilter({
  category,
  onCategoryChange,
  province,
  onProvinceChange,
}: ProposalFilterProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Cari proposal investasi..." 
            className="pl-10"
          />
        </div>
      </div>
      <div className="w-full md:w-[200px]">
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Komoditas" />
          </SelectTrigger>
          <SelectContent>
            {commodityOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-full md:w-[200px]">
        <Select value={province} onValueChange={onProvinceChange}>
          <SelectTrigger>
            <SelectValue placeholder="Lokasi" />
          </SelectTrigger>
          <SelectContent>
            {provinceOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
