// lib/auth-api.ts

import { BASE_URL } from "./api";

// Small helper for JSON POST requests
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

// =============================
// AUTH FLOWS (CORRECT ROUTES)
// =============================

// 1) Start registration — send OTP
export function startRegister(email: string) {
  return postAuth("/api/auth/register-start", { email });
}

// 2) Verify OTP
export function verifyEmailCode(email: string, code: string) {
  return postAuth("/api/auth/verify-email-code", { email, code });
}

// 3) Complete registration (phone + pin)
export function completeRegister(payload: any) {
  return postAuth("/api/auth/register-complete", payload);
}

// 4) Login
export function login(phone: string, pin: string) {
  return postAuth("/api/auth/login", { phone, password: pin });
}

// 5) Start reset-pin
export function forgotPin(email: string) {
  return postAuth("/api/auth/reset-start", { email });
}

// 6) Complete reset
export function resetPin(token: string, pin: string, confirmPin: string) {
  return postAuth("/api/auth/reset-complete", {
    token,
    password: pin,
    confirmPassword: confirmPin,
  });
}
