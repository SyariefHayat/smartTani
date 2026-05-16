export type AppRole =
  | 'admin'
  | 'petani'
  | 'buyer'
  | 'investor'
  | 'logistik'
  | 'distributor';

export function getRoleHomePath(role?: string | null): string {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'petani':
      return '/dashboard/farmer';
    case 'buyer':
      return '/orders';
    case 'investor':
      return '/portfolio';
    case 'logistik':
      return '/shipments';
    case 'distributor':
      return '/marketplace';
    default:
      return '/marketplace';
  }
}
