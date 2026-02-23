// apps/web/src/api/http.ts
import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // for refresh-cookie later
});

function isPublicEndpoint(method: string, url: string) {
  const m = method.toLowerCase();

  // ✅ Public webinar browsing endpoints
  const isPublicWebinars =
    m === "get" &&
    (url === "/api/webinars" || url.startsWith("/api/webinars/slug/"));

  // ✅ Public auth endpoints
  const isPublicAuth =
    url.startsWith("/api/auth/login") ||
    url.startsWith("/api/auth/register") ||
    url.startsWith("/api/auth/refresh");

  // ✅ Health check public
  const isHealth = url.startsWith("/api/health");

  return isPublicWebinars || isPublicAuth || isHealth;
}

function extractWebinarId(url: string) {
  // matches: /api/webinars/:id/lobby  OR /api/webinars/:id/join etc.
  const match = url.match(/^\/api\/webinars\/([^/]+)(\/|$)/);
  return match?.[1] || null;
}

http.interceptors.request.use((config) => {
  const url = config.url || "";
  const method = (config.method || "get").toLowerCase();

  // 1) Authorization header (skip for public endpoints)
  const token = localStorage.getItem("accessToken");
  const isPublic = isPublicEndpoint(method, url);

  if (token && !isPublic) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  // 2) X-Session-Id header (only if webinarId present)
  const webinarId = extractWebinarId(url);
  if (webinarId) {
    const sessionId = localStorage.getItem(`sessionId:${webinarId}`);
    if (sessionId) {
      config.headers = config.headers || {};
      config.headers["X-Session-Id"] = sessionId;
    }
  }

  return config;
});