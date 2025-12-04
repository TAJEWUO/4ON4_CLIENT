"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth-api";

export default function LoginForm() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Normalize phone to match backend logic
  const normalizePhone = (raw: string) => {
    const digits = raw.replace(/\D/g, "");

    if (digits.startsWith("07") || digits.startsWith("01")) {
      return digits;
    }
    if (digits.startsWith("7")) return "07" + digits.substring(1);
    if (digits.startsWith("1")) return "01" + digits.substring(1);

    return digits;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");

    const cleanedPhone = normalizePhone(phone);

    if (cleanedPhone.length !== 10) {
      setMsg("Enter a valid Kenyan phone number (07.. or 01..)");
      return;
    }

    if (pin.length !== 4) {
      setMsg("PIN must be 4 digits");
      return;
    }

    setLoading(true);

    const { ok, data } = await login(cleanedPhone, pin);

    setLoading(false);

    if (!ok) {
      setMsg(data?.message || "Incorrect phone or PIN");
      return;
    }

    // Save user & tokens
    localStorage.setItem("fouron4_user_id", data.user.id);
    localStorage.setItem("fouron4_access", data.accessToken);
    localStorage.setItem("fouron4_refresh", data.refreshToken);

    router.push("/user/dashboard");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-white text-black px-4"
      style={{ fontFamily: 'Candara, "Candara Light", system-ui, sans-serif' }}
    >
      <div className="w-full max-w-md bg-white/95 border border-black/20 rounded-2xl shadow-sm px-6 py-8 md:px-8 md:py-10">

        <div className="text-center mb-6">
          <div className="text-3xl font-extrabold tracking-wide mb-2">4ON4</div>
          <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold tracking-wide">
            DRIVER LOGIN
          </span>
        </div>

        <h1 className="text-xl font-semibold text-center mb-4">
          Login to Your Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* PHONE NUMBER */}
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <div className="flex items-center gap-2">
              <span className="px-3 py-2 border border-black/30 rounded-md bg-white text-sm">+254</span>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                className="flex-1 border border-black/30 rounded-md px-3 py-2 bg-white text-sm"
                placeholder="7xxxxxxxx or 1xxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              />
            </div>
          </div>

          {/* PIN */}
          <div>
            <label className="block text-sm font-medium mb-1">PIN</label>
            <input
              type="password"
              maxLength={4}
              inputMode="numeric"
              className="w-full border border-black/30 rounded-md px-3 py-2 text-sm tracking-widest bg-white"
              placeholder="4-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            />
          </div>

          {msg && (
            <p className="text-center text-sm text-red-600 leading-snug">{msg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 rounded-md bg-black text-white font-semibold disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs">
          Forgot PIN?{" "}
          <a href="/user/auth/forgot-pin" className="text-blue-700 hover:underline">
            Reset PIN
          </a>
        </p>

        <p className="mt-2 text-center text-xs">
          Don’t have an account?{" "}
          <a href="/user/auth/register" className="text-blue-700 hover:underline">
            Create Account
          </a>
        </p>

      </div>
    </div>
  );
}
