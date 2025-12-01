// app/user/auth/login/form.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { postAuth } from "@/lib/auth-api";

const PIN_LENGTH = 4;

export default function LoginForm() {
  const router = useRouter();

  const [phoneInput, setPhoneInput] = useState("");
  const [pin, setPin] = useState<string[]>(Array(PIN_LENGTH).fill(""));
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [failedCount, setFailedCount] = useState(0);

  const normalizePhone = (raw: string) => {
    const digits = raw.replace(/\D/g, "");

    if (digits.startsWith("07") || digits.startsWith("01")) {
      return digits.slice(0, 10);
    }
    if (digits.startsWith("7")) return "07" + digits.slice(1, 9);
    if (digits.startsWith("1")) return "01" + digits.slice(1, 9);

    return digits;
  };

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...pin];
    updated[index] = value;
    setPin(updated);

    if (value && index < PIN_LENGTH - 1) {
      const next = document.getElementById(
        `login-pin-${index + 1}`
      ) as HTMLInputElement | null;
      next?.focus();
    }
  };

  const handlePinKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      const prev = document.getElementById(
        `login-pin-${index - 1}`
      ) as HTMLInputElement | null;
      prev?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");

    const local = normalizePhone(phoneInput);
    if (local.length !== 10) {
      setMsg("Enter a valid Kenyan phone number (07.. or 01..).");
      return;
    }

    const fullPin = pin.join("");
    if (fullPin.length !== PIN_LENGTH) {
      setMsg("Enter your 4-digit PIN.");
      return;
    }

    setLoading(true);

    const { ok, data } = await postAuth("/api/auth/login", {
      phone: local,
      password: fullPin,
    });

    setLoading(false);

    if (!ok) {
      setFailedCount((prev) => prev + 1);
      setMsg(data?.message || "Incorrect phone or PIN. Try again.");

      return;
    }

    if (data.user?.id) {
      localStorage.setItem("fouron4_user_id", data.user.id);
    }

    router.push("/user/dashboard");
  };

  const showHint = failedCount >= 4;

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-white text-black px-4"
      style={{ fontFamily: 'Candara, "Candara Light", system-ui, sans-serif' }}
    >
      <div className="w-full max-w-md bg-white/95 border border-black/20 rounded-2xl shadow-sm px-6 py-8 md:px-8 md:py-10 transition-transform duration-150 hover:-translate-y-0.5">
        {/* Logo + Tag */}
        <div className="text-center mb-6">
          <div className="text-3xl font-extrabold tracking-wide mb-2">
            4ON4
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold tracking-wide">
            DRIVER ACCOUNT
          </span>
        </div>

        <h1 className="text-xl font-semibold text-center mb-6">LOG IN</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Enter Phone Number
            </label>
            <div className="flex items-center gap-2">
              <span className="px-3 py-2 border border-black/30 rounded-md bg-white/80 text-sm">
                +254
              </span>
              <input
                type="tel"
                inputMode="numeric"
                className="flex-1 border border-black/30 rounded-md px-3 py-2 bg-white/90 focus:outline-none focus:ring-2 focus:ring-black/70 focus:border-black text-sm tracking-wide"
                placeholder="7xxxxxxxx or 1xxxxxxxx"
                value={phoneInput}
                maxLength={10}
                onChange={(e) =>
                  setPhoneInput(e.target.value.replace(/\D/g, ""))
                }
              />
            </div>
          </div>

          {/* PIN */}
          <div>
            <label className="block text-sm font-medium mb-1">Enter PIN</label>
            <div className="flex justify-center gap-3">
              {pin.map((value, index) => (
                <input
                  key={index}
                  id={`login-pin-${index}`}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  className="w-10 h-12 border border-black/40 rounded-md text-center text-xl bg-white/95 focus:outline-none focus:ring-2 focus:ring-black"
                  value={value}
                  onChange={(e) => handlePinChange(index, e.target.value)}
                  onKeyDown={(e) => handlePinKeyDown(index, e)}
                />
              ))}
            </div>
          </div>

          {/* Error / Hint */}
          {msg && (
            <p className="text-center text-sm text-red-600 leading-snug">
              {msg}
            </p>
          )}

          {showHint && (
            <p className="text-center text-xs text-gray-600 mt-1">
              Are you a new user?{" "}
              <a
                href="/user/auth/register"
                className="underline underline-offset-2"
              >
                Create an account
              </a>{" "}
              or{" "}
              <a
                href="/user/auth/forgot-pin"
                className="underline underline-offset-2"
              >
                reset PIN
              </a>
              .
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 rounded-md bg-black text-white text-sm font-semibold tracking-wide disabled:opacity-60 disabled:cursor-not-allowed transition-transform duration-150 hover:-translate-y-0.5"
          >
            {loading ? "Checking..." : "Log In"}
          </button>
        </form>

        <div className="mt-5 flex flex-col items-center gap-1 text-xs">
          <a
            href="/user/auth/forgot-pin"
            className="text-blue-700 hover:underline"
          >
            Forgot PIN?
          </a>
          <p>
            New user?{" "}
            <a
              href="/user/auth/register"
              className="text-blue-700 hover:underline"
            >
              Create account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
