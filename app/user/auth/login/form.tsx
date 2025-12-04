"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/auth-api";

export default function LoginForm() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const normalizeLocalPhone = (value: string) => {
    let v = value.replace(/\D/g, "");
    if (v.startsWith("07") || v.startsWith("01")) {
      return v.slice(1);
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");

    if (pin.length !== 4) {
      setMsg("PIN must be 4 digits.");
      return;
    }

    let local = normalizeLocalPhone(phone);
    if (local.length !== 9) {
      setMsg("Enter valid phone number.");
      return;
    }

    const fullPhone = `+254${local}`;

    setLoading(true);
    const { ok, data } = await loginUser(fullPhone, pin);
    setLoading(false);

    if (!ok) {
      setMsg(data?.message || "Incorrect phone or PIN.");
      return;
    }

    router.push("/user/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-6 border rounded-xl shadow-sm">
        <h1 className="text-xl font-semibold text-center mb-4">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="text"
              maxLength={10}
              className="w-full border px-3 py-2 rounded-md"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">PIN</label>
            <input
              type="password"
              maxLength={4}
              className="w-full border px-3 py-2 rounded-md"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
          </div>

          {msg && <p className="text-red-600 text-center text-sm">{msg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-black text-white rounded-md"
          >
            {loading ? "Checking..." : "Login"}
          </button>

          <p className="text-center text-xs mt-2">
            Forgot PIN?{" "}
            <a href="/user/auth/forgot-pin" className="text-blue-600">
              Reset here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
