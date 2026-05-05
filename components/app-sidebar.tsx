"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  Leaf,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { 
  FARMER_DASHBOARD_NAV, 
  INVESTOR_DASHBOARD_NAV, 
  DISTRIBUTOR_DASHBOARD_NAV,
  MITRA_BISNIS_DASHBOARD_NAV,
  ADMIN_PERUSAHAAN_DASHBOARD_NAV,
  ACADEMY_DASHBOARD_NAV,
  SECONDARY_NAV 
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
        return FARMER_DASHBOARD_NAV; // Default to farmer if role unknown
    }
  };

  const navMain = getNavMain();
  
  const userData = {
    name: user?.name || "User",
    email: user?.email || "",
    avatar: "/avatars/user.jpg",
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[#1A6B2F] text-white">
                  <Leaf className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold text-[#1A6B2F]">Smart Tani</span>
                  <span className="truncate text-xs text-muted-foreground">Digitalizing Agriculture</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={SECONDARY_NAV} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
