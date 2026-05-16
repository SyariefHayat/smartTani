"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Handshake, 
  Package, 
  FileText, 
  TrendingUp,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function MitraBisnisDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem("smarttani-auth");
    if (!auth) {
      router.push("/login?redirect=/dashboard/mitra-bisnis");
    } else {
      const userData = JSON.parse(auth);
      if (userData.role !== "mitra_bisnis") {
        router.push(`/dashboard/${userData.role === 'petani' ? 'farmer' : userData.role.replace('_', '-')}`);
      } else {
        setUser(userData);
        setLoading(false);
      }
    }
  }, [router]);

  if (loading) return null;

  const stats = [
    { label: "Proyek Aktif", value: "8 Proyek", icon: Handshake, color: "text-green-600", bg: "bg-green-100" },
    { label: "Volume Suplai", value: "450 Ton", icon: Package, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Nilai Kontrak", value: "Rp 2.4M", icon: FileText, color: "text-amber-600", bg: "bg-amber-100" },
    { label: "Pertumbuhan", value: "+15.2%", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Selamat Datang, {user?.name || "Mitra Bisnis"}!</h1>
          <p className="text-gray-500">Monitor kerjasama strategis dan rantai pasok Anda.</p>
        </div>
        <Button className="bg-[#1A6B2F] hover:bg-[#145224]">
          <Plus className="mr-2 h-4 w-4" />
          Ajukan Kerjasama Baru
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`${stat.bg} p-3 rounded-lg`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Areas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-1 lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold text-gray-900">Proyek Kerjasama</h2>
            <button className="text-sm text-[#1A6B2F] font-medium hover:underline">Lihat Semua</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Nama Proyek</th>
                  <th className="px-6 py-4">Tipe</th>
                  <th className="px-6 py-4">Progress</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { name: "Suplai Benih Unggul Jatim", type: "Rantai Pasok", progress: "85%", status: "Berjalan", color: "bg-green-100 text-green-700" },
                  { name: "Digitalisasi Lahan Lamongan", type: "Teknologi", progress: "40%", status: "Implementasi", color: "bg-blue-100 text-blue-700" },
                  { name: "Ekspor Beras Organik", type: "Offtaker", progress: "10%", status: "Persiapan", color: "bg-amber-100 text-amber-700" },
                ].map((project, i) => (
                  <tr key={i} className="text-sm hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{project.name}</td>
                    <td className="px-6 py-4 text-gray-600">{project.type}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{project.progress}</td>
                    <td className="px-6 py-4">
                      <Badge className={`${project.color} shadow-none border-none text-[10px]`}>
                        {project.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-[#1A3C2A] rounded-xl p-6 text-white flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold mb-2">Update Kualitas</h2>
            <p className="text-white/80 text-sm leading-relaxed">
              Laporan QC terbaru menunjukkan peningkatan standar kualitas di Klaster Lamongan sebesar 5% dibandingkan bulan lalu.
            </p>
          </div>
          <Button variant="secondary" className="mt-6 w-full text-[#1A3C2A] font-bold">
            Buka Laporan QC
          </Button>
        </div>
      </div>
    </div>
  );
}
