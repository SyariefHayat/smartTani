"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Camera,
  Save,
  Lock
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { showToast } from "@/lib/toast";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem("smarttani-auth");
    if (!auth) {
      router.push("/login?redirect=/dashboard/profile");
    } else {
      setUser(JSON.parse(auth));
      setLoading(false);
    }
  }, [router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    localStorage.setItem("smarttani-auth", JSON.stringify(user));
    showToast("Profil berhasil diperbarui!", "success");
  };

  if (loading) return null;

  return (
    <div className="space-y-8">
      <header className="py-2">
        <h1 className="text-2xl font-bold text-gray-900">Pengaturan Profil</h1>
      </header>

      {/* Profile Form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Informasi Pribadi</h2>
        
        <div className="flex flex-col md:flex-row gap-12">
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-32 w-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
              {preview ? (
                <img src={preview} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <User className="h-12 w-12 text-gray-300" />
              )}
              <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="text-white h-6 w-6" />
                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
              </label>
            </div>
            <p className="text-xs text-gray-400 text-center">Format: JPG, PNG. Max 2MB</p>
          </div>

          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input 
                  id="name" 
                  value={user?.name || ""} 
                  onChange={(e) => setUser({...user, name: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user?.email || ""} readOnly className="bg-gray-50 text-gray-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Nomor HP</Label>
                <Input id="phone" placeholder="0812xxxx" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="province">Provinsi</Label>
                <Input id="province" placeholder="Jawa Barat" />
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button className="bg-[#1A6B2F] hover:bg-[#145224]" onClick={handleSaveProfile}>
                <Save className="mr-2 h-4 w-4" />
                Simpan Perubahan
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Keamanan Akun</h2>
        
        <div className="max-w-xl space-y-6">
          <div className="space-y-2">
            <Label htmlFor="old-pass">Password Lama</Label>
            <Input id="old-pass" type="password" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="new-pass">Password Baru</Label>
              <Input id="new-pass" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-pass">Konfirmasi Password Baru</Label>
              <Input id="confirm-pass" type="password" />
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button variant="outline" className="border-[#1A6B2F] text-[#1A6B2F] hover:bg-[#1A6B2F]/5">
              <Lock className="mr-2 h-4 w-4" />
              Ganti Password
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
