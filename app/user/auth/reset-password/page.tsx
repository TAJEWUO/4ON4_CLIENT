"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { postAuth } from "@/lib/auth-api";

const pinRegex = /^\d{4}$/;

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");

  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Invalid or expired reset link.
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");

    if (!pinRegex.test(pin)) {
      setMsg("PIN must be exactly 4 digits.");
      return;
    }

    if (pin !== confirmPin) {
      setMsg("PINs do not match.");
      return;
    }

    setLoading(true);

    const { ok, data } = await postAuth("/api/auth/reset-complete", {
      token,
      password: pin,
      confirmPassword: confirmPin,
    });

    setLoading(false);

    if (!ok) {
      setMsg(data.message || "Failed to reset PIN.");
      return;
    }

    router.push("/user/auth/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md p-6 border rounded-xl shadow">
        <h1 className="text-2xl font-bold text-center mb-6">
          Reset Your PIN
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium">New 4-Digit PIN</label>
            <input
              type="password"
              maxLength={4}
              inputMode="numeric"
              className="w-full border px-3 py-2 rounded text-center tracking-widest"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ""))}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Confirm New PIN
            </label>
            <input
              type="password"
              maxLength={4}
              inputMode="numeric"
              className="w-full border px-3 py-2 rounded text-center tracking-widest"
              value={confirmPin}
              onChange={(e) =>
                setConfirmPin(e.target.value.replace(/[^0-9]/g, ""))
              }
              required
            />
          </div>

          {msg && (
            <p className="text-red-600 text-center text-sm">{msg}</p>
          )}

          <button
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-md"
          >
            {loading ? "Resetting..." : "Reset PIN"}
          </button>
        </form>
      </div>
    </div>
  );
}
