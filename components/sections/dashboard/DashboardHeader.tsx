"use client";

import { showToast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Search } from "@/components/sections/dashboard/Search";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  Bell,
  CircleQuestionMark,
  ChevronsUpDown,
  Sparkles,
  BadgeCheck,
  CreditCard,
  LogOut,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DashboardHeader({ user }: { user: any }) {
  const router = useRouter();
  const { isMobile } = useSidebar();

  const handleLogout = () => {
    localStorage.removeItem("smarttani-auth");
    window.dispatchEvent(new Event("storage"));
    showToast("Anda telah keluar dari sistem.", "success");
    router.push("/login");
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center justify-between w-full px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1 rounded-sm cursor-pointer" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4 my-auto"
          />
          <Search />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Bell /> Notifikasi
          </Button>
          <Button variant="ghost" size="sm">
            <CircleQuestionMark /> Bantuan
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-white cursor-pointer"
              >
                <Avatar className="h-8 w-8 rounded-sm after:rounded-sm">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="rounded-sm">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.name}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal text-black">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-sm after:rounded-sm">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="rounded-sm">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user?.name}</span>
                    <span className="truncate text-xs">{user?.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Sparkles />
                  Upgrade to Pro
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <BadgeCheck />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
