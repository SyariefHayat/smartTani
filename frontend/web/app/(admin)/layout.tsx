'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SearchProvider } from '@/context/search-provider';
import { DashboardHeader } from '@/components/sections/dashboard/nav-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sections/dashboard/app-sidebar';
import { getStoredAuthUser, type StoredUser } from '@/lib/auth-storage';
import { getRoleHomePath } from '@/lib/role-routes';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<StoredUser | null>(() => {
    if (typeof window !== 'undefined') {
      return getStoredAuthUser();
    }
    return null;
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);

    if (!user) {
      router.push('/login?redirect=/admin');
    } else if (user.role !== 'admin') {
      router.push(getRoleHomePath(user.role));
    }
  }, [router, user]);

  if (!mounted || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
          <p className="text-xs font-semibold text-slate-500">
            Memverifikasi Hak Akses Administrator SmartTani...
          </p>
        </div>
      </div>
    );
  }

  return (
    <SearchProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <DashboardHeader user={user} />
          <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </SearchProvider>
  );
}
