// lib/auth-api.ts
import { httpPost } from "@/lib/http";

/**
 * Simple auth API - all calls return { ok, data }
 */

// Send OTP to phone number
export async function startVerify(phone: string) {
  return httpPost("/api/auth/verify/start", JSON.stringify({ phone }));
}

// Verify OTP code
export async function checkVerify(phone: string, code: string) {
  return httpPost("/api/auth/verify/check", JSON.stringify({ phone, code }));
}

// Complete registration with phone, PIN, and name
export async function completeRegister(phone: string, pin: string, firstName: string, lastName: string) {
  return httpPost("/api/auth/register-complete", JSON.stringify({ phone, pin, firstName, lastName }));
}

// Login with phone and PIN
export async function loginUser(phone: string, pin: string) {
  return httpPost("/api/auth/login", JSON.stringify({ phone, pin }));
}

// Reset PIN
export async function resetPinComplete(phone: string, newPin: string) {
  return httpPost("/api/auth/reset-pin-complete", JSON.stringify({ phone, newPin }));
}

// Refresh access token
export async function refreshToken() {
  return httpPost("/api/auth/refresh", "");
}