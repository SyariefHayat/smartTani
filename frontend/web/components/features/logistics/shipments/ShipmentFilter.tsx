'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface ShipmentFilterProps {
  status: string
  onStatusChange: (value: string) => void
}

export function ShipmentFilter({ status, onStatusChange }: ShipmentFilterProps) {
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
            <SelectItem value="pending_pickup">Menunggu Pickup</SelectItem>
            <SelectItem value="picked_up">Sudah Pickup</SelectItem>
            <SelectItem value="in_transit">Dalam Perjalanan</SelectItem>
            <SelectItem value="delivered">Diterima</SelectItem>
            <SelectItem value="cancelled">Dibatalkan</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
