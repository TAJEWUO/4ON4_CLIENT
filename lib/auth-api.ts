// lib/auth-api.ts

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

async function httpPost(endpoint: string, body: string) {
  try {
    console.log("[auth-api] POST:", `${API_BASE}${endpoint}`);
    
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    
    console.log("[auth-api] Response status:", res.status, res.statusText);
    
    const data = await res.json();
    console.log("[auth-api] Response data:", data);
    
    return { ok: res.ok, data };
  } catch (err) {
    console.error("[auth-api] Error:", err);
    return { ok: false, data: { message: "Network error" } };
  }
}

/**
 * Simple auth API - all calls return { ok, data }
 */

// Register new user with phone and PIN
export async function register(phone: string, pin: string) {
  return httpPost("/api/auth/register", JSON.stringify({ phone, pin }));
}

// Login with phone and PIN
export async function login(phone: string, pin: string) {
  return httpPost("/api/auth/login", JSON.stringify({ phone, pin }));
}

// Refresh access token
export async function refreshToken() {
  return httpPost("/api/auth/refresh", "");
}