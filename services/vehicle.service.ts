// services/vehicle.service.ts
// Vehicle service API functions

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

async function httpGet(endpoint: string, token?: string) {
  try {
    const headers: any = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    const res = await fetch(`${API_BASE}${endpoint}`, { headers });
    const data = await res.json();
    
    console.log("[vehicle.service] GET response:", data);
    return data;
  } catch (err) {
    console.error("[vehicle.service] GET error:", err);
    return { ok: false, message: "Network error" };
  }
}

async function httpPost(endpoint: string, body: FormData, token?: string) {
  try {
    console.log("[vehicle.service] POST to:", `${API_BASE}${endpoint}`);
    console.log("[vehicle.service] Has token:", !!token);
    
    const headers: any = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers,
      body,
    });
    
    console.log("[vehicle.service] Response status:", res.status, res.statusText);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error("[vehicle.service] Error response:", errorText);
      try {
        const errorData = JSON.parse(errorText);
        return errorData;
      } catch {
        return { ok: false, message: `Server error: ${res.status}` };
      }
    }
    
    const data = await res.json();
    console.log("[vehicle.service] POST response:", data);
    return data;
  } catch (err) {
    console.error("[vehicle.service] POST error:", err);
    return { ok: false, message: err instanceof Error ? err.message : "Network error" };
  }
}

async function httpPut(endpoint: string, body: FormData, token?: string) {
  try {
    console.log("[vehicle.service] PUT to:", `${API_BASE}${endpoint}`);
    console.log("[vehicle.service] Has token:", !!token);
    
    const headers: any = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "PUT",
      headers,
      body,
    });
    
    console.log("[vehicle.service] Response status:", res.status, res.statusText);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error("[vehicle.service] Error response:", errorText);
      try {
        const errorData = JSON.parse(errorText);
        return errorData;
      } catch {
        return { ok: false, message: `Server error: ${res.status}` };
      }
    }
    
    const data = await res.json();
    console.log("[vehicle.service] PUT response:", data);
    return data;
  } catch (err) {
    console.error("[vehicle.service] PUT error:", err);
    return { ok: false, message: err instanceof Error ? err.message : "Network error" };
  }
}

async function httpDelete(endpoint: string, token?: string, body?: any) {
  try {
    const headers: any = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    const options: RequestInit = {
      method: "DELETE",
      headers,
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const res = await fetch(`${API_BASE}${endpoint}`, options);
    const data = await res.json();
    
    console.log("[vehicle.service] DELETE response:", data);
    return data;
  } catch (err) {
    console.error("[vehicle.service] DELETE error:", err);
    return { ok: false, message: "Network error" };
  }
}

/**
 * Get all vehicles for a user
 */
export async function getVehicles(userId: string, token?: string) {
  return httpGet(`/api/vehicle/${userId}`, token);
}

/**
 * Get single vehicle by ID
 */
export async function getVehicleById(vehicleId: string, token?: string) {
  return httpGet(`/api/vehicle/single/${vehicleId}`, token);
}

/**
 * Create new vehicle
 */
export async function createVehicle(formData: FormData, token?: string) {
  return httpPost("/api/vehicle/upload", formData, token);
}

/**
 * Update existing vehicle
 */
export async function updateVehicle(vehicleId: string, formData: FormData, token?: string) {
  return httpPut(`/api/vehicle/${vehicleId}`, formData, token);
}

/**
 * Delete individual image from vehicle
 */
export async function deleteVehicleImage(vehicleId: string, imagePath: string, token?: string) {
  return httpDelete(`/api/vehicle/${vehicleId}/image`, token, { imagePath });
}

/**
 * Delete entire vehicle
 */
export async function deleteVehicle(vehicleId: string, token?: string) {
  return httpDelete(`/api/vehicle/${vehicleId}`, token);
}
