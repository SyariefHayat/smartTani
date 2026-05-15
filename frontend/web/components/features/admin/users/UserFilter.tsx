'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface UserFilterProps {
  role: string
  status: string
  onRoleChange: (value: string) => void
  onStatusChange: (value: string) => void
}

export function UserFilter({
  role,
  status,
  onRoleChange,
  onStatusChange,
}: UserFilterProps) {
  return (
    <div className="flex flex-wrap gap-4 items-end mb-6">
      <div className="space-y-1.5">
        <Label>Filter Peran</Label>
        <Select value={role} onValueChange={(val) => onRoleChange(val || 'all')}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Pilih Peran" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Peran</SelectItem>
            <SelectItem value="petani">Petani</SelectItem>
            <SelectItem value="buyer">Buyer</SelectItem>
            <SelectItem value="investor">Investor</SelectItem>
            <SelectItem value="distributor">Distributor</SelectItem>
            <SelectItem value="logistik">Logistik</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Filter Status</Label>
        <Select value={status} onValueChange={(val) => onStatusChange(val || 'all')}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Pilih Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="pending_verification">Menunggu Verifikasi</SelectItem>
            <SelectItem value="suspended">Ditangguhkan</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
