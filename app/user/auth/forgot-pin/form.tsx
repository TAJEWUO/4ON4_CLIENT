"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { startVerify } from "@/lib/auth-api";

export default function ForgotPinForm() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");

    if (!phone) {
      setMsg("Enter your phone number.");
      return;
    }

    setLoading(true);
    const { ok, data } = await startVerify(phone, "reset");
    setLoading(false);

    if (!ok) {
      setMsg(data?.message || "Failed to send OTP.");
      return;
    }

    localStorage.setItem("fouron4_auth_phone", phone);
    localStorage.setItem("fouron4_auth_mode", "reset");

    router.push("/user/auth/verify-reset");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 text-black"
      style={{ fontFamily: 'Candara, "Candara Light", system-ui, sans-serif' }}>
      
      <div className="w-full max-w-md bg-white/95 border border-black/20 rounded-2xl shadow-md px-6 py-8">
        <h1 className="text-xl font-semibold text-center mb-4">Forgot PIN</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <div className="border border-black/30 rounded-md bg-white px-3 py-2">
              <input
                type="tel"
                className="w-full bg-transparent outline-none text-sm"
                placeholder="07xx xxx xxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value.trim())}
              />
            </div>
          </div>

          {msg && <p className="text-center text-sm text-red-600">{msg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-md bg-black text-white font-semibold disabled:opacity-60">
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>

        <p className="text-center text-xs mt-4">
          Remember your PIN?{" "}
          <a href="/user/auth/login" className="text-blue-700 underline">Login</a>
        </p>
      </div>
    </div>
  );
}
