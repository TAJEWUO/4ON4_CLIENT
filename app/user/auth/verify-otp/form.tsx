"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkVerify } from "@/lib/auth-api";

export default function VerifyOtpForm() {
  const router = useRouter();

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [token, setToken] = useState<string | null>(null);
  const [storedPhone, setStoredPhone] = useState<string | null>(null);

  // Load saved phone + token
  useEffect(() => {
    setStoredPhone(localStorage.getItem("fouron4_auth_phone"));
    setToken(localStorage.getItem("fouron4_register_token"));
  }, []);

  // Handle OTP digit input
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      next?.focus();
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
      prev?.focus();
    }
  };

  // Submit OTP → backend checkVerify()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");

    if (!token) {
      setMsg("Missing verification token. Please restart registration.");
      return;
    }

    const code = otp.join("");

    if (code.length !== 6) {
      setMsg("Enter all 6 digits.");
      return;
    }

    setLoading(true);

    const { ok, data } = await checkVerify(code, token);

    setLoading(false);

    if (!ok) {
      setMsg(data?.message || "Incorrect verification code.");
      return;
    }

    // OTP verified — continue to create-account page
    router.push("/user/auth/create-account");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-white px-4"
      style={{ fontFamily: 'Candara, "Candara Light", system-ui, sans-serif' }}
    >
      <div className="w-full max-w-md bg-white border border-black/20 rounded-2xl shadow-sm px-6 py-8 md:px-8 md:py-10">

        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold tracking-wide mb-2">4ON4</h1>
          <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold tracking-wide">
            DRIVER ACCOUNT
          </span>
        </div>

        <h2 className="text-xl font-semibold text-center mb-4">Verify Code</h2>

        {storedPhone && (
          <p className="text-center text-xs text-gray-600 mb-4">
            Code sent to: <span className="font-semibold">+254 {storedPhone.slice(-9)}</span>
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* OTP DIGITS */}
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className="w-10 h-12 border border-black/40 rounded-md text-center text-xl bg-white focus:outline-none focus:ring-2 focus:ring-black"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
              />
            ))}
          </div>

          {/* ERROR */}
          {msg && <p className="text-center text-sm text-red-600">{msg}</p>}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-md bg-black text-white text-sm font-semibold tracking-wide disabled:opacity-60"
          >
            {loading ? "Checking..." : "Verify"}
          </button>

          {/* BACK */}
          <p className="text-center text-xs mt-3">
            Entered wrong number?{" "}
            <a href="/user/auth/register" className="text-blue-700 hover:underline">
              Start again
            </a>
          </p>

        </form>
      </div>
    </div>
  );
}
