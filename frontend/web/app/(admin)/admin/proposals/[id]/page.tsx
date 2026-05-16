'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { investmentService, Proposal } from '@/services/investment';
import { formatCurrency } from '@/lib/utils';
import { formatDate } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function AdminProposalDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchProposal() {
      try {
        setLoading(true);
        const response = await investmentService.getProposalById(id as string);
        setProposal(response.data);
      } catch (error) {
        console.error('Failed to fetch proposal:', error);
        toast.error('Gagal memuat detail proposal');
        router.push('/admin/proposals');
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProposal();
  }, [id, router]);

  const handleApprove = async () => {
    try {
      setSubmitting(true);
      await investmentService.approveProposal(id as string);
      toast.success('Proposal disetujui');
      router.push('/admin/proposals');
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((error as any).response?.data?.error?.message || 'Gagal menyetujui proposal');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim() || rejectReason.length < 10) {
      toast.error('Alasan penolakan minimal 10 karakter');
      return;
    }

    try {
      setSubmitting(true);
      await investmentService.rejectProposal(id as string, rejectReason);
      toast.success('Proposal ditolak');
      setIsRejectDialogOpen(false);
      router.push('/admin/proposals');
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((error as any).response?.data?.error?.message || 'Gagal menolak proposal');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8">Memuat detail proposal...</div>;
  }

  if (!proposal) return null;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Kembali
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Detail Proposal</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{proposal.title}</CardTitle>
                  <CardDescription>
                    Diajukan pada{' '}
                    {formatDate(new Date(proposal.created_at), 'dd MMMM yyyy', {
                      locale: idLocale,
                    })}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="capitalize text-lg px-4 py-1">
                  {proposal.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-lg mb-2">Deskripsi</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">{proposal.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-1">Komoditas</h4>
                  <p>{proposal.commodity}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Luas Lahan</h4>
                  <p>{proposal.land_area_ha} Ha</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Durasi Proyek</h4>
                  <p>{proposal.duration_days} Hari</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Estimasi Panen</h4>
                  <p>
                    {formatDate(new Date(proposal.harvest_date_estimated), 'dd MMM yyyy', {
                      locale: idLocale,
                    })}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Penggunaan Dana</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">{proposal.use_of_funds}</p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Catatan Risiko</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">{proposal.risk_notes}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Pendanaan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Dana Dibutuhkan</p>
                <p className="text-2xl font-bold">{formatCurrency(proposal.funding_needed)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Proyeksi ROI</p>
                <p className="text-xl font-semibold text-green-600">
                  {proposal.projected_roi_percent}%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lokasi</p>
                <p className="font-medium">
                  {proposal.location.city}, {proposal.location.province}
                </p>
                <p className="text-sm text-muted-foreground">{proposal.location.full_address}</p>
              </div>
            </CardContent>
          </Card>

          {proposal.status === 'submitted' && (
            <Card className="border-blue-200 bg-blue-50/30">
              <CardHeader>
                <CardTitle>Tindakan Admin</CardTitle>
                <CardDescription>Proposal ini menunggu tinjauan Anda.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={handleApprove}
                  disabled={submitting}
                >
                  <CheckCircle className="h-4 w-4 mr-2" /> Setujui Proposal
                </Button>

                <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                  <DialogTrigger
                    render={
                      <Button
                        variant="outline"
                        className="w-full text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-2" /> Tolak Proposal
                      </Button>
                    }
                  />
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Tolak Proposal</DialogTitle>
                      <DialogDescription>
                        Berikan alasan penolakan yang jelas agar petani dapat memperbaiki proposal
                        mereka.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-2">
                      <Label htmlFor="reason">Alasan Penolakan</Label>
                      <Textarea
                        id="reason"
                        placeholder="Misal: Dana yang diajukan tidak masuk akal untuk komoditas ini..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="min-h-[120px]"
                      />
                      <p className="text-xs text-muted-foreground">Minimal 10 karakter.</p>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
                        Batal
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleReject}
                        disabled={submitting || rejectReason.length < 10}
                      >
                        {submitting ? 'Memproses...' : 'Tolak Sekarang'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
