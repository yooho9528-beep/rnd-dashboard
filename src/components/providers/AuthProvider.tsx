"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onIdTokenChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import type { RoleCode } from "@/lib/roles";

interface AuthState {
  user: User | null;
  roles: RoleCode[];
  loading: boolean;
}

const AuthContext = createContext<AuthState>({ user: null, roles: [], loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, roles: [], loading: true });

  useEffect(() => {
    return onIdTokenChanged(auth, async (user) => {
      if (!user) {
        setState({ user: null, roles: [], loading: false });
        return;
      }
      const tokenResult = await user.getIdTokenResult();
      const roles = (tokenResult.claims.roles as RoleCode[] | undefined) ?? [];
      setState({ user, roles, loading: false });
    });
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
