import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

export type Role = "admin" | "donor" | "recipient" | "analyst";
export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  role: Role;
  location?: string;
};

type AuthContextType = {
  user: User | null;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (u: Omit<User, "id">, password: string) => Promise<User>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = "fb_session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

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

  const api = useMemo<AuthContextType>(() => ({
    user,
    async signIn(email: string, password: string) {
      try {
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'signin', email, password })
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Sign in failed');
        }

        if (data.success && data.user) {
          setUser(data.user);
          return data.user;
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (error) {
        console.error('Sign in error:', error);
        throw error;
      }
    },
    async signUp(u, password) {
      try {
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            action: 'signup', 
            email: u.email, 
            password,
            name: u.name,
            organization: u.organization,
            role: u.role
          })
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Sign up failed');
        }

        if (data.success && data.user) {
          setUser(data.user);
          return data.user;
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (error) {
        console.error('Sign up error:', error);
        throw error;
      }
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

export function dashboardPath(role: Role) {
  switch (role) {
    case "admin": return "/dashboard/admin";
    case "donor": return "/dashboard/donor";
    case "recipient": return "/dashboard/recipient";
    case "analyst": return "/dashboard/analyst";
  }
}
