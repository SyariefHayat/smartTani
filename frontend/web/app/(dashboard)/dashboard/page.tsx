'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { getRoleHomePath } from '@/lib/role-routes';

export default function DashboardRedirectPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    router.replace(getRoleHomePath(user?.role));
  }, [router, user?.role]);

  return (
    <div className="container mx-auto px-4 py-12 text-center text-gray-500">
      Mengarahkan ke dashboard Anda...
    </div>
  );
}
