'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface OrderFilterProps {
  status: string
  onStatusChange: (value: string) => void
}

export function OrderFilter({ status, onStatusChange }: OrderFilterProps) {
  return (
    <div className="flex flex-wrap gap-4 items-end mb-6">
      <div className="space-y-1.5">
        <Label>Filter Status</Label>
        <Select value={status} onValueChange={(val) => onStatusChange(val || 'all')}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Pilih Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="pending_payment">Menunggu Pembayaran</SelectItem>
            <SelectItem value="paid">Sudah Dibayar</SelectItem>
            <SelectItem value="confirmed_seller">Dikonfirmasi Penjual</SelectItem>
            <SelectItem value="shipped">Dikirim</SelectItem>
            <SelectItem value="delivered">Diterima</SelectItem>
            <SelectItem value="completed">Selesai</SelectItem>
            <SelectItem value="cancelled">Dibatalkan</SelectItem>
            <SelectItem value="refund_requested">Permintaan Refund</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
