'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/auth';
import { logout } from '@/lib/auth';
import { getRoleHomePath } from '@/lib/role-routes';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const user = useAuthStore((state) => state.user);
  const dashboardHref = getRoleHomePath(user?.role);

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-green-600">
          SmartTani
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/marketplace" className="text-sm font-medium hover:text-green-600">
            Marketplace
          </Link>
          <Link href="/proposals" className="text-sm font-medium hover:text-green-600">
            Investasi
          </Link>
          {user?.role === 'investor' && (
              <Link href="/portfolio" className="text-sm font-medium hover:text-green-600">
                Portofolio
              </Link>
          )}
          {user ? (
            <>
              <Link href={dashboardHref} className="text-sm font-medium hover:text-green-600">
                Dashboard
              </Link>
              <span className="text-sm text-gray-500">Halo, {user.full_name}</span>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">Daftar</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
