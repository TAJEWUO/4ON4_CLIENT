// lib/auth-api.ts

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://fouron4-backend-1.onrender.com";

async function postAuth(path: string, body: any) {
  try {
    const res = await fetch(`${API_URL}/api/auth${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) return { ok: false, data };
    return { ok: true, data };
  } catch (err) {
    return { ok: false, data: { message: "Network error" } };
  }
}

/* ---------------------------------------------------
   START VERIFY (OTP)
--------------------------------------------------- */
export async function startVerify(phone: string) {
  return postAuth("/verify/start", { phone });
}

/* ---------------------------------------------------
   CHECK VERIFY (OTP)
--------------------------------------------------- */
export async function checkVerify(otp: string, token: string) {
  return postAuth("/verify/check", { otp, token });
}

/* ---------------------------------------------------
   COMPLETE REGISTRATION   <— REQUIRED BY create-account
--------------------------------------------------- */
export async function completeRegister(
  token: string,
  pin: string,
  confirmPin: string
) {
  return postAuth("/register-complete", { token, pin, confirmPin });
}

/* ---------------------------------------------------
   LOGIN
--------------------------------------------------- */
export async function loginUser(phone: string, pin: string) {
  return postAuth("/login", { phone, pin });
}

/* ---------------------------------------------------
   RESET PIN COMPLETE
--------------------------------------------------- */
export async function resetPinComplete(
  token: string,
  pin: string,
  confirmPin: string
) {
  return postAuth("/reset-pin-complete", { token, pin, confirmPin });
}
