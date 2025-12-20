"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { startVerify } from "@/lib/auth-api";

export default function ForgotPinForm() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Normalize phone number to 07xxxxxxxx or 01xxxxxxxx (Kenya)
  const normalizePhone = (raw: string) => {
    const digits = raw.replace(/\D/g, "");

    if (digits.startsWith("07") || digits.startsWith("01")) {
      return digits.slice(0, 10);
    }
    if (digits.startsWith("7")) return "07" + digits.substring(1, 9);
    if (digits.startsWith("1")) return "01" + digits.substring(1, 9);

    return digits.slice(0, 10);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");

    if (!phone) {
      setMsg("Enter your phone number.");
      return;
    }

    const normalized = normalizePhone(phone);

    if (normalized.length < 10) {
      setMsg("Enter a valid phone number.");
      return;
    }

    setLoading(true);

    const { ok, data } = await startVerify(normalized);

    setLoading(false);

    if (!ok) {
      setMsg(data?.message || "Failed to send OTP.");
      return;
    }

    // Save reset context
    localStorage.setItem("fouron4_reset_phone", normalized);
    localStorage.setItem("fouron4_reset_token", data?.token || ""); // backend returns token
    localStorage.setItem("fouron4_auth_mode", "reset");

    router.push("/user/auth/verify-reset");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-white px-4 text-black"
      style={{ fontFamily: 'Candara, "Candara Light", system-ui, sans-serif' }}
    >
      <div className="w-full max-w-md bg-white/95 border border-black/20 rounded-2xl shadow-md px-6 py-8">
        
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold tracking-wide mb-2">4ON4</h1>
          <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold tracking-wide">
            DRIVER ACCOUNT
          </span>
        </div>

        <h1 className="text-xl font-semibold text-center mb-4">Enter Phone Number Used If You Forgot PIN</h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* PHONE NUMBER */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Phone Number
            </label>

            <div className="border border-black/30 rounded-md bg-white px-3 py-2 flex items-center">
              <span className="text-black/70 text-sm pr-2 border-r border-black/10">
                +254
              </span>

              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                className="flex-1 bg-transparent outline-none text-sm pl-3"
                placeholder=""
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, "")) // only digits
                }
              />
            </div>
          </div>

          {/* ERROR */}
          {msg && <p className="text-center text-sm text-red-600">{msg}</p>}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-md bg-black text-white font-semibold disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>

        <p className="text-center text-xs mt-4">
          Remembered your PIN?{" "}
          <a href="/user/auth/login" className="text-blue-700 underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
