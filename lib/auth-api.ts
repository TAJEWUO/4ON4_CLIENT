// lib/auth-api.ts

// This is the base URL of your backend (Render or local)
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

// Small helper for POST JSON auth requests (login, register, etc.)
export async function postAuth(path: string, body: any) {
  try {
    const res = await fetch(`${backendUrl}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return { ok: res.ok, data };
  } catch (err) {
    console.error("Auth POST error:", err);
    return { ok: false, data: { message: "Network error" } };
  }
}
