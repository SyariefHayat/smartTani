"use client";

import { showToast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Search } from "@/components/sections/dashboard/Search";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

import {
  Bell,
  CircleQuestionMark,
  ChevronDown,
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

  const formatRole = (role: string) => {
    if (!role) return "";
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
      <div className="flex items-center justify-between w-full px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1 rounded-sm cursor-pointer" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4 my-auto"
          />
          <Search />
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 sm:w-auto sm:px-3 sm:gap-1.5"
          >
            <Bell className="size-4" />
            <span className="hidden md:inline text-xs">Notifikasi</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 sm:w-auto sm:px-3 sm:gap-1.5"
          >
            <CircleQuestionMark className="size-4" />
            <span className="hidden md:inline text-xs">Bantuan</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-1.5 sm:px-2 gap-1.5 sm:gap-2 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer"
              >
                <Avatar className="h-6 w-6 rounded-full">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="rounded-full text-[10px]">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col text-left text-xs leading-none">
                  <span className="font-semibold truncate max-w-20">
                    {user?.name}
                  </span>
                </div>
                <ChevronDown className="size-3 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 rounded-xl"
              side="bottom"
              align="end"
              sideOffset={8}
            >
              <DropdownMenuLabel className="p-0 font-normal text-black">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-full">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="rounded-full">
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user?.name}</span>
                    <span className="text-muted-foreground mt-0.5">
                      {formatRole(user?.role)}
                    </span>
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
                className="cursor-pointer text-red-600 focus:text-white focus:bg-red-600"
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
