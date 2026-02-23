import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // needed for refresh-token cookie later
});

// ✅ Single interceptor only (no duplicate)
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  const sessionId = localStorage.getItem("sessionId");

  const url = config.url || "";

  // ✅ Public endpoints: don't attach Authorization (avoids preflight CORS)
  const isPublic =
    url.startsWith("/api/webinars") || // public listing + details
    url.startsWith("/api/health") ||
    url.startsWith("/api/auth/login") ||
    url.startsWith("/api/auth/register") ||
    url.startsWith("/api/auth/refresh"); // if you add refresh later

  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (sessionId) {
    config.headers["X-Session-Id"] = sessionId;
  }

  return config;
});