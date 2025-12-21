 //github.com/TAJEWUO/4ON4_CLIENT/blob/f07fcd85ab31986c03e72244aa5e489fbdb3da8f/lib/auth-api.ts
// lib/auth-api.ts
import { httpPost, API_BASE } from "@/lib/http";

/**
 * Simple auth API wrapper that uses centralized http helper.
 * NOTE: httpPost will not attach cookies; auth returns access/refresh tokens.
 */

export async function loginUser(phone: string, pin: string) {
  return httpPost("/api/auth/login", JSON.stringify({ phone, pin }));
}

export async function startVerify(phone: string, mode = "register") {
  return httpPost("/api/auth/verify/start", JSON.stringify({ phone, mode }));
}

export async function checkVerify(otp: string, token: string, mode = "register") {
  return httpPost("/api/auth/verify/check", JSON.stringify({ code: otp, token, mode }));
}

export async function completeRegister(token: string, pin: string, confirmPin: string) {
  return httpPost("/api/auth/register-complete", JSON.stringify({ token, pin, confirmPin }));
}

export async function resetPinComplete(token: string, pin: string, confirmPin: string) {
  return httpPost("/api/auth/reset-pin-complete", JSON.stringify({ token, pin, confirmPin }));
}