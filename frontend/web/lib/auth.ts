import { useAuthStore } from '@/stores/auth';
import { COOKIE_KEYS, removeCookie } from '@/lib/cookies';

/**
 * Hook or helper to check authentication status.
 * Can be expanded for server-side logic if using cookies.
 */
export const isAuthenticated = () => {
  return !!useAuthStore.getState().accessToken;
};

export const getUserRole = () => {
  return useAuthStore.getState().user?.role;
};

export const logout = () => {
  useAuthStore.getState().clearAuth();

  // Clear cookies
  removeCookie(COOKIE_KEYS.ACCESS_TOKEN);
  removeCookie(COOKIE_KEYS.REFRESH_TOKEN);
  removeCookie(COOKIE_KEYS.USER_ROLE);

  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};
