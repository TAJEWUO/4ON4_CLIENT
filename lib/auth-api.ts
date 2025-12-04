// lib/auth-api.ts

import { BASE_URL } from "./api";

// Generic helper for JSON POST requests to backend auth routes
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

/* =============================
   AUTH FLOWS
   (some legacy, some Twilio)
   ============================= */

// ⚠️ These may be legacy email-based flows. They won't break anything
// even if unused, but you can clean them up later.

// 1) Legacy: Start registration — send email OTP
export function startRegister(email: string) {
  return postAuth("/api/auth/register-start", { email });
}

// 2) Legacy: Verify email OTP
export function verifyEmailCode(email: string, code: string) {
  return postAuth("/api/auth/verify-email-code", { email, code });
}

// 3) Legacy: Complete registration with email + phone + pin
export function completeRegisterLegacy(payload: any) {
  return postAuth("/api/auth/register-complete", payload);
}

/* =============================
   TWILIO / PHONE-ONLY FLOWS
   ============================= */

// Start Twilio verification (phone) for REGISTER
export function startPhoneRegister(phone: string) {
  return postAuth("/api/auth/verify/start", {
    phone,
    mode: "register",
  });
}

// Start Twilio verification (phone) for RESET
export function startPhoneReset(phone: string) {
  return postAuth("/api/auth/verify/start", {
    phone,
    mode: "reset",
  });
}

// Check Twilio verification code (shared for register + reset)
export function checkPhoneOtp(
  phone: string,
  code: string,
  mode: "register" | "reset"
) {
  return postAuth("/api/auth/verify/check", {
    phone,
    code,
    mode,
  });
}

// New: complete registration after Twilio OTP (set PIN)
export function completeRegister(
  token: string,
  pin: string,
  confirmPin: string
) {
  return postAuth("/api/auth/register-complete", {
    token,
    pin,
    confirmPin,
  });
}

// ✅ LOGIN: this is the critical fix: send { phone, pin }
export function login(phone: string, pin: string) {
  return postAuth("/api/auth/login", { phone, pin });
}

// Reset PIN after Twilio OTP
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
