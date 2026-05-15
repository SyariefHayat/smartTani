'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface OrderFilterProps {
  status: string;
  onStatusChange: (status: string) => void;
}

const statusOptions = [
  { value: 'all', label: 'Semua Status' },
  { value: 'pending_payment', label: 'Menunggu Pembayaran' },
  { value: 'paid', label: 'Dibayar' },
  { value: 'confirmed_seller', label: 'Dikonfirmasi' },
  { value: 'shipped', label: 'Dikirim' },
  { value: 'delivered', label: 'Selesai' },
  { value: 'cancelled', label: 'Dibatalkan' },
];

export function OrderFilter({ status, onStatusChange }: OrderFilterProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="w-full md:w-[240px]">
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih Status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
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
