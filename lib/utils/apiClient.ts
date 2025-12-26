// lib/utils/apiClient.ts
// API client with automatic token refresh on 401 errors

import { refreshToken } from "@/lib/auth-api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

type FetchOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
};

/**
 * Fetch wrapper that automatically refreshes token on 401 and retries once
 */
export async function apiFetch(
  endpoint: string,
  options: FetchOptions = {},
  token?: string,
  retry = true
): Promise<Response> {
  const headers: Record<string, string> = {
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, fetchOptions);

    // If 401 and we haven't retried yet, try to refresh token
    if (response.status === 401 && retry) {
      console.log("[apiClient] Got 401, attempting token refresh");
      
      const { ok, data } = await refreshToken();
      
      if (ok && data?.accessToken) {
        console.log("[apiClient] Token refreshed successfully");
        
        // Update localStorage with new token
        const currentUserId = localStorage.getItem("fouron4_user_id");
        localStorage.setItem("fouron4_access", data.accessToken);
        
        // Dispatch a custom event to notify AuthContext about the token change
        // This ensures all components get the updated token
        if (typeof window !== "undefined" && currentUserId) {
          window.dispatchEvent(new CustomEvent("tokenRefreshed", { 
            detail: { token: data.accessToken, userId: currentUserId } 
          }));
        }
        
        // Retry the original request with new token
        return apiFetch(endpoint, options, data.accessToken, false);
      } else {
        console.log("[apiClient] Token refresh failed, redirecting to login");
        
        // Clear auth and redirect to login
        localStorage.removeItem("fouron4_access");
        localStorage.removeItem("fouron4_user_id");
        localStorage.removeItem("fouron4_refresh");
        
        if (typeof window !== "undefined") {
          window.location.href = "/user/auth/login";
        }
      }
    }

    return response;
  } catch (error) {
    console.error("[apiClient] Fetch error:", error);
    throw error;
  }
}

/**
 * GET request with automatic token refresh
 */
export async function apiGet(endpoint: string, token?: string) {
  try {
    const response = await apiFetch(endpoint, { method: "GET" }, token);
    const data = await response.json();
    // Backend already returns { ok, data } or { ok, message }, so return as-is
    return data;
  } catch (error) {
    console.error("[apiClient] GET error:", error);
    return { ok: false, message: "Network error" };
  }
}

/**
 * POST request with automatic token refresh
 */
export async function apiPost(endpoint: string, body: any, token?: string) {
  try {
    const options: FetchOptions = {
      method: "POST",
    };

    // Handle FormData vs JSON
    if (body instanceof FormData) {
      options.body = body;
    } else {
      options.headers = { "Content-Type": "application/json" };
      options.body = JSON.stringify(body);
    }

    const response = await apiFetch(endpoint, options, token);
    const data = await response.json();
    // Backend already returns { ok, data } or { ok, message }, so return as-is
    return data;
  } catch (error) {
    console.error("[apiClient] POST error:", error);
    return { ok: false, message: "Network error" };
  }
}

/**
 * PUT request with automatic token refresh
 */
export async function apiPut(endpoint: string, body: any, token?: string) {
  try {
    const options: FetchOptions = {
      method: "PUT",
    };

    // Handle FormData vs JSON
    if (body instanceof FormData) {
      options.body = body;
    } else {
      options.headers = { "Content-Type": "application/json" };
      options.body = JSON.stringify(body);
    }

    const response = await apiFetch(endpoint, options, token);
    const data = await response.json();
    // Backend already returns { ok, data } or { ok, message }, so return as-is
    return data;
  } catch (error) {
    console.error("[apiClient] PUT error:", error);
    return { ok: false, message: "Network error" };
  }
}

/**
 * DELETE request with automatic token refresh
 */
export async function apiDelete(endpoint: string, body?: any, token?: string) {
  try {
    const options: FetchOptions = {
      method: "DELETE",
    };

    if (body) {
      options.headers = { "Content-Type": "application/json" };
      options.body = JSON.stringify(body);
    }

    const response = await apiFetch(endpoint, options, token);
    const data = await response.json();
    // Backend already returns { ok, data } or { ok, message }, so return as-is
    return data;
  } catch (error) {
    console.error("[apiClient] DELETE error:", error);
    return { ok: false, message: "Network error" };
  }
}
