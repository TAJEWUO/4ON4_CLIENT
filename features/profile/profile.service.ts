// features/profile/profile.service.ts

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

async function httpGet(endpoint: string, token?: string) {
  try {
    console.log("httpGet - Fetching:", `${API_BASE}${endpoint}`);
    console.log("httpGet - Token:", token ? "Present" : "Missing");
    
    const headers: any = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers,
    });
    
    console.log("httpGet - Status:", res.status, res.statusText);
    
    let data;
    try {
      data = await res.json();
    } catch (parseErr) {
      console.error("httpGet - Failed to parse JSON:", parseErr);
      return { ok: false, data: { message: "Invalid response from server" } };
    }
    
    console.log("httpGet - Backend response:", data);
    
    // Return the backend response directly (already has { ok, data } structure)
    return data;
  } catch (err) {
    console.error("httpGet - Network error:", err);
    return { ok: false, data: { message: "Network error" } };
  }
}

async function httpPut(endpoint: string, body: FormData | string, token?: string) {
  try {
    const headers: any = {};
    if (typeof body === "string") {
      headers["Content-Type"] = "application/json";
    }
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "PUT",
      headers,
      body,
    });
    const data = await res.json();
    
    console.log("httpPut - Response:", data);
    
    // Return backend response directly
    return data;
  } catch (err) {
    console.error("httpPut - Network error:", err);
    return { ok: false, data: { message: "Network error" } };
  }
}

async function httpPost(endpoint: string, body: FormData | string, token?: string) {
  try {
    const headers: any = {};
    if (typeof body === "string") {
      headers["Content-Type"] = "application/json";
    }
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers,
      body,
    });
    const data = await res.json();
    
    console.log("httpPost - Response:", data);
    
    // Return backend response directly
    return data;
  } catch (err) {
    console.error("httpPost - Network error:", err);
    return { ok: false, data: { message: "Network error" } };
  }
}

/**
 * Get own profile
 */
export async function getProfile(token?: string) {
  return httpGet("/api/profile/me", token);
}

/**
 * Create profile (POST /api/profile)
 */
export async function createProfile(payload: any, token?: string) {
  if (payload instanceof FormData) {
    return httpPost("/api/profile", payload, token);
  }
  return httpPost("/api/profile", JSON.stringify(payload), token);
}

/**
 * Save profile (update or create)
 *
 * - Try to update first: PUT /api/profile/me
 * - If server returns 404 / "Profile not found", attempt create: POST /api/profile
 */
export async function saveProfile(payload: any, token?: string) {
  // First, try to update existing profile
  const updateResult = await (payload instanceof FormData 
    ? httpPut("/api/profile/me", payload, token) 
    : httpPut("/api/profile/me", JSON.stringify(payload), token));

  // If update succeeded, return
  if (updateResult.ok) {
    return updateResult;
  }

  // If profile not found (404), create new profile
  // Backend returns { ok: false, message: 'Profile not found' }
  if (updateResult.message?.toLowerCase().includes("not found")) {
    console.log("Profile not found, creating new profile...");
    return createProfile(payload, token);
  }

  // Otherwise, return the error from update
  return updateResult;
}