'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addressService, SavedAddress } from '@/services/address';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Home,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const MOCK_ADDRESSES: SavedAddress[] = [
  {
    id: 'A-01',
    user_id: 'B-01',
    label: 'Rumah',
    recipient_name: 'Syarief Hayat',
    phone_number: '0812-3456-7890',
    province: 'DKI Jakarta',
    city: 'Jakarta Selatan',
    district: 'Cilandak',
    full_address: 'Gg. Harmoni No. 12, RT 04/RW 02, Cilandak Barat',
    postal_code: '12430',
    is_default: true,
    created_at: '2026-05-27T10:00:00Z',
  },
  {
    id: 'A-02',
    user_id: 'B-01',
    label: 'Kantor',
    recipient_name: 'Syarief Hayat (SmartTani)',
    phone_number: '0877-6543-2109',
    province: 'Jawa Timur',
    city: 'Surabaya',
    district: 'Gubeng',
    full_address: 'Gedung AgroTech Lt. 4, Jl. Kertajaya Indah No. 89',
    postal_code: '60282',
    is_default: false,
    created_at: '2026-05-26T18:00:00Z',
  },
];

export default function BuyerAddressesPage() {
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = React.useState(false);
  const [editingAddress, setEditingAddress] = React.useState<SavedAddress | null>(null);

  // Form states
  const [label, setLabel] = React.useState('');
  const [recipientName, setRecipientName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [province, setProvince] = React.useState('');
  const [city, setCity] = React.useState('');
  const [district, setDistrict] = React.useState('');
  const [fullAddress, setFullAddress] = React.useState('');
  const [postalCode, setPostalCode] = React.useState('');

  // 1. Fetch Addresses
  const {
    data: addresses,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['buyer-addresses'],
    queryFn: async () => addressService.getAddresses(),
  });

  const isQueryError = isError;

  React.useEffect(() => {
    if (isQueryError) {
      toast.error('Layanan alamat offline. Menggunakan data demo lokal.', {
        description: 'Menampilkan data alamat simulasi agar Anda tetap dapat menjelajahi layout.',
        duration: 5000,
      });
    }
  }, [isQueryError]);

  const activeAddresses = isQueryError ? MOCK_ADDRESSES : addresses || MOCK_ADDRESSES;

  // 2. Mutations
  const createMutation = useMutation({
    mutationFn: async (data: Omit<SavedAddress, 'id' | 'user_id' | 'is_default' | 'created_at'>) =>
      addressService.createAddress(data),
    onSuccess: () => {
      toast.success('Alamat berhasil ditambahkan!');
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ['buyer-addresses'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SavedAddress> }) =>
      addressService.updateAddress(id, data),
    onSuccess: () => {
      toast.success('Alamat berhasil diperbarui!');
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ['buyer-addresses'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => addressService.deleteAddress(id),
    onSuccess: () => {
      toast.success('Alamat berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['buyer-addresses'] });
    },
  });

  const defaultMutation = useMutation({
    mutationFn: async (id: string) => addressService.setDefault(id),
    onSuccess: () => {
      toast.success('Alamat utama berhasil diubah!');
      queryClient.invalidateQueries({ queryKey: ['buyer-addresses'] });
    },
  });

  const handleOpenDialog = (address: SavedAddress | null = null) => {
    if (address) {
      setEditingAddress(address);
      setLabel(address.label);
      setRecipientName(address.recipient_name);
      setPhone(address.phone_number);
      setProvince(address.province);
      setCity(address.city);
      setDistrict(address.district);
      setFullAddress(address.full_address);
      setPostalCode(address.postal_code);
    } else {
      setEditingAddress(null);
      setLabel('Rumah');
      setRecipientName('');
      setPhone('');
      setProvince('');
      setCity('');
      setDistrict('');
      setFullAddress('');
      setPostalCode('');
    }
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      label,
      recipient_name: recipientName,
      phone_number: phone,
      province,
      city,
      district,
      full_address: fullAddress,
      postal_code: postalCode,
    };

    if (isQueryError) {
      toast.success(
        editingAddress
          ? 'Alamat berhasil diperbarui! (Simulasi)'
          : 'Alamat baru berhasil ditambahkan! (Simulasi)'
      );
      setIsOpen(false);
      return;
    }

    if (editingAddress) {
      updateMutation.mutate({ id: editingAddress.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: string) => {
    if (isQueryError) {
      toast.success('Alamat berhasil dihapus! (Simulasi)');
      return;
    }
    deleteMutation.mutate(id);
  };

  const handleSetDefault = (id: string) => {
    if (isQueryError) {
      toast.success('Alamat utama berhasil diubah! (Simulasi)');
      return;
    }
    defaultMutation.mutate(id);
  };

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Reconnect Banner */}
      {isQueryError && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800 font-semibold shadow-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 animate-pulse" />
            <p>
              Mode Offline Simulasi: Koneksi ke server alamat terputus. Menampilkan data lokal demo
              agar Anda tetap dapat menjelajahi layout.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-7 cursor-pointer border-amber-300 text-amber-800 bg-white hover:bg-amber-100 font-bold shrink-0 text-[10px]"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            <RefreshCw className={`mr-1 h-3 w-3 ${isRefetching ? 'animate-spin' : ''}`} />
            {isRefetching ? 'Hubungkan...' : 'Coba Hubungkan Kembali'}
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl text-slate-800">
            Alamat Tersimpan
          </h1>
          <p className="text-sm text-slate-500">
            Kelola daftar alamat pengiriman belanja Anda di SmartTani.
          </p>
        </div>
        <Button
          className="font-bold text-xs cursor-pointer bg-green-600 hover:bg-green-700"
          onClick={() => handleOpenDialog(null)}
        >
          <Plus className="mr-2 h-4.5 w-4.5" /> Tambah Alamat Baru
        </Button>
      </div>

      {/* Dialog Form Address */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md bg-white border border-slate-200 rounded-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold text-slate-800">
                {editingAddress ? 'Edit Alamat Pengiriman' : 'Tambah Alamat Pengiriman'}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Masukkan detail lokasi tujuan pengiriman paket belanja Anda secara lengkap.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 text-xs font-semibold text-slate-700">
              <div className="space-y-1">
                <label>Label Alamat (cth: Rumah, Kantor, Toko)</label>
                <Input
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  required
                  className="h-9 focus-visible:ring-green-500 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label>Nama Penerima</label>
                  <Input
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    required
                    className="h-9 focus-visible:ring-green-500 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label>No. Telepon / WhatsApp</label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="h-9 focus-visible:ring-green-500 text-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label>Provinsi</label>
                  <Input
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    required
                    className="h-9 focus-visible:ring-green-500 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label>Kota / Kabupaten</label>
                  <Input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="h-9 focus-visible:ring-green-500 text-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label>Kecamatan</label>
                  <Input
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    required
                    className="h-9 focus-visible:ring-green-500 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label>Kode Pos</label>
                  <Input
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    required
                    className="h-9 focus-visible:ring-green-500 text-xs"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label>Alamat Lengkap (Blok, No. Rumah, Jalan)</label>
                <textarea
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  required
                  className="w-full rounded-md border border-slate-200 p-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-500 min-h-16"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 text-xs font-bold cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                size="sm"
                className="h-9 text-xs font-bold cursor-pointer bg-green-600 hover:bg-green-700"
              >
                Simpan Alamat
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Grid List Address */}
      {isLoading ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <Skeleton className="h-44 w-full rounded-xl animate-pulse" />
          <Skeleton className="h-44 w-full rounded-xl animate-pulse" />
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {activeAddresses.map((addr) => (
            <Card
              key={addr.id}
              className={`border bg-white transition-all shadow-xs flex flex-col justify-between overflow-hidden ${
                addr.is_default ? 'border-green-300 ring-1 ring-green-100' : 'border-slate-200'
              }`}
            >
              <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between gap-4 p-5">
                <div className="flex items-center gap-2">
                  <MapPin
                    className={`h-4.5 w-4.5 ${addr.is_default ? 'text-green-600' : 'text-slate-400'}`}
                  />
                  <CardTitle className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {addr.label}
                  </CardTitle>
                </div>
                {addr.is_default && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-[9px] font-bold text-green-700 border border-green-200">
                    <CheckCircle2 className="h-3 w-3" /> Utama
                  </span>
                )}
              </CardHeader>
              <CardContent className="p-5 space-y-2 text-xs">
                <p className="font-bold text-slate-800">{addr.recipient_name}</p>
                <p className="text-slate-500 font-semibold">{addr.phone_number}</p>
                <p className="text-slate-600 font-medium leading-relaxed">{addr.full_address}</p>
                <p className="text-slate-600 font-medium">
                  {addr.district}, {addr.city}, {addr.province}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">Kode Pos: {addr.postal_code}</p>
              </CardContent>
              <CardFooter className="p-5 pt-3 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center gap-2">
                <div>
                  {!addr.is_default && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-[10px] font-bold text-green-600 hover:text-green-700 hover:bg-green-50 cursor-pointer"
                      onClick={() => handleSetDefault(addr.id)}
                    >
                      Jadikan Utama
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 p-0 cursor-pointer border-slate-200 hover:bg-white text-slate-500 hover:text-slate-800"
                    onClick={() => handleOpenDialog(addr)}
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 p-0 cursor-pointer border-slate-200 hover:bg-white text-rose-500 hover:text-rose-600"
                    onClick={() => handleDelete(addr.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
