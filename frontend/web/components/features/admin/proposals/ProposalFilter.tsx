'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface ProposalFilterProps {
  status: string
  onStatusChange: (value: string) => void
}

export function ProposalFilter({ status, onStatusChange }: ProposalFilterProps) {
  return (
    <div className="flex flex-wrap gap-4 items-end mb-6">
      <div className="space-y-1.5">
        <Label>Filter Status</Label>
        <Select value={status} onValueChange={(val) => onStatusChange(val || 'all')}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Pilih Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="submitted">Menunggu Review</SelectItem>
            <SelectItem value="approved">Disetujui</SelectItem>
            <SelectItem value="rejected">Ditolak</SelectItem>
            <SelectItem value="open_for_funding">Pendanaan Dibuka</SelectItem>
            <SelectItem value="funded">Pendanaan Terpenuhi</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
