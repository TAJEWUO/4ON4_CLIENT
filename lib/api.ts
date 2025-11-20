const BASE_URL = "http://192.168.0.104:3002";


export async function apiRegister(data: any) {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function apiLogin(identifier: string, password: string) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  });
  return res.json();
}

export async function apiGetProfile(userId: string) {
  const res = await fetch(`${BASE_URL}/api/user/profile/${userId}`);
  return res.json();
}

export async function apiUpdateProfile(userId: string, data: FormData) {
  const res = await fetch(`${BASE_URL}/api/user/profile/${userId}`, {
    method: "PUT",
    body: data,
  });
  return res.json();
}

export async function apiUploadVehicle(data: FormData) {
  const res = await fetch(`${BASE_URL}/api/vehicles/upload`, {
    method: "POST",
    body: data,
  });
  return res.json();
}

export async function apiGetVehicles(userId: string) {
  const res = await fetch(`${BASE_URL}/api/vehicles/${userId}`);
  return res.json();
}

export async function apiResetPassword(identifier: string, newPassword: string) {
  const res = await fetch(`${BASE_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, newPassword }),
  });
  return res.json();
}

