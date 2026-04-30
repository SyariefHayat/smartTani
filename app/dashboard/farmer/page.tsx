"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp,
  ShoppingBag,
  Truck,
  GraduationCap
} from "lucide-react"
import Link from "next/link"

interface User {
  name: string;
  email: string;
}

export default function PetaniDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const auth = localStorage.getItem("smarttani-auth")
    if (!auth) {
      router.push("/login?redirect=/dashboard/farmer")
      return
    }
    
    try {
      const parsedAuth = JSON.parse(auth)
      setUser(parsedAuth)
    } catch (e) {
      console.error("Failed to parse auth", e)
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }, [router])

  if (loading) return null

  const stats = [
    { label: "Total Penjualan", value: "Rp 12.450.000", color: "bg-[#1A6B2F]" },
    { label: "Produk Aktif", value: "8 produk", color: "bg-blue-500" },
    { label: "Rating Toko", value: "★ 4.8/5", color: "bg-[#F5A623]" },
    { label: "Saldo", value: "Rp 3.200.000", color: "bg-purple-500" },
  ]

  const chartData = [
    { month: "Jan", value: 45 },
    { month: "Feb", value: 62 },
    { month: "Mar", value: 38 },
    { month: "Apr", value: 71 },
    { month: "Mei", value: 55 },
    { month: "Jun", value: 83 },
  ]

  const recentOrders = [
    { id: "#TRX-001", product: "Benih Padi Inpari 32", date: "24 Mei 2024", total: "Rp 475.000", status: "Selesai", statusColor: "bg-green-100 text-green-700" },
    { id: "#TRX-002", product: "Pupuk NPK Mutiara", date: "23 Mei 2024", total: "Rp 1.050.000", status: "Diproses", statusColor: "bg-yellow-100 text-yellow-700" },
    { id: "#TRX-003", product: "Pestisida Amistar", date: "22 Mei 2024", total: "Rp 350.000", status: "Dikirim", statusColor: "bg-blue-100 text-blue-700" },
    { id: "#TRX-004", product: "Alat Semprot Elektrik", date: "21 Mei 2024", total: "Rp 700.000", status: "Selesai", statusColor: "bg-green-100 text-green-700" },
    { id: "#TRX-005", product: "Pipa Irigasi PVC", date: "20 Mei 2024", total: "Rp 250.000", status: "Selesai", statusColor: "bg-green-100 text-green-700" },
  ]

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard/farmer">
                    Farmer Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Ringkasan</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-6 p-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Selamat datang, {user?.name || "User"}! 👋
            </h1>
            <p className="text-muted-foreground">
              {new Date().toLocaleDateString('id-ID', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
                <div className="mt-2 text-2xl font-bold">{stat.value}</div>
                <div className={`mt-3 h-1 w-12 rounded-full ${stat.color}`} />
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-7">
            {/* Sales Chart */}
            <div className="col-span-4 rounded-xl border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-6">Grafik Penjualan</h2>
              <div className="flex items-end justify-between h-64 gap-3">
                {chartData.map((data) => (
                  <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-[#1A6B2F] rounded-t-lg transition-all hover:bg-[#145224] group relative"
                      style={{ height: `${(data.value / 100) * 100}%` }}
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1.5 px-2.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                        {data.value}% peningkatan
                      </div>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">{data.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="col-span-3 space-y-4">
              <h2 className="text-lg font-bold">Aksi Cepat</h2>
              <div className="grid gap-4">
                {[
                  { label: "Jual Produk", icon: ShoppingBag, href: "/marketplace", color: "text-[#1A6B2F] bg-[#1A6B2F]/10" },
                  { label: "Lacak Pengiriman", icon: Truck, href: "/logistics", color: "text-[#F5A623] bg-[#F5A623]/10" },
                  { label: "Ikuti Pelatihan", icon: GraduationCap, href: "/academy", color: "text-blue-600 bg-blue-600/10" },
                ].map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="flex items-center justify-between p-4 bg-white rounded-xl border hover:border-[#1A6B2F] hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${action.color}`}>
                        <action.icon className="h-5 w-5" />
                      </div>
                      <span className="font-bold text-gray-700 group-hover:text-[#1A6B2F]">{action.label}</span>
                    </div>
                    <TrendingUp className="h-4 w-4 text-gray-300 group-hover:text-[#1A6B2F]" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-lg font-bold">Pesanan Terbaru</h2>
              <button className="text-sm font-bold text-[#1A6B2F] hover:underline">Lihat Semua</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/50 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    <th className="px-6 py-4">No. Pesanan</th>
                    <th className="px-6 py-4">Produk</th>
                    <th className="px-6 py-4">Tanggal</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="text-sm hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-bold">{order.id}</td>
                      <td className="px-6 py-4 text-muted-foreground">{order.product}</td>
                      <td className="px-6 py-4 text-muted-foreground">{order.date}</td>
                      <td className="px-6 py-4 font-bold text-[#1A6B2F]">{order.total}</td>
                      <td className="px-6 py-4">
                        <Badge className={`${order.statusColor} shadow-none border-none text-[10px] font-bold`}>
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
      </SidebarInset>
    </SidebarProvider>
  )
}
