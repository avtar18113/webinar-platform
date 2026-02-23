import { http } from "./http";

export async function adminGoLive(webinarId: string) {
  const res = await http.post(`/api/admin/live/${webinarId}/go-live`);
  return res.data;
}

export async function adminEndLive(webinarId: string) {
  const res = await http.post(`/api/admin/live/${webinarId}/end-live`);
  return res.data;
}