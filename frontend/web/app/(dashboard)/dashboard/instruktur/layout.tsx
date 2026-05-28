'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { getStoredAuthUser } from '@/lib/auth-storage';
import { getRoleHomePath } from '@/lib/role-routes';

export default function InstrukturLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = React.useState(false);

  React.useEffect(() => {
    const user = getStoredAuthUser();
    if (!user) {
      router.push('/login');
    } else if (!['instruktur', 'admin'].includes(user.role || '')) {
      router.push(getRoleHomePath(user.role || ''));
    } else {
      setTimeout(() => {
        setAuthorized(true);
      }, 0);
    }
  }, [router]);

  if (!authorized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
          <p className="text-xs font-semibold text-slate-500">
            Memverifikasi Hak Akses Instruktur SiTani Academy...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
