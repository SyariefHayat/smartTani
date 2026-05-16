'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MapPin } from 'lucide-react';

export function FarmSettings() {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle>Informasi Usaha Tani</CardTitle>
        <CardDescription>Atur nama usaha dan lokasi operasional pertanian Anda.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="farm-name">Nama Kelompok Tani / Usaha</Label>
            <Input id="farm-name" defaultValue="Kelompok Tani Makmur Sentosa" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="farm-desc">Deskripsi Usaha</Label>
            <Textarea
              id="farm-desc"
              placeholder="Ceritakan sedikit tentang pertanian Anda..."
              defaultValue="Fokus pada budidaya padi unggul dan jagung hibrida di wilayah Lamongan Jawa Timur."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="province">Provinsi</Label>
              <Input id="province" defaultValue="Jawa Timur" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Kabupaten / Kota</Label>
              <Input id="city" defaultValue="Lamongan" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Alamat Lengkap Kantor/Gudang</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="address"
                className="pl-9"
                defaultValue="Jl. Raya Karangbinangun KM 1 No. 42, Karangbinangun, Lamongan 62293"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline">Batalkan</Button>
          <Button className="bg-slate-900 text-white hover:bg-slate-800">
            Simpan Detail Lahan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
