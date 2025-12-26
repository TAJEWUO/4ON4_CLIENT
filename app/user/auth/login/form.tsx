"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth-api";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginForm() {
  const router = useRouter();
  const { setAuth } = useAuth();

  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const normalizePhone = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    const tail9 = digits.replace(/^0+/, "").slice(-9);
    if (tail9.length !== 9) return null;
    return "+254" + tail9;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");

    const fullPhone = normalizePhone(phone);
    if (!fullPhone) {
      setMsg("Enter a valid Kenyan phone number.");
      return;
    }

    if (pin.length !== 4) {
      setMsg("PIN must be 4 digits.");
      return;
    }

    setLoading(true);
    console.log("[LOGIN FORM] Calling login API with:", fullPhone);
    const { ok, data } = await login(fullPhone, pin);
    console.log("[LOGIN FORM] Login result:", { ok, data });
    setLoading(false);

    if (!ok) {
      setMsg(data?.message || "Incorrect phone or PIN.");
      return;
    }

    // Save token to memory context
    if (data?.token && data?.user?.id) {
      console.log("[LOGIN FORM] Saving token to AuthContext");
      
      // Store refresh token if provided
      if (data.refreshToken) {
        localStorage.setItem("fouron4_refresh", data.refreshToken);
        console.log("[LOGIN FORM] Stored refresh token");
      }
      
      // Set auth state (this also saves to localStorage)
      setAuth(data.token, data.user.id);
      
      console.log("[LOGIN FORM] Redirecting to /user/app");
      router.replace("/user/app");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-white px-4"
      style={{ fontFamily: 'Candara, "Candara Light", system-ui, sans-serif' }}
    >
      <div className="w-full max-w-md bg-white/95 border border-black/20 rounded-2xl shadow-sm px-6 py-8">
        <div className="text-center mb-6">
          <div className="text-3xl font-extrabold tracking-wide mb-2">4ON4</div>
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold tracking-wide">
            DRIVER ACCOUNT
          </span>
        </div>

        <h1 className="text-xl font-semibold text-center mb-4">Log In</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-black/80 mb-1">Enter Phone Number</label>
            <div className="flex items-center border border-black/20 rounded-lg px-3 py-2 bg-white">
              <span className="text-black/70 text-sm pr-2 border-r border-black/10">+254</span>
              <input
                type="text"
                inputMode="numeric"
                maxLength={10}
                className="flex-1 pl-3 bg-transparent outline-none text-black"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder=""
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-black/80 mb-1">Enter PIN</label>
            <div className="relative border border-black/20 rounded-lg px-3 py-2 bg-white">
              <input
                type={showPin ? "text" : "password"}
                inputMode="numeric"
                maxLength={4}
                className="w-full bg-transparent outline-none text-lg tracking-widest"
                placeholder=""
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              />
              <button
                type="button"
                onClick={() => setShowPin((p) => !p)}
                className="absolute right-3 top-2 text-xs text-gray-1500 hover:text-green-700"
              >
                {showPin ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {msg && <p className="text-center text-sm text-red-600">{msg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-black text-white text-sm tracking-wide font-medium disabled:opacity-60"
          >
            {loading ? "Checking..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs">
          Forgot PIN? <a href="/user/auth/forgot-pin" className="text-blue-700 ">Reset PIN</a>
        </p>

        <p className="mt-4 text-center text-xs">
          Don’t have an account? <a href="/user/auth/register" className="text-blue-600 ">Create Account</a>
        </p>
      </div>
    </div>
  );
}
