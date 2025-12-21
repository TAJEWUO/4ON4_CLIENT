 
// features/profile/profile.service.ts
import { httpGet, httpPut } from "@/lib/http";

export async function getProfile() {
  // GET /api/profile/me — httpGet auto-attaches Authorization header
  return httpGet("/api/profile/me");
}

export async function saveProfile(payload: any) {
  // payload may be FormData or a plain object
  if (payload instanceof FormData) {
    return httpPut("/api/profile/me", payload);
  } else {
    return httpPut("/api/profile/me", JSON.stringify(payload));
  }
}