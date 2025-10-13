import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(undefined);

const SESSION_KEY = "fb_session";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      try { setUser(JSON.parse(raw)); } catch {}
    }
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  }, [user]);

  const api = useMemo(() => ({
    user,
    async signIn(email, password) {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'signin', email, password })
      });
      const data = await response.json();
      if (!response.ok || !data?.success || !data?.user) throw new Error(data?.error || 'Sign in failed');
      setUser(data.user);
      return data.user;
    },
    async signUp(u, password) {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'signup', email: u.email, password, name: u.name, organization: u.organization, role: u.role })
      });
      const data = await response.json();
      if (!response.ok || !data?.success || !data?.user) throw new Error(data?.error || 'Sign up failed');
      setUser(data.user);
      return data.user;
    },
    signOut() { setUser(null); },
  }), [user]);

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
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


