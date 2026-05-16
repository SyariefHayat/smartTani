"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, 
  Activity, 
  ShieldCheck, 
  TrendingUp,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminPerusahaanDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem("smarttani-auth");
    if (!auth) {
      router.push("/login?redirect=/dashboard/admin-perusahaan");
    } else {
      const userData = JSON.parse(auth);
      if (userData.role !== "admin_perusahaan") {
        router.push(`/dashboard/${userData.role === 'petani' ? 'farmer' : userData.role.replace('_', '-')}`);
      } else {
        setUser(userData);
        setLoading(false);
      }
    }
  }, [router]);

  if (loading) return null;

  const stats = [
    { label: "Total Pengguna", value: "2,540 User", icon: Users, color: "text-green-600", bg: "bg-green-100" },
    { label: "Sistem Health", value: "99.9%", icon: Activity, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Keamanan", value: "Terlindungi", icon: ShieldCheck, color: "text-amber-600", bg: "bg-amber-100" },
    { label: "Total GTV", value: "Rp 12.8M", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Selamat Datang, {user?.name || "Admin Perusahaan"}!</h1>
          <p className="text-gray-500">Monitor seluruh aktivitas platform dan kesehatan sistem.</p>
        </div>
        <Button className="bg-[#1A6B2F] hover:bg-[#145224]">
          <Download className="mr-2 h-4 w-4" />
          Unduh Laporan Bulanan
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
            <h2 className="font-bold text-gray-900">Log Aktivitas Terbaru</h2>
            <button className="text-sm text-[#1A6B2F] font-medium hover:underline">Lihat Semua</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Waktu</th>
                  <th className="px-6 py-4">Pengguna</th>
                  <th className="px-6 py-4">Aktivitas</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { time: "2 menit lalu", user: "Budi (Petani)", action: "Registrasi Lahan Baru", status: "Sukses", color: "bg-green-100 text-green-700" },
                  { time: "15 menit lalu", user: "Siska (Investor)", action: "Investasi Proyek A1", status: "Sukses", color: "bg-green-100 text-green-700" },
                  { time: "1 jam lalu", user: "System", action: "Backup Database", status: "Sukses", color: "bg-green-100 text-green-700" },
                ].map((log, i) => (
                  <tr key={i} className="text-sm hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-600">{log.time}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{log.user}</td>
                    <td className="px-6 py-4 text-gray-600">{log.action}</td>
                    <td className="px-6 py-4">
                      <Badge className={`${log.color} shadow-none border-none text-[10px]`}>
                        {log.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl p-6 text-white flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold mb-2">Pemberitahuan Sistem</h2>
            <p className="text-white/80 text-sm leading-relaxed">
              Pembaruan sistem dijadwalkan pada hari Minggu pukul 02:00 WIB. Pastikan seluruh layanan telah disinkronisasi.
            </p>
          </div>
          <Button variant="secondary" className="mt-6 w-full text-slate-900 font-bold">
            Buka Admin Panel
          </Button>
        </div>
      </div>
    </div>
  );
}
