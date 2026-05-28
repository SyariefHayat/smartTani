export type AppRole = 'admin' | 'petani' | 'buyer' | 'investor' | 'logistik' | 'distributor';

export function getRoleHomePath(role?: string | null): string {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'petani':
      return '/dashboard/farmer';
    case 'buyer':
      return '/dashboard/buyer';
    case 'investor':
      return '/dashboard/investor';
    case 'logistik':
      return '/dashboard/logistik';
    case 'distributor':
      return '/marketplace';
    default:
      return '/marketplace';
  }
}
