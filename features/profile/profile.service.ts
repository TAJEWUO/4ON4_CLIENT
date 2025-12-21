// features/profile/profile.service.ts
import { httpGet, httpPut, httpPost } from "@/lib/http";

/**
 * Get own profile
 */
export async function getProfile() {
  return httpGet("/api/profile/me");
}

/**
 * Create profile (POST /api/profile)
 */
export async function createProfile(payload: any) {
  if (payload instanceof FormData) {
    return httpPost("/api/profile", payload);
  }
  return httpPost("/api/profile", JSON.stringify(payload));
}

/**
 * Save profile (update or create)
 *
 * - Try to update first: PUT /api/profile/me
 * - If server returns 404 / "Profile not found", attempt create: POST /api/profile
 */
export async function saveProfile(payload: any) {
  try {
    if (payload instanceof FormData) {
      return await httpPut("/api/profile/me", payload);
    } else {
      return await httpPut("/api/profile/me", JSON.stringify(payload));
    }
  } catch (err: any) {
    // If profile not found on update, create it
    const status = err?.status;
    const message = (err && (err.message || "")).toString().toLowerCase();

    if (status === 404 || message.includes("profile not found") || message.includes("profile not found")) {
      // fallback to create
      return createProfile(payload);
    }

    // rethrow other errors
    throw err;
  }
}