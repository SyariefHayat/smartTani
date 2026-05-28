export type AppRole =
  | 'admin'
  | 'petani'
  | 'buyer'
  | 'investor'
  | 'logistik'
  | 'distributor'
  | 'siswa'
  | 'instruktur';

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
      return '/dashboard/distributor';
    case 'siswa':
      return '/dashboard/siswa';
    case 'instruktur':
      return '/dashboard/instruktur';
    default:
      return '/marketplace';
  }
}
