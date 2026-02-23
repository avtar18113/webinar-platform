import React, { createContext, useContext, useMemo, useState } from "react";
import { apiLogin, apiLogout, apiRegister } from "../api/auth";

type User = { id: string; name: string; email: string; role: string };
type AuthCtx = {
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string, rememberMe: boolean, savePassword: boolean) => Promise<void>;
  register: (name: string, email: string, password: string, mobile?: string) => Promise<void>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as User) : null;
  });
  const [accessToken, setAccessToken] = useState<string | null>(() => localStorage.getItem("accessToken"));

  const persist = (u: User, token: string) => {
    setUser(u);
    setAccessToken(token);
    localStorage.setItem("user", JSON.stringify(u));
    localStorage.setItem("accessToken", token);
  };

  const login: AuthCtx["login"] = async (email, password, rememberMe, savePassword) => {
    const data = await apiLogin({ email, password, rememberMe });
    if (!data?.ok) throw new Error(data?.message || "Login failed");
    persist(data.user, data.accessToken);

    // Save password feature (optional)
    if (savePassword) {
      localStorage.setItem("savedEmail", email);
      localStorage.setItem("savedPassword", password);
    } else {
      localStorage.removeItem("savedEmail");
      localStorage.removeItem("savedPassword");
    }
  };

  const register: AuthCtx["register"] = async (name, email, password, mobile) => {
    const data = await apiRegister({ name, email, password, mobile });
    if (!data?.ok) throw new Error(data?.message || "Register failed");
  };

  const logout: AuthCtx["logout"] = async () => {
    try {
      await apiLogout();
    } finally {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("sessionId");
    }
  };

  const value = useMemo(() => ({ user, accessToken, login, register, logout }), [user, accessToken]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used inside AuthProvider");
  return v;
}