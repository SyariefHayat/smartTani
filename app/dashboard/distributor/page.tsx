"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { 
  Package, 
  Store, 
  Truck, 
  TrendingUp,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function DistributorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem("smarttani-auth");
    if (!auth) {
      router.push("/login?redirect=/dashboard/distributor");
    } else {
      const userData = JSON.parse(auth);
      if (userData.role !== "distributor") {
        router.push(`/dashboard/${userData.role === 'petani' ? 'farmer' : userData.role.replace('_', '-')}`);
      } else {
        setUser(userData);
        setLoading(false);
      }
    }
  }, [router]);

  if (loading) return null;

  const stats = [
    { label: "Total Stok", value: "1,240 Item", icon: Package, color: "text-green-600", bg: "bg-green-100" },
    { label: "Pesanan Baru", value: "18 Pesanan", icon: Store, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Pendapatan Bulan Ini", value: "Rp 125.4M", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-100" },
    { label: "Pengiriman Aktif", value: "12 Jalur", icon: Truck, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Ringkasan Bisnis</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Selamat Datang, {user?.name || "Distributor"}!</h1>
              <p className="text-gray-500">Kelola stok produk dan pantau alur distribusi Anda.</p>
            </div>
            <Button className="bg-[#1A6B2F] hover:bg-[#145224]">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Stok Baru
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
                <h2 className="font-bold text-gray-900">Pesanan Terbaru</h2>
                <button className="text-sm text-[#1A6B2F] font-medium hover:underline">Lihat Semua</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <th className="px-6 py-4">ID Pesanan</th>
                      <th className="px-6 py-4">Pelanggan</th>
                      <th className="px-6 py-4">Total</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { id: "ORD-7721", customer: "Toko Tani Subur", total: "Rp 12.500.000", status: "Diproses", color: "bg-blue-100 text-blue-700" },
                      { id: "ORD-7722", customer: "Koperasi Unit Desa", total: "Rp 45.000.000", status: "Dikirim", color: "bg-amber-100 text-amber-700" },
                      { id: "ORD-7723", customer: "UD Tani Jaya", total: "Rp 8.200.000", status: "Selesai", color: "bg-green-100 text-green-700" },
                    ].map((order, i) => (
                      <tr key={i} className="text-sm hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900">{order.id}</td>
                        <td className="px-6 py-4 text-gray-600">{order.customer}</td>
                        <td className="px-6 py-4 font-bold text-gray-900">{order.total}</td>
                        <td className="px-6 py-4">
                          <Badge className={`${order.color} shadow-none border-none text-[10px]`}>
                            {order.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-[#BA7517] rounded-xl p-6 text-white flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold mb-2">Informasi Stok</h2>
                <p className="text-white/80 text-sm leading-relaxed">
                  Stok Pupuk NPK di Gudang Utama menipis (Tersisa 50 bag). Segera lakukan pemesanan ulang ke produsen.
                </p>
              </div>
              <Button variant="secondary" className="mt-6 w-full text-[#BA7517] font-bold">
                Cek Inventaris
              </Button>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
