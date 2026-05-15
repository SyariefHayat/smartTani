import { useAuthStore } from '@/stores/auth';
import Cookies from 'js-cookie';
import { COOKIE_KEYS } from '@/lib/cookies';

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
  Cookies.remove(COOKIE_KEYS.ACCESS_TOKEN);
  Cookies.remove(COOKIE_KEYS.REFRESH_TOKEN);
  Cookies.remove(COOKIE_KEYS.USER_ROLE);

  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};
