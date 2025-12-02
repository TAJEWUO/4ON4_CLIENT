// app/user/auth/verify-otp/form.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { postAuth } from "@/lib/auth-api";

const OTP_LENGTH = 6;
const OTP_EXPIRY_SECONDS = 120;

export default function VerifyOtpForm() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(OTP_EXPIRY_SECONDS);

  // Load email from localStorage
  useEffect(() => {
    setEmail(localStorage.getItem("fouron4_auth_email"));
  }, []);

  // Countdown timer
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [secondsLeft]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");

    if (!email) {
      setMsg("Missing email. Please start again.");
      return;
    }

    if (secondsLeft <= 0) {
      setMsg("OTP expired. Please request a new code.");
      return;
    }

    const code = otp.join("");
    if (code.length !== OTP_LENGTH) {
      setMsg("Enter all 6 digits.");
      return;
    }

    setLoading(true);

    // 🔥 Correct backend route
    const { ok, data } = await postAuth("/api/auth/verify-email-code", {
      email,
      code,
    });

    setLoading(false);

    if (!ok) {
      setMsg(data?.message || "Invalid or expired OTP.");
      return;
    }

    // OTP valid → continue to create account
    router.push("/user/auth/create-account");
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < OTP_LENGTH - 1) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const minutes = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-white text-black px-4"
      style={{ fontFamily: 'Candara, "Candara Light", system-ui, sans-serif' }}
    >
      <div className="w-full max-w-md bg-white/95 border border-black/20 rounded-2xl shadow-sm px-6 py-8 md:px-8 md:py-10">
        <div className="text-center mb-4">
          <div className="text-3xl font-extrabold tracking-wide mb-2">4ON4</div>
          <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold tracking-wide">
            DRIVER ACCOUNT
          </span>
        </div>

        <h1 className="text-xl font-semibold text-center mb-2">Verify OTP</h1>

        {email && (
          <p className="text-center text-xs text-gray-600 mb-4">
            Code sent to <span className="font-semibold">{email}</span>
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex justify-center gap-3 mb-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                className="w-10 h-12 border border-black/40 rounded-md text-center text-xl bg-white/95 focus:outline-none focus:ring-2 focus:ring-black"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
              />
            ))}
          </div>

          <p className="text-center text-xs text-gray-600">
            OTP expires in{" "}
            <span className="font-semibold">
              {minutes}:{secs.toString().padStart(2, "0")}
            </span>
          </p>

          {msg && <p className="text-center text-sm text-red-600">{msg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 rounded-md bg-black text-white text-sm font-semibold tracking-wide"
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </form>
      </div>
    </div>
  );
}
