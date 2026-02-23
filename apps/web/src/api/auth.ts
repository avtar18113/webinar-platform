import { http } from "./http";

export type LoginPayload = { email: string; password: string; rememberMe?: boolean };
export type RegisterPayload = { name: string; email: string; password: string; mobile?: string };

export async function apiHealth() {
  const res = await http.get("/api/health");
  return res.data;
}

export async function apiRegister(payload: RegisterPayload) {
  const res = await http.post("/api/auth/register", payload);
  return res.data;
}

export async function apiLogin(payload: LoginPayload) {
  const res = await http.post("/api/auth/login", payload);
  return res.data;
}

export async function apiLogout() {
  const res = await http.post("/api/auth/logout");
  return res.data;
}