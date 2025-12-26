// features/profile/profile.service.ts

import { apiGet, apiPut, apiPost } from "@/lib/utils/apiClient";

/**
 * Get own profile
 */
export async function getProfile(token?: string) {
  return apiGet("/api/profile/me", token);
}

/**
 * Create profile (POST /api/profile)
 */
export async function createProfile(payload: any, token?: string) {
  return apiPost("/api/profile", payload, token);
}

/**
 * Save profile (update or create)
 *
 * - Try to update first: PUT /api/profile/me
 * - If server returns 404 / "Profile not found", attempt create: POST /api/profile
 */
export async function saveProfile(payload: any, token?: string) {
  // First, try to update existing profile
  const updateResult = await apiPut("/api/profile/me", payload, token);

  // If update succeeded, return
  if (updateResult.ok) {
    return updateResult;
  }

  // If profile not found (404), create new profile
  // Backend returns { ok: false, message: 'Profile not found' }
  const errorMessage = updateResult.message || updateResult.data?.message || "";
  if (errorMessage.toLowerCase().includes("not found")) {
    console.log("Profile not found, creating new profile...");
    return createProfile(payload, token);
  }

  // Otherwise, return the error from update
  return updateResult;
}