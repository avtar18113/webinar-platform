import { http } from "./http";

export async function apiListWebinars() {
  const res = await http.get("/api/webinars"); // we will create backend route if not exists
  return res.data;
}

export async function apiGetWebinarBySlug(slug: string) {
  const res = await http.get(`/api/webinars/slug/${slug}`);
  return res.data;
}

export async function apiRegisterWebinar(id: string) {
  const res = await http.post(`/api/webinars/${id}/register`);
  return res.data;
}

export async function apiGetLobby(id: string) {
  const res = await http.get(`/api/webinars/${id}/lobby`);
  return res.data;
}

export async function apiJoinWebinar(id: string) {
  const res = await http.post(`/api/webinars/${id}/join`);
  return res.data;
}