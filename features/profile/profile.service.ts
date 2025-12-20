const API_BASE = "https://fouron4-backend-1.onrender.com";

function getToken() {
  const token = localStorage.getItem("fouron4_access");
  if (!token) throw new Error("No auth token");
  return token;
}

export async function saveProfile(payload: any) {
  const token = getToken();

  const res = await fetch(`${API_BASE}/api/profile/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to save profile");
  }

  return res.json();
}
