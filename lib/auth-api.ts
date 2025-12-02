// lib/auth-api.ts

import { BASE_URL } from "./api";

// Small helper for POST JSON auth requests (login, register, verify, reset)
export async function postAuth(path: string, body: any) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, data };
  } catch (err) {
    console.error("Auth POST error:", err);
    return { ok: false, data: { message: "Network error" } };
  }
}
