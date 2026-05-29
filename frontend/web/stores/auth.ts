import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

interface NotificationPreferences {
  email_new_order: boolean;
  email_payment: boolean;
  push_notification: boolean;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  notificationPreferences: NotificationPreferences;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  updateAccessToken: (accessToken: string) => void;
  updateNotificationPreferences: (prefs: Partial<NotificationPreferences>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      notificationPreferences: {
        email_new_order: true,
        email_payment: true,
        push_notification: true,
      },
      setAuth: (user, accessToken, refreshToken) => set({ user, accessToken, refreshToken }),
      clearAuth: () => set({ user: null, accessToken: null, refreshToken: null }),
      updateAccessToken: (accessToken) => set({ accessToken }),
      updateNotificationPreferences: (prefs) =>
        set((state) => ({
          notificationPreferences: {
            ...state.notificationPreferences,
            ...prefs,
          },
        })),
    }),
    {
      name: 'smarttani-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
