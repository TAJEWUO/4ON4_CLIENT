// ==============================
// AUTO-DETECT BACKEND BASE URL
// ==============================
function getBaseUrl(): string {
  // 1. Production override (future deployment)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // 2. Server-side rendering → localhost
  if (typeof window === "undefined") {
    return "http://localhost:3002";
  }

  const host = window.location.hostname;

  // 3. Laptop / Desktop
  if (host === "localhost" || host === "127.0.0.1") {
    return "http://localhost:3002";
  }

  // 4. Phone or tablet on WiFi (192.168.0.x)
  if (host.startsWith("192.168.0.")) {
    return "http://192.168.0.101:3002"; // FIXED to working backend IP
  }

  // 5. Any other subnet (192.168.1.x, 10.x.x.x)
  return "http://192.168.0.101:3002";
}

export const BASE_URL = getBaseUrl();


// ==============================
// CLEAN + BUILD IMAGE URL
// ==============================
export function buildImageUrl(path?: string | null): string {
  if (!path) return "/placeholder.svg";

  // Already a full URL
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Normalize slashes & clean "src/"
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
// API FUNCTIONS
// ===================================================

/* AUTH */
export async function apiRegister(data: any) {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    mode: "cors",
  });
  return res.json();
}

export async function apiLogin(identifier: string, password: string) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
    mode: "cors",
  });
  return res.json();
}

export async function apiResetPassword(identifier: string, newPassword: string) {
  const res = await fetch(`${BASE_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, newPassword }),
    mode: "cors",
  });
  return res.json();
}


/* PROFILE */
export async function apiGetProfile(userId: string) {
  const res = await fetch(`${BASE_URL}/api/user/profile/${userId}`, {
    method: "GET",
    mode: "cors",
  });
  return res.json();
}

export async function apiUpdateProfile(userId: string, data: FormData) {
  const res = await fetch(`${BASE_URL}/api/user/profile/${userId}`, {
    method: "PUT",
    body: data,
    mode: "cors",
  });
  return res.json();
}


/* VEHICLES */
export async function apiUploadVehicle(formData: FormData) {
  const res = await fetch(`${BASE_URL}/api/vehicles/upload`, {
    method: "POST",
    body: formData,
    mode: "cors",
  });
  return res.json();
}

export async function apiGetVehicles(userId: string) {
  const res = await fetch(`${BASE_URL}/api/vehicles/${userId}`, {
    method: "GET",
    mode: "cors",
  });
  return res.json();
}

export async function apiDeleteVehicle(vehicleId: string) {
  const res = await fetch(`${BASE_URL}/api/vehicles/${vehicleId}`, {
    method: "DELETE",
    mode: "cors",
  });
  return res.json();
}

export async function apiUpdateVehicle(vehicleId: string, data: FormData) {
  const res = await fetch(`${BASE_URL}/api/vehicles/${vehicleId}`, {
    method: "PUT",
    body: data,
    mode: "cors",
  });
  return res.json();
}
