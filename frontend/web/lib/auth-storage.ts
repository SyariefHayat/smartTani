export type StoredUser = {
  id?: string | null;
  email?: string | null;
  full_name?: string | null;
  name?: string | null;
  role?: string | null;
  avatar?: string | null;
};

type PersistedAuthState = {
  state?: {
    user?: StoredUser | null;
  } | null;
  user?: StoredUser | null;
};

export function getStoredAuthUser(): StoredUser | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawAuth = window.localStorage.getItem('smarttani-auth');

  if (!rawAuth) {
    return null;
  }

  try {
    const parsedAuth = JSON.parse(rawAuth) as PersistedAuthState | StoredUser | null;

    if (!parsedAuth || typeof parsedAuth !== 'object') {
      return null;
    }

    if ('state' in parsedAuth) {
      return parsedAuth.state?.user || null;
    }

    if ('user' in parsedAuth) {
      return parsedAuth.user || null;
    }

    const rawUser = parsedAuth as StoredUser;
    if (rawUser.id || rawUser.email) {
      return rawUser;
    }

    return null;
  } catch {
    return null;
  }
}
