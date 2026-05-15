'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UserCheck, FileText, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { OverviewMetrics } from '@/services/analytics'

interface QuickActionsProps {
  metrics?: OverviewMetrics
  loading?: boolean
}

export function QuickActions({ metrics, loading }: QuickActionsProps) {
  return (
    <Card className="col-span-4 lg:col-span-4">
      <CardHeader>
        <CardTitle>Perlu Tindakan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-full">
                <UserCheck className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Verifikasi Pengguna</p>
                <p className="text-sm text-muted-foreground">
                  {loading ? '...' : metrics?.pending_users || 0} pendaftar menunggu verifikasi
                </p>
              </div>
            </div>
            <Link href="/admin/users?status=pending_verification">
              <Button variant="ghost" size="sm">
                Lihat <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-100 rounded-full">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">Review Proposal</p>
                <p className="text-sm text-muted-foreground">
                  {loading ? '...' : metrics?.pending_proposals || 0} proposal baru masuk
                </p>
              </div>
            </div>
            <Link href="/admin/proposals?status=pending">
              <Button variant="ghost" size="sm">
                Lihat <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
