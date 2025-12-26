import authService from "@/api/auth/AuthQueries";
import { UserResponse } from "@/api/auth/type";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export const SessionContext = createContext<{
  user: UserResponse | null;
  setUser: (user: UserResponse | null) => void;
  refreshSession: () => Promise<void>;
  loading?: boolean;
}>({
  user: null,
  setUser: () => {},
  refreshSession: async () => {},
  loading: true,
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshSession = useCallback(async () => {
        try {
        const me = await authService.me();
        setUser(me);
        } catch {
        setUser(null);
        } finally {
        setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshSession().finally(() => setLoading(false));
    }, [refreshSession]);

    const value = useMemo(
    () => ({ user, setUser, refreshSession, loading }),
    [user, refreshSession, loading]
    );

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
