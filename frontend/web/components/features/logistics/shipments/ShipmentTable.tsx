'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shipment } from '@/services/logistics';
import { formatDate } from 'date-fns';
import { id } from 'date-fns/locale';
import { Package, Truck, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ShipmentTableProps {
  shipments: Shipment[];
  loading: boolean;
  onUpdateStatus: (orderId: string, status: string, notes?: string) => Promise<void>;
}

export function ShipmentTable({ shipments, loading, onUpdateStatus }: ShipmentTableProps) {
  const [selectedShipment, setSelectedShipment] = useState<{
    id: string;
    orderId: string;
    targetStatus: string;
  } | null>(null);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_pickup':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            Menunggu Pickup
          </Badge>
        );
      case 'picked_up':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Sudah Pickup</Badge>;
      case 'in_transit':
        return (
          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
            Dalam Perjalanan
          </Badge>
        );
      case 'delivered':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Diterima</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Dibatalkan</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleUpdate = async () => {
    if (!selectedShipment) return;

    try {
      setSubmitting(true);
      await onUpdateStatus(selectedShipment.orderId, selectedShipment.targetStatus, notes);
      setIsDialogOpen(false);
      setNotes('');
      setSelectedShipment(null);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Update Terakhir</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                {[...Array(4)].map((_, j) => (
                  <TableCell key={j}>
                    <div className="h-4 w-full animate-pulse bg-gray-100 rounded" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Update Terakhir</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shipments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Tidak ada pengiriman yang ditugaskan.
                </TableCell>
              </TableRow>
            ) : (
              shipments.map((shipment) => (
                <TableRow key={shipment.id}>
                  <TableCell className="font-mono text-xs uppercase">
                    {shipment.order_id.split('-')[0]}...
                  </TableCell>
                  <TableCell>{getStatusBadge(shipment.status)}</TableCell>
                  <TableCell>
                    {formatDate(new Date(shipment.updatedAt), 'dd MMM yyyy HH:mm', { locale: id })}
                  </TableCell>
                  <TableCell className="text-right">
                    {shipment.status === 'pending_pickup' && (
                      <Button
                        size="sm"
                        className="bg-yellow-600 hover:bg-yellow-700"
                        onClick={() => {
                          setSelectedShipment({
                            id: shipment.id,
                            orderId: shipment.order_id,
                            targetStatus: 'pickup',
                          });
                          setIsDialogOpen(true);
                        }}
                      >
                        <Package className="h-4 w-4 mr-1" /> Pickup
                      </Button>
                    )}
                    {(shipment.status === 'picked_up' || shipment.status === 'in_transit') && (
                      <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 mr-2"
                        onClick={() => {
                          setSelectedShipment({
                            id: shipment.id,
                            orderId: shipment.order_id,
                            targetStatus: 'transit',
                          });
                          setIsDialogOpen(true);
                        }}
                      >
                        <Truck className="h-4 w-4 mr-1" /> In Transit
                      </Button>
                    )}
                    {shipment.status === 'in_transit' && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          setSelectedShipment({
                            id: shipment.id,
                            orderId: shipment.order_id,
                            targetStatus: 'deliver',
                          });
                          setIsDialogOpen(true);
                        }}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" /> Deliver
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Status Pengiriman</DialogTitle>
            <DialogDescription>
              Konfirmasi pembaruan status untuk order ini. Anda dapat menambahkan catatan tambahan.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <Label htmlFor="notes">Catatan (Opsional)</Label>
            <Textarea
              id="notes"
              placeholder="Tambahkan detail perjalanan atau kendala jika ada..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={submitting}>
              Batal
            </Button>
            <Button onClick={handleUpdate} disabled={submitting}>
              {submitting ? 'Memproses...' : 'Update Status'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
