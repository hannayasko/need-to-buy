"use client";

import type { User } from "@supabase/supabase-js";
import {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ensureUserRecord } from "./ensure-user-record";
import { supabase } from "@/lib/supabase";

export type AuthStatus = "loading" | "authenticated" | "signed-out";

type AuthResult = {
  error: string | null;
};

type SignUpResult = AuthResult & {
  emailConfirmationRequired: boolean;
};

type AuthContextValue = {
  authStatus: AuthStatus;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<SignUpResult>;
  user: User | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>("loading");
  const syncRunRef = useRef(0);

  const syncAuthenticatedUser = useCallback(async (nextUser: User | null) => {
    const runId = syncRunRef.current + 1;

    syncRunRef.current = runId;

    if (!nextUser) {
      setUser(null);
      setAuthStatus("signed-out");
      return;
    }

    setUser(nextUser);
    setAuthStatus("loading");

    try {
      await ensureUserRecord(nextUser);
    } finally {
      if (syncRunRef.current === runId) {
        setUser(nextUser);
        setAuthStatus("authenticated");
      }
    }
  }, []);

  useEffect(() => {
    let active = true;

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!active) {
        return;
      }

      const sessionUser = error ? null : (data.session?.user ?? null);
      void syncAuthenticatedUser(sessionUser);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void syncAuthenticatedUser(session?.user ?? null);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [syncAuthenticatedUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      authStatus,
      signIn: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        return {
          error: error?.message ?? null,
        };
      },
      signOut: async () => {
        const { error } = await supabase.auth.signOut();

        if (!error) {
          setUser(null);
          setAuthStatus("signed-out");
        }

        return {
          error: error?.message ?? null,
        };
      },
      signUp: async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        return {
          emailConfirmationRequired: !data.session,
          error: error?.message ?? null,
        };
      },
      user,
    }),
    [authStatus, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
