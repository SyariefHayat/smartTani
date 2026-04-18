"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Home, 
  Package, 
  ClipboardList, 
  Wallet, 
  GraduationCap, 
  User, 
  LogOut,
  TrendingUp,
  ShoppingBag,
  Truck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PetaniDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem("smarttani-auth");
    if (!auth) {
      router.push("/login?redirect=/dashboard/petani");
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
    { label: "Beranda Dashboard", icon: Home, active: true, href: "/dashboard/petani" },
    { label: "Produk Saya", icon: Package, active: false, href: "/dashboard/petani" },
    { label: "Pesanan", icon: ClipboardList, active: false, href: "/dashboard/petani" },
    { label: "Transaksi", icon: Wallet, active: false, href: "/dashboard/petani" },
    { label: "Pelatihan Saya", icon: GraduationCap, active: false, href: "/sitani-academy" },
    { label: "Profile", icon: User, active: false, href: "/dashboard/profile" },
  ];

  const stats = [
    { label: "Total Penjualan", value: "Rp 12.450.000", color: "bg-green-500" },
    { label: "Produk Aktif", value: "8 produk", color: "bg-blue-500" },
    { label: "Rating Toko", value: "★ 4.8/5", color: "bg-yellow-500" },
    { label: "Saldo", value: "Rp 3.200.000", color: "bg-purple-500" },
  ];

  const chartData = [
    { month: "Jan", value: 45 },
    { month: "Feb", value: 62 },
    { month: "Mar", value: 38 },
    { month: "Apr", value: 71 },
    { month: "Mei", value: 55 },
    { month: "Jun", value: 83 },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1A3C2A] text-white flex flex-col shrink-0">
        <div className="p-6">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            Smarttani
          </Link>
        </div>

        <div className="px-6 py-4 flex items-center gap-3 border-y border-white/10">
          <div className="h-10 w-10 rounded-full bg-[#1A6B2F] flex items-center justify-center font-bold text-lg">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div>
            <div className="text-sm font-bold">{user?.name || "User"}</div>
            <Badge className="bg-[#BA7517] text-[10px] h-4">Petani</Badge>
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
                Selamat datang, {user?.name || "User"}! 👋
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {new Date().toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Chart */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-8">Grafik Penjualan</h2>
              <div className="flex items-end justify-between h-48 gap-2">
                {chartData.map((data) => (
                  <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-[#1A6B2F] rounded-t-lg transition-all hover:bg-[#145224] group relative"
                      style={{ height: `${(data.value / 100) * 100}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {data.value}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{data.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Aksi Cepat</h2>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { label: "Jual Produk", icon: ShoppingBag, href: "/marketplace", color: "text-[#1A6B2F] bg-[#1A6B2F]/10" },
                  { label: "Lacak Pengiriman", icon: Truck, href: "/logistik", color: "text-[#BA7517] bg-[#BA7517]/10" },
                  { label: "Ikuti Pelatihan", icon: GraduationCap, href: "/sitani-academy", color: "text-blue-600 bg-blue-600/10" },
                ].map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-[#1A6B2F] transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${action.color}`}>
                        <action.icon className="h-5 w-5" />
                      </div>
                      <span className="font-bold text-gray-700 group-hover:text-[#1A6B2F]">{action.label}</span>
                    </div>
                    <TrendingUp className="h-4 w-4 text-gray-300" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Pesanan Terbaru</h2>
              <button className="text-sm font-bold text-[#1A6B2F] hover:underline">Lihat Semua</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <th className="px-6 py-4">No. Pesanan</th>
                    <th className="px-6 py-4">Produk</th>
                    <th className="px-6 py-4">Tanggal</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { id: "#TRX-001", product: "Benih Padi Inpari 32", date: "24 Mei 2024", total: "Rp 475.000", status: "Selesai", statusColor: "bg-green-100 text-green-700" },
                    { id: "#TRX-002", product: "Pupuk NPK Mutiara", date: "23 Mei 2024", total: "Rp 1.050.000", status: "Diproses", statusColor: "bg-yellow-100 text-yellow-700" },
                    { id: "#TRX-003", product: "Pestisida Amistar", date: "22 Mei 2024", total: "Rp 350.000", status: "Dikirim", statusColor: "bg-blue-100 text-blue-700" },
                    { id: "#TRX-004", product: "Alat Semprot Elektrik", date: "21 Mei 2024", total: "Rp 700.000", status: "Selesai", statusColor: "bg-green-100 text-green-700" },
                    { id: "#TRX-005", product: "Pipa Irigasi PVC", date: "20 Mei 2024", total: "Rp 250.000", status: "Selesai", statusColor: "bg-green-100 text-green-700" },
                  ].map((order) => (
                    <tr key={order.id} className="text-sm hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900">{order.id}</td>
                      <td className="px-6 py-4 text-gray-600">{order.product}</td>
                      <td className="px-6 py-4 text-gray-500">{order.date}</td>
                      <td className="px-6 py-4 font-bold text-[#1A6B2F]">{order.total}</td>
                      <td className="px-6 py-4">
                        <Badge className={`${order.statusColor} shadow-none border-none text-[10px]`}>
                          {order.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
