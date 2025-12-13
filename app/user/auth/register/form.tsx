"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { startVerify } from "@/lib/auth-api";

function normalizeLocalPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("07") || digits.startsWith("01")) {
    return digits.slice(0, 10);
  }
  if (digits.startsWith("7") || digits.startsWith("1")) {
    return digits.slice(0, 9);
  }
  return digits.slice(0, 10);
}

export default function RegisterForm() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");

    const cleaned = normalizeLocalPhone(phone);
    if (cleaned.length < 9) {
      setMsg("Enter a valid Kenyan phone (07.. / 01.. / 7.. / 1..)");
      return;
    }

    setLoading(true);
   const { ok, data } = await startVerify(cleaned);

    setLoading(false);

    if (!ok) {
      setMsg(data?.message || "Failed to send verification code.");
      return;
    }

    localStorage.setItem("fouron4_auth_phone", cleaned);
    localStorage.setItem("fouron4_auth_mode", "register");

    router.push("/user/auth/verify-otp");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black px-4" style={{ fontFamily: 'Candara, "Candara Light", system-ui, sans-serif' }}>
      <div className="w-full max-w-md bg-white/95 border border-black/20 rounded-2xl shadow-sm px-6 py-8 md:px-8 md:py-10">
        <div className="text-center mb-6">
          <div className="text-3xl font-extrabold tracking-wide mb-2">4ON4</div>
          <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold tracking-wide">DRIVER ACCOUNT</span>
        </div>

        <h1 className="text-xl font-semibold text-center mb-4">Register - Phone</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Enter Phone Number</label>
            <div className="flex items-center gap-2">
              <span className="px-3 py-2 border border-black/30 rounded-md bg-white/80 text-sm">+254</span>
              <input
                type="tel"
                inputMode="numeric"
                className="flex-1 border border-black/30 rounded-md px-3 py-2 bg-white/90 focus:outline-none text-sm"
                placeholder="7xxxxxxxx or 1xxxxxxxx"
                value={phone}
                maxLength={10}
                onChange={(e) => setPhone(normalizeLocalPhone(e.target.value))}
              />
            </div>
          </div>

          {msg && <p className="text-center text-sm text-red-600 leading-snug">{msg}</p>}

          <button type="submit" disabled={loading} className="w-full mt-2 py-2.5 rounded-md bg-black text-white text-sm font-semibold disabled:opacity-60"> {loading ? "Sending..." : "Send Verification Code"} </button>
        </form>

        <p className="mt-5 text-center text-xs">
          Already have an account? <a href="/user/auth/login" className="text-blue-700 hover:underline">Log in</a>
        </p>
      </div>
    </div>
  );
}
