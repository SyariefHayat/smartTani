"use client"

import * as React from "react"
import Link from "next/link"
import {
  Command,
  LifeBuoy,
  Send,
  Home,
  Package,
  ClipboardList,
  Wallet,
  GraduationCap,
  ShoppingBag,
  Truck
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Petani Smart",
    email: "petani@smarttani.com",
    avatar: "/avatars/farmer.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard/farmer",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Ringkasan",
          url: "/dashboard/farmer",
        },
        {
          title: "Statistik Penjualan",
          url: "#",
        },
      ],
    },
    {
      title: "Produk Saya",
      url: "#",
      icon: Package,
      items: [
        {
          title: "Daftar Produk",
          url: "#",
        },
        {
          title: "Tambah Produk",
          url: "/marketplace",
        },
        {
          title: "Stok & Inventaris",
          url: "#",
        },
      ],
    },
    {
      title: "Pesanan",
      url: "#",
      icon: ClipboardList,
      items: [
        {
          title: "Pesanan Baru",
          url: "#",
        },
        {
          title: "Dalam Pengiriman",
          url: "/logistics",
        },
        {
          title: "Riwayat Pesanan",
          url: "#",
        },
      ],
    },
    {
      title: "Keuangan",
      url: "#",
      icon: Wallet,
      items: [
        {
          title: "Saldo & Penarikan",
          url: "#",
        },
        {
          title: "Laporan Transaksi",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Pusat Bantuan",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Berikan Masukan",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Academy (Pelatihan)",
      url: "/academy",
      icon: GraduationCap,
    },
    {
      name: "Marketplace",
      url: "/marketplace",
      icon: ShoppingBag,
    },
    {
      name: "Logistik",
      url: "/logistics",
      icon: Truck,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Get user from localStorage if available
  const [user, setUser] = React.useState(data.user);

  React.useEffect(() => {
    const auth = localStorage.getItem("smarttani-auth");
    if (auth) {
      const parsedAuth = JSON.parse(auth);
      setUser({
        name: parsedAuth.name || data.user.name,
        email: parsedAuth.email || data.user.email,
        avatar: data.user.avatar,
      });
    }
  }, []);

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[#1A6B2F] text-white">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold text-[#1A6B2F]">Smarttani</span>
                  <span className="truncate text-xs">Petani Dashboard</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
