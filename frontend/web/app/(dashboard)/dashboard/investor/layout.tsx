'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { getStoredAuthUser } from '@/lib/auth-storage';
import { getRoleHomePath } from '@/lib/role-routes';

export default function InvestorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = React.useState(false);

  React.useEffect(() => {
    const user = getStoredAuthUser();
    if (!user) {
      router.push('/login?redirect=/dashboard/investor');
      return;
    }

    if (user.role !== 'investor') {
      router.push(getRoleHomePath(user.role));
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAuthorized(true);
  }, [router]);

  if (!authorized) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
