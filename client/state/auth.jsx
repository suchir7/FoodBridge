import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

const AuthContext = createContext(undefined);

const SESSION_KEY = "fb_session";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      try { setUser(JSON.parse(raw)); } catch { }
    }
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  }, [user]);

  const value = useMemo(() => ({
    user,
    async signIn(email, password) {
      const user = await api.signIn(email, password);
      setUser(user);
      return user;
    },
    async signUp(u, password) {
      const user = await api.signUp(u.email, password, u.name, u.organization, u.role);
      setUser(user);
      return user;
    },
    signOut() { setUser(null); },
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function dashboardPath(role) {
  switch (role) {
    case "admin": return "/dashboard/admin";
    case "donor": return "/dashboard/donor";
    case "recipient": return "/dashboard/recipient";
    case "analyst": return "/dashboard/analyst";
    default: return "/";
  }
}


