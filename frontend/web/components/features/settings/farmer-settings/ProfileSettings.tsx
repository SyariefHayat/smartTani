'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';

export function ProfileSettings() {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle>Profil Petani</CardTitle>
        <CardDescription>Perbarui informasi pribadi dan foto profil Anda.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/images/dashboard/dashboard-logo.png" />
              <AvatarFallback>ST</AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="outline"
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-white"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold">Foto Profil</h4>
            <p className="text-xs text-muted-foreground">JPG, GIF atau PNG. Maksimal 2MB.</p>
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="outline">
                Ganti Foto
              </Button>
              <Button size="sm" variant="ghost" className="text-destructive">
                Hapus
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input id="name" defaultValue="Syarief Hayat" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Alamat Email</Label>
            <Input id="email" defaultValue="syarief@smarttani.com" disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Nomor Telepon</Label>
            <Input id="phone" defaultValue="081234567890" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ktp">Nomor KTP (NIK)</Label>
            <Input id="ktp" defaultValue="3512XXXXXXXXXXXX" disabled />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline">Batalkan</Button>
          <Button className="bg-slate-900 text-white hover:bg-slate-800">Simpan Perubahan</Button>
        </div>
      </CardContent>
    </Card>
  );
}
