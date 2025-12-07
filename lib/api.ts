// lib/api.ts

// ---------------------------------------------------------
// BACKEND BASE URL
// ---------------------------------------------------------
export const BASE_URL: string =
  (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3002").replace(
    /\/+$/,
    ""
  );

// ---------------------------------------------------------
// BASIC FETCH WRAPPER
// ---------------------------------------------------------
async function apiRequest(
  path: string,
  method: string = "GET",
  body?: any
): Promise<{ ok: boolean; data: any }> {
  try {
    const url = `${BASE_URL}${path}`;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) return { ok: false, data };
    return { ok: true, data };
  } catch (err) {
    return {
      ok: false,
      data: { message: "Network request failed", error: String(err) },
    };
  }
}

// ---------------------------------------------------------
// IMAGE URL BUILDER
// ---------------------------------------------------------
export function buildImageUrl(path?: string | null): string {
  if (!path) return "/placeholder.svg";

  // absolute URL
  if (path.startsWith("http://") || path.startsWith("https://"))
    return path;

  let cleaned = path
    .replace(/\\/g, "/")
    .replace(/^src\//, "")
    .replace(/^\/+/, "");

  // adjust if missing folder
  if (!cleaned.includes("/")) {
    cleaned = "uploads/vehicles/" + cleaned;
  }

  return `${BASE_URL}/${cleaned}`;
}

// ---------------------------------------------------------
// AUTH API
// ---------------------------------------------------------

// Start Twilio verification (register or reset)
export async function startVerify(phone: string, mode: "register" | "reset") {
  return apiRequest("/auth/verify/start", "POST", { phone, mode });
}

// Check Twilio OTP (register or reset)
export async function checkVerify(phone: string, code: string, mode: string) {
  return apiRequest("/auth/verify/check", "POST", { phone, code, mode });
}

// Complete registration (after OTP)
export async function completeRegister(
  token: string,
  pin: string,
  pinConfirm: string
) {
  return apiRequest("/auth/register-complete", "POST", {
    token,
    pin,
    pinConfirm,
  });
}

// Login user
export async function loginUser(phone: string, pin: string) {
  return apiRequest("/auth/login", "POST", { phone, pin });
}

// Complete PIN reset
export async function resetPinComplete(
  phone: string,
  pin: string,
  pinConfirm: string
) {
  return apiRequest("/auth/reset-pin-complete", "POST", {
    phone,
    pin,
    pinConfirm,
  });
}

// ---------------------------------------------------------
// VEHICLES API (YOUR REQUIRED FUNCTIONS)
// ---------------------------------------------------------

// 1️⃣ Upload vehicle
export function apiUploadVehicle(vehicle: any) {
  return apiRequest("/vehicles/upload", "POST", vehicle);
}

// 2️⃣ Get vehicles for a user
export function apiGetVehicles(userId: string) {
  return apiRequest(`/vehicles/${userId}`, "GET");
}

// 3️⃣ Delete a vehicle
export function apiDeleteVehicle(vehicleId: string) {
  return apiRequest(`/vehicles/${vehicleId}`, "DELETE");
}

// 4️⃣ Update vehicle
export function apiUpdateVehicle(vehicleId: string, updates: any) {
  return apiRequest(`/vehicles/${vehicleId}`, "PUT", updates);
}

// ---------------------------------------------------------
// PROFILE API (ONLY IF NEEDED)
// ---------------------------------------------------------
export async function apiGetProfile(userId: string) {
  return apiRequest(`/api/user/profile/${userId}`, "GET");
}
