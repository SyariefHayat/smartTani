"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  TrendingUp,
  Briefcase,
  History,
  Activity,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function InvestorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem("smarttani-auth");
    if (!auth) {
      router.push("/login?redirect=/dashboard/investor");
    } else {
      const userData = JSON.parse(auth);
      if (userData.role !== "investor") {
        router.push(`/dashboard/${userData.role === 'petani' ? 'farmer' : userData.role.replace('_', '-')}`);
      } else {
        setUser(userData);
        setLoading(false);
      }
    }
  }, [router]);

  if (loading) return null;

  const stats = [
    { label: "Total Investasi", value: "Rp 25.7M", icon: Briefcase, color: "text-green-600", bg: "bg-green-100" },
    { label: "Total Keuntungan", value: "Rp 2.8M", icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Proyek Aktif", value: "5 Proyek", icon: Activity, color: "text-amber-600", bg: "bg-amber-100" },
    { label: "ROI Rata-rata", value: "12.7%", icon: History, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Selamat Datang, {user?.name || "Investor"}!</h1>
          <p className="text-gray-500">Pantau performa aset dan dampak sosial investasi Anda.</p>
        </div>
        <Button 
          className="bg-[#1A6B2F] hover:bg-[#145224]"
          onClick={() => router.push('/investments')}
        >
          <Plus className="mr-2 h-4 w-4" />
          Investasi Baru
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
            <h2 className="font-bold text-gray-900">Investasi Aktif</h2>
            <button className="text-sm text-[#1A6B2F] font-medium hover:underline">Lihat Semua</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Proyek</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">ROI</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { proyek: "Budidaya Padi Premium", total: "Rp 5.0M", roi: "12,5%", status: "Aktif", statusColor: "bg-green-100 text-green-700" },
                  { proyek: "Greenhouse Hortikultura", total: "Rp 5.0M", roi: "13,8%", status: "Aktif", statusColor: "bg-green-100 text-green-700" },
                  { proyek: "Perkebunan Tebu Modern", total: "Rp 5.0M", roi: "14,2%", status: "Menunggu", statusColor: "bg-yellow-100 text-yellow-700" },
                ].map((inv, i) => (
                  <tr key={i} className="text-sm hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{inv.proyek}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">{inv.total}</td>
                    <td className="px-6 py-4 font-bold text-[#BA7517]">{inv.roi}</td>
                    <td className="px-6 py-4">
                      <Badge className={`${inv.statusColor} shadow-none border-none text-[10px]`}>
                        {inv.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-[#1A6B2F] rounded-xl p-6 text-white flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold mb-2">Dampak Sosial</h2>
            <p className="text-white/80 text-sm leading-relaxed">
              Investasi Anda telah membantu 12 petani lokal meningkatkan taraf hidup mereka melalui pertanian berkelanjutan.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold">12</div>
                <div className="text-[10px] text-white/60">Petani Terbantu</div>
              </div>
              <div>
                <div className="text-2xl font-bold">5.2 Ha</div>
                <div className="text-[10px] text-white/60">Lahan Terkelola</div>
              </div>
            </div>
          </div>
          <Button variant="secondary" className="mt-6 w-full text-[#1A6B2F] font-bold">
            Lihat Laporan Dampak
          </Button>
        </div>
      </div>
    </div>
  );
}
