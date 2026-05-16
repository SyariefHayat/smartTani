export type StoredUser = {
  id?: string | null
  email?: string | null
  full_name?: string | null
  name?: string | null
  role?: string | null
  avatar?: string | null
}

type PersistedAuthState = {
  state?: {
    user?: StoredUser | null
  } | null
  user?: StoredUser | null
}

export function getStoredAuthUser(): StoredUser | null {
  if (typeof window === "undefined") {
    return null
  }

  const rawAuth = window.localStorage.getItem("smarttani-auth")

  if (!rawAuth) {
    return null
  }

  try {
    const parsedAuth = JSON.parse(rawAuth) as PersistedAuthState | StoredUser | null

    if (!parsedAuth || typeof parsedAuth !== "object") {
      return null
    }

    if ("state" in parsedAuth && parsedAuth.state?.user) {
      return parsedAuth.state.user
    }

    if ("user" in parsedAuth && parsedAuth.user) {
      return parsedAuth.user
    }

    return parsedAuth as StoredUser
  } catch {
    return null
  }
}
