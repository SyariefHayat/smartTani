"use client";

import Image from "next/image";
import * as React from "react";
import { useEffect, useState } from "react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  FARMER_DASHBOARD_NAV,
  ACADEMY_DASHBOARD_NAV,
  INVESTOR_DASHBOARD_NAV,
  DISTRIBUTOR_DASHBOARD_NAV,
  MITRA_BISNIS_DASHBOARD_NAV,
  ADMIN_PERUSAHAAN_DASHBOARD_NAV,
} from "@/constants/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const auth = localStorage.getItem("smarttani-auth");
    if (auth) {
      setUser(JSON.parse(auth));
    }
  }, []);

  const getNavMain = () => {
    switch (user?.role) {
      case "petani":
        return FARMER_DASHBOARD_NAV;
      case "investor":
        return INVESTOR_DASHBOARD_NAV;
      case "distributor":
        return DISTRIBUTOR_DASHBOARD_NAV;
      case "mitra_bisnis":
        return MITRA_BISNIS_DASHBOARD_NAV;
      case "admin_perusahaan":
        return ADMIN_PERUSAHAAN_DASHBOARD_NAV;
      case "academy":
        return ACADEMY_DASHBOARD_NAV;
      default:
        return FARMER_DASHBOARD_NAV;
    }
  };

  const navMain = getNavMain();

  const userData = {
    name: user?.name || "User",
    email: user?.email || "",
    avatar: "/avatars/user.jpg",
  };

  return (
    <Sidebar collapsible="icon" {...props} className="text-white">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <a href="/" className="flex items-center justify-center px-2 py-3">
              <Image
                src="/images/home/dashboard-logo.png"
                alt="SmartTani Logo"
                width={200}
                height={102}
                className="w-full h-auto object-contain max-w-45"
              />
            </a>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
