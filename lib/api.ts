// lib/api.ts

// ==============================
// BACKEND BASE URL (single source of truth)
// ==============================
//
// In Vercel, set:
//   NEXT_PUBLIC_BACKEND_URL = https://fouron4-backend-1.onrender.com
//
// In local .env.local, set (if you run backend locally):
//   NEXT_PUBLIC_BACKEND_URL = http://localhost:3002
//
// If the env var is missing, we fall back to localhost:3002.

export const BASE_URL: string =
  (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3002").replace(
    /\/+$/,
    ""
  );

// Small helper to parse JSON safely
async function jsonFetch(url: string, options: RequestInit) {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  return { res, data };
}

// ==============================
// IMAGE URL BUILDER
// ==============================
export function buildImageUrl(path?: string | null): string {
  if (!path) return "/placeholder.svg";

  // Already full URL
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Normalize slashes & strip "src/"
  let cleaned = path
    .replace(/\\/g, "/")
    .replace(/^src\//, "")
    .replace(/^\/+/, "");

  // If only filename → assume vehicle folder
  if (!cleaned.includes("/")) {
    cleaned = "uploads/vehicles/" + cleaned;
  }

  return `${BASE_URL}/${cleaned}`;
}

// ===================================================
// OPTIONAL AUTH HELPERS (legacy, only if you still use them)
// Most of your new auth flow uses postAuth from lib/auth-api.ts.
// ===================================================

export async function apiRegister(data: any) {
  const { data: json } = await jsonFetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return json;
}

export async function apiLogin(identifier: string, password: string) {
  const { data: json } = await jsonFetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  });
  return json;
}

export async function apiResetPassword(
  identifier: string,
  newPassword: string
) {
  const { data: json } = await jsonFetch(`${BASE_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, newPassword }),
  });
  return json;
}

// ===================================================
// PROFILE
// ===================================================

export async function apiGetProfile(userId: string) {
  const { data: json } = await jsonFetch(
    `${BASE_URL}/api/user/profile/${userId}`,
    {
      method: "GET",
    }
  );
  return json;
}

export async function apiUpdateProfile(userId: string, data: FormData) {
  const { data: json } = await jsonFetch(
    `${BASE_URL}/api/user/profile/${userId}`,
    {
      method: "PUT",
      body: data,
    }
  );
  return json;
}

// ===================================================
// VEHICLES
// ===================================================

export async function apiUploadVehicle(formData: FormData) {
  const { data: json } = await jsonFetch(`${BASE_URL}/api/vehicles/upload`, {
    method: "POST",
    body: formData,
  });
  return json;
}

export async function apiGetVehicles(userId: string) {
  const { data: json } = await jsonFetch(
    `${BASE_URL}/api/vehicles/${userId}`,
    {
      method: "GET",
    }
  );
  return json;
}

export async function apiDeleteVehicle(vehicleId: string) {
  const { data: json } = await jsonFetch(
    `${BASE_URL}/api/vehicles/${vehicleId}`,
    {
      method: "DELETE",
    }
  );
  return json;
}

export async function apiUpdateVehicle(vehicleId: string, data: FormData) {
  const { data: json } = await jsonFetch(
    `${BASE_URL}/api/vehicles/${vehicleId}`,
    {
      method: "PUT",
      body: data,
    }
  );
  return json;
}
