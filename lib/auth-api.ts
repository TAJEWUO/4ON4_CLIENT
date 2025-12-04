// lib/auth-api.ts

import { BASE_URL } from "./api";

export type ApiResult<T = any> = {
  ok: boolean;
  data: T;
};

// Base helper
export async function postAuth(path: string, body: any): Promise<ApiResult> {
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
// TWILIO PHONE FLOWS
// =============================

// start OTP (register or reset)
export function startVerify(phone: string, mode: "register" | "reset") {
  return postAuth("/api/auth/verify/start", { phone, mode });
}

// check OTP
export function checkVerify(
  phone: string,
  code: string,
  mode: "register" | "reset"
) {
  return postAuth("/api/auth/verify/check", { phone, code, mode });
}

// finish registration (set PIN)
export function completeRegister(token: string, pin: string, confirmPin: string) {
  return postAuth("/api/auth/register-complete", {
    token,
    pin,
    confirmPin,
  });
}

// login
export function login(phone: string, pin: string) {
  return postAuth("/api/auth/login", {
    phone,
    pin,
  });
}

// reset PIN complete
export function resetPinComplete(
  token: string,
  pin: string,
  confirmPin: string
) {
  return postAuth("/api/auth/reset-pin-complete", {
    token,
    pin,
    confirmPin,
  });
}
