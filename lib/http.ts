//github.com/TAJEWUO/4ON4_CLIENT/blob/main/lib/http.ts
// lib/http.ts
// Central HTTP helper — single source of truth for base URL + auth header

export const API_BASE = (process.env.NEXT_PUBLIC_BACKEND_URL || "https://fouron4-backend-1.onrender.com").replace(/\/+$/, "");

async function parseJsonSafe(res: Response) {
  const text = await res.text().catch(() => "");
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text || null;
  }
}

async function httpRequest(path: string, opts: RequestInit = {}) {
  const url = `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;

  const headers = new Headers(opts.headers || {});
  // If we have token in localStorage, attach it
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("fouron4_access");
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  // If body is FormData, do NOT set Content-Type so browser adds boundary
  const body = opts.body as any;
  if (!(body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const finalOpts: RequestInit = {
    ...opts,
    headers,
    mode: "cors",
  };

  let res: Response;
  try {
    res = await fetch(url, finalOpts);
  } catch (err: any) {
    console.error("[httpRequest] Network error:", err);
    console.error("[httpRequest] URL:", url);
    throw new Error(err?.message || "Network error - please check your connection");
  }

  const data = await parseJsonSafe(res);
  if (!res.ok) {
    const message = (data && (data.message || data.error)) || (typeof data === "string" ? data : "Request failed");
    console.error("[httpRequest] HTTP error:", res.status, message);
    const e: any = new Error(message);
    e.status = res.status;
    e.payload = data;
    throw e;
  }

  return data;
}

export const httpGet = (path: string) => httpRequest(path, { method: "GET" });
export const httpPost = (path: string, body?: any) => httpRequest(path, { method: "POST", body });
export const httpPut = (path: string, body?: any) => httpRequest(path, { method: "PUT", body });
export const httpDelete = (path: string) => httpRequest(path, { method: "DELETE" });