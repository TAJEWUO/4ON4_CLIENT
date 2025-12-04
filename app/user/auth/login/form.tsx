// app/user/auth/login/form.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/auth-api";

export default function LoginForm() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Normalize like backend: 07xxxxxxx / 01xxxxxxx / 7xxxxxxx / 1xxxxxxx
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

    const cleanedPhone = normalizePhone(phone);

    if (cleanedPhone.length !== 10) {
      setMsg("Enter a valid Kenyan phone number (07.. or 01..).");
      return;
    }

    if (pin.length !== 4) {
      setMsg("PIN must be 4 digits.");
      return;
    }

    setLoading(true);

    const { ok, data } = await login(cleanedPhone, pin);

    setLoading(false);

    if (!ok) {
      // Clear PIN on error
      setPin("");
      setMsg(data?.message || "Wrong phone or PIN.");
      // Focus PIN field again
      const pinInput = document.getElementById("pin-input") as HTMLInputElement | null;
      pinInput?.focus();
      return;
    }

    if (data?.user?.id) {
      localStorage.setItem("fouron4_user_id", data.user.id);
    }
    if (data?.accessToken) {
      localStorage.setItem("fouron4_access", data.accessToken);
    }
    if (data?.refreshToken) {
      localStorage.setItem("fouron4_refresh", data.refreshToken);
    }

    router.push("/user/dashboard");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-white text-black px-4"
      style={{ fontFamily: 'Candara, "Candara Light", system-ui, sans-serif' }}
    >
      <div className="w-full max-w-md bg-white/95 border border-black/20 rounded-2xl shadow-sm px-6 py-8 md:px-8 md:py-10 transition-transform duration-150 hover:-translate-y-0.5">
        <div className="text-center mb-6">
          <div className="text-3xl font-extrabold tracking-wide mb-2">
            4ON4
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold tracking-wide">
            DRIVER ACCOUNT
          </span>
        </div>

        <h1 className="text-xl font-semibold text-center mb-4">
          Log In
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* PHONE NUMBER */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <div className="flex items-center gap-2">
              <span className="px-3 py-2 border border-black/30 rounded-md bg-white text-sm">
                +254
              </span>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                className="flex-1 border border-black/30 rounded-md px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black/70 focus:border-black"
                placeholder="7xxxxxxxx or 1xxxxxxxx"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, ""))
                }
              />
            </div>
          </div>

          {/* PIN (single field, show/hide) */}
          <div>
            <label className="block text-sm font-medium mb-1">
              PIN
            </label>
            <div className="flex items-center border border-black/30 rounded-md bg-white px-3 py-2">
              <input
                id="pin-input"
                type={showPin ? "text" : "password"}
                inputMode="numeric"
                maxLength={4}
                className="flex-1 bg-transparent outline-none text-sm tracking-[0.5em]"
                placeholder="••••"
                value={pin}
                onChange={(e) =>
                  setPin(e.target.value.replace(/\D/g, ""))
                }
              />
              <button
                type="button"
                onClick={() => setShowPin((prev) => !prev)}
                className="ml-2 text-xs text-gray-600 hover:text-black"
              >
                {showPin ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {msg && (
            <p className="text-center text-sm text-red-600 leading-snug">
              {msg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 rounded-md bg-black text-white text-sm font-semibold tracking-wide disabled:opacity-60 disabled:cursor-not-allowed transition-transform duration-150 hover:-translate-y-0.5"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs">
          Forgot PIN?{" "}
          <a
            href="/user/auth/forgot-pin"
            className="text-blue-700 hover:underline"
          >
            Reset PIN
          </a>
        </p>

        <p className="mt-2 text-center text-xs">
          Don’t have an account?{" "}
          <a
            href="/user/auth/register"
            className="text-blue-700 hover:underline"
          >
            Create Account
          </a>
        </p>
      </div>
    </div>
  );
}
