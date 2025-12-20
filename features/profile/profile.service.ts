const API_BASE = "https://fouron4-backend-1.onrender.com";

function getToken() {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("fouron4_access");
  if (!token) throw new Error("No auth token");
  return token;
}

export async function getProfile() {
  const token = getToken();
  const res = await fetch(`${API_BASE}/api/profile/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to fetch profile");
  }

  return res.json();
}

/**
 * saveProfile(payload)
 * - If payload is FormData (files/arrays), do not set Content-Type header (browser sets boundary).
 * - For plain objects, send JSON.
 * - Endpoint: PUT /api/profile/me (backend expects auth + multer fields).
 */
export async function saveProfile(payload: any) {
  let token: string | null = null;
  try {
    token = getToken();
  } catch (err) {
    token = null;
  }

  const headers: Record<string, string> = {};
  let body: BodyInit | null = null;
  const method = "PUT";
  const url = `${API_BASE}/api/profile/me`;

  if (payload instanceof FormData) {
    body = payload;
    // DO NOT set Content-Type; the browser will set it including boundary
  } else {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(payload);
  }

  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body as BodyInit,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to save profile");
  }

  return res.json();
}