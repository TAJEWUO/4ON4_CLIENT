// lib/auth-api.ts

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://fouron4-backend-1.onrender.com";

// 👉 Helper function for POST requests
async function post(endpoint: string, body: any) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return { ok: res.ok, data };
  } catch (error) {
    return { ok: false, data: { message: "Network error" } };
  }
}

// ====================================================================
// 📌 AUTH FUNCTIONS (USED BY REGISTER, LOGIN, FORGOT PIN, RESET PIN)
// ====================================================================

// 1️⃣ Start OTP (register or reset)
export async function startVerify(phone: string, mode: "register" | "reset") {
  return post("/api/auth/verify/start", { phone, mode });
}

// 2️⃣ Check OTP (register or reset)
export async function checkVerify(phone: string, code: string, mode: "register" | "reset") {
  return post("/api/auth/verify/check", { phone, code, mode });
}

// 3️⃣ Complete registration
export async function completeRegister(token: string, pin: string, pinConfirm: string) {
  return post("/api/auth/register-complete", { token, pin, pinConfirm });
}

// 4️⃣ Login
export async function loginUser(phone: string, pin: string) {
  return post("/api/auth/login", { phone, pin });
}

// 5️⃣ Reset PIN (after OTP)
export async function resetPinComplete(resetToken: string, pin: string, pinConfirm: string) {
  return post("/api/auth/reset-pin-complete", { resetToken, pin, pinConfirm });
}
