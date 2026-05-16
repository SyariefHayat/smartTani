'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SearchProvider } from '@/context/search-provider';
import { DashboardHeader } from '@/components/sections/dashboard/nav-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sections/dashboard/app-sidebar';
import { getStoredAuthUser, type StoredUser } from '@/lib/auth-storage';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    setMounted(true);
    const storedUser = getStoredAuthUser();
    setUser(storedUser);
    
    if (!storedUser) {
      router.push('/login?redirect=/dashboard');
    }
  }, [router]);

  if (!mounted || !user) return null;

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
