'use client';

import { useRouter } from 'next/navigation';
import { showToast } from '@/lib/toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

import { logout } from '@/lib/auth';
import { useAuthStore } from '@/stores/auth';

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const storeUser = useAuthStore((s) => s.user);

  const handleLogout = () => {
    showToast('Anda telah keluar dari sistem.', 'success');
    logout();
  };

  const getSettingsPath = () => {
    const role = storeUser?.role || 'petani';
    switch (role) {
      case 'admin':
        return '/admin/settings';
      case 'petani':
        return '/dashboard/farmer/settings';
      case 'buyer':
        return '/dashboard/buyer/settings';
      case 'investor':
        return '/dashboard/investor/settings';
      case 'distributor':
        return '/dashboard/distributor/settings';
      case 'logistik':
        return '/dashboard/logistic/settings';
      case 'siswa':
        return '/dashboard/student/settings';
      case 'instruktur':
        return '/dashboard/instructor/settings';
      default:
        return '/dashboard/farmer/settings';
    }
  };

  const getFinancePath = () => {
    const role = storeUser?.role || 'petani';
    if (role === 'petani') {
      return '/dashboard/farmer/finance';
    }
    return '/';
  };

  const userInitials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'ST';

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
              <Avatar className="h-8 w-8 rounded-sm after:rounded-sm">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-sm">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-sm after:rounded-sm">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-sm bg-slate-100 text-slate-700 font-bold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => router.push(getSettingsPath())}
                className="cursor-pointer"
              >
                <BadgeCheck />
                Profil & Pengaturan
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(getFinancePath())}
                className="cursor-pointer"
              >
                <CreditCard />
                Keuangan & Saldo
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(getSettingsPath() + '?tab=notifications')}
                className="cursor-pointer"
              >
                <Bell />
                Notifikasi
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer"
            >
              <LogOut />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
