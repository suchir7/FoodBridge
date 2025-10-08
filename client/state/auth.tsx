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

const USERS_KEY = "fb_users";
const SESSION_KEY = "fb_session";

function readUsers(): User[] {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as User[]; } catch { return []; }
}

function writeUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

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
    async signIn(email: string) {
      const users = readUsers();
      const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!found) throw new Error("Account not found");
      setUser(found);
      return found;
    },
    async signUp(u, _password) {
      const users = readUsers();
      if (users.some((x) => x.email.toLowerCase() === u.email.toLowerCase())) {
        throw new Error("Email already registered");
      }
      const created: User = { id: crypto.randomUUID(), ...u };
      users.push(created);
      writeUsers(users);
      setUser(created);
      return created;
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
