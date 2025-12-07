// lib/api.ts

// Single source of truth for backend base URL
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

// IMAGE builder
export function buildImageUrl(path?: string | null): string {
  if (!path) return "/placeholder.svg";

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  let cleaned = path
    .replace(/\\/g, "/")
    .replace(/^src\//, "")
    .replace(/^\/+/, "");

  if (!cleaned.includes("/")) {
    cleaned = "uploads/vehicles/" + cleaned;
  }

  return `${BASE_URL}/${cleaned}`;
}

// LEGACY helpers (only used in some places)
export async function apiGetProfile(userId: string) {
  const { data: json } = await jsonFetch(`${BASE_URL}/api/user/profile/${userId}`, {
    method: "GET",
  });
  return json;
}
