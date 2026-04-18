"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Briefcase, 
  BarChart3, 
  History, 
  FileText, 
  User, 
  LogOut,
  TrendingUp,
  Plus
} from "lucide-react";
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
      setUser(JSON.parse(auth));
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("smarttani-auth");
    router.push("/");
  };

  if (loading) return null;

  const sidebarMenu = [
    { label: "Portfolio", icon: Briefcase, active: true, href: "/dashboard/investor" },
    { label: "Proyek Aktif", icon: BarChart3, active: false, href: "/dashboard/investor" },
    { label: "Riwayat Investasi", icon: History, active: false, href: "/dashboard/investor" },
    { label: "Laporan", icon: FileText, active: false, href: "/dashboard/investor" },
    { label: "Profile", icon: User, active: false, href: "/dashboard/profile" },
  ];

  const stats = [
    { label: "Total Investasi", value: "Rp 25.750.000", color: "bg-[#1A6B2F]" },
    { label: "Total Keuntungan", value: "Rp 2.887.500", color: "bg-blue-600" },
    { label: "Proyek Aktif", value: "5", color: "bg-[#BA7517]" },
    { label: "Imbal Hasil Rata-rata", value: "12,7%", color: "bg-purple-600" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1A3C2A] text-white flex flex-col shrink-0">
        <div className="p-6">
          <Link href="/" className="text-2xl font-bold tracking-tight text-white hover:text-white/80">
            Smarttani
          </Link>
        </div>

        <div className="px-6 py-4 flex items-center gap-3 border-y border-white/10">
          <div className="h-10 w-10 rounded-full bg-[#BA7517] flex items-center justify-center font-bold text-lg">
            {user?.name?.charAt(0) || "I"}
          </div>
          <div>
            <div className="text-sm font-bold">{user?.name || "Investor"}</div>
            <Badge className="bg-blue-600 text-[10px] h-4">Investor</Badge>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {sidebarMenu.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                item.active ? "bg-[#1A6B2F] text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Portfolio Investasi, {user?.name || "Investor"}
              </h1>
              <p className="text-sm text-gray-500 mt-1">Pantau performa aset Anda secara real-time.</p>
            </div>
            <Button 
              className="bg-[#1A6B2F] hover:bg-[#145224]"
              onClick={() => router.push('/investasi')}
            >
              <Plus className="mr-2 h-4 w-4" />
              Investasi Baru
            </Button>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="text-sm text-gray-500 mb-2">{stat.label}</div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className={`mt-3 h-1 w-12 rounded-full ${stat.color}`} />
              </div>
            ))}
          </div>

          {/* Investment Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Investasi Aktif</h2>
              <button className="text-sm font-bold text-[#1A6B2F] hover:underline">Lihat Semua</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <th className="px-6 py-4">Proyek</th>
                    <th className="px-6 py-4">Tanggal Investasi</th>
                    <th className="px-6 py-4">Total Investasi</th>
                    <th className="px-6 py-4">Imbal Hasil</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { proyek: "Budidaya Padi Premium", date: "15 Mei 2024", total: "Rp 5.000.000", roi: "12,5%", status: "Aktif", statusColor: "bg-green-100 text-green-700" },
                    { proyek: "Greenhouse Hortikultura", date: "20 Mei 2024", total: "Rp 5.000.000", roi: "13,8%", status: "Aktif", statusColor: "bg-green-100 text-green-700" },
                    { proyek: "Perkebunan Tebu Modern", date: "10 Juni 2024", total: "Rp 5.000.000", roi: "14,2%", status: "Menunggu", statusColor: "bg-yellow-100 text-yellow-700" },
                  ].map((inv, i) => (
                    <tr key={i} className="text-sm hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{inv.proyek}</div>
                        <div className="text-[10px] text-gray-400">ID: PRJ-00{i+1}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{inv.date}</td>
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

          {/* Impact Analysis */}
          <div className="bg-[#1A6B2F] rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10 max-w-xl">
              <h2 className="text-2xl font-bold mb-4">Dampak Sosial Investasi Anda</h2>
              <p className="text-white/80 leading-relaxed">
                Investasi Anda telah membantu 12 petani lokal untuk mendapatkan akses modal yang lebih adil 
                dan meningkatkan taraf hidup mereka melalui pertanian berkelanjutan.
              </p>
              <div className="mt-8 flex gap-8">
                <div>
                  <div className="text-3xl font-bold">12</div>
                  <div className="text-xs text-white/60 mt-1">Petani Terbantu</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">5.2 Ha</div>
                  <div className="text-xs text-white/60 mt-1">Lahan Terkelola</div>
                </div>
              </div>
            </div>
            <div className="absolute top-1/2 right-8 -translate-y-1/2 opacity-10">
              <TrendingUp size={200} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const Button = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-bold transition-all hover:scale-105 active:scale-95 ${className}`}
  >
    {children}
  </button>
);
