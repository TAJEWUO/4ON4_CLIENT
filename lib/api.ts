// lib/api.ts
export const BASE_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3002").replace(/\/+$/,"");

async function jsonFetch(url: string, options: RequestInit = {}) {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

/* -----------------------
   Profile
   ----------------------- */
export async function apiSaveProfile(formData: FormData) {
  return jsonFetch(`${BASE_URL}/api/profile`, {
    method: "POST",
    body: formData,
  });
}

export async function apiGetProfile(userId: string) {
  return jsonFetch(`${BASE_URL}/api/profile/${userId}`, {
    method: "GET",
  });
}

export async function apiUpdateProfile(userId: string, formData: FormData) {
  return jsonFetch(`${BASE_URL}/api/profile/${userId}`, {
    method: "PUT",
    body: formData,
  });
}

/* -----------------------
   Vehicles
   ----------------------- */
export async function apiAddVehicle(formData: FormData) {
  return jsonFetch(`${BASE_URL}/api/vehicles`, {
    method: "POST",
    body: formData,
  });
}

export async function apiGetVehicles(userId: string) {
  return jsonFetch(`${BASE_URL}/api/vehicles/${userId}`, { method: "GET" });
}

export async function apiUpdateVehicle(vehicleId: string, formData: FormData) {
  return jsonFetch(`${BASE_URL}/api/vehicles/${vehicleId}`, {
    method: "PUT",
    body: formData,
  });
}

export async function apiDeleteVehicle(vehicleId: string) {
  return jsonFetch(`${BASE_URL}/api/vehicles/${vehicleId}`, {
    method: "DELETE",
  });
}

/* Helper to build absolute image URLs (if backend stores file paths) */
export function buildImageUrl(path?: string | null) {
  if (!path) return "/placeholder.svg";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const cleaned = path.replace(/^\/+/, "");
  return `${BASE_URL}/${cleaned}`;
}
