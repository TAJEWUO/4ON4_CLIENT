"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/auth-api";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Normalize phone like your previous logic
  const normalizeLocalPhone = (value: string) => {
    let v = value.replace(/\D/g, "");
    if (v.startsWith("07") || v.startsWith("01")) v = v.slice(1);
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");

    if (pin.length !== 4) {
      setMsg("PIN must be 4 digits.");
      return;
    }

    let cleaned = normalizeLocalPhone(phone);
    if (cleaned.length < 9 || cleaned.length > 10) {
      setMsg("Enter a valid phone number.");
      return;
    }

    const fullPhone = "+254" + cleaned;

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
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center bg-white px-4"
      style={{ fontFamily: 'Candara, "Candara Light", system-ui, sans-serif' }}
    >
      {/* CONTAINER */}
      <div className="w-full max-w-md bg-white border border-black/10 rounded-2xl shadow-sm px-8 py-10 flex flex-col items-center">

        {/* LOGO */}
        <h1 className="text-4xl font-extrabold tracking-wide text-black mb-1">
          4ON4
        </h1>

        {/* DRIVER TAG */}
        <span className="px-4 py-1 rounded-full bg-green-100 text-white-700 text-xs font-medium tracking-wide mb-6">
          DRIVER ACCOUNT
        </span>

        {/* TITLE */}
        <h2 className="text-lg text-black mb-6 tracking-wide">
          LOGIN TO YOUR ACCOUNT
        </h2>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="w-full space-y-6">

          {/* PHONE INPUT */}
          <div>
            <label className="block text-sm text-black/80 mb-1">
              Enter Phone Number
            </label>

            <div className="flex items-center border border-black/20 rounded-lg px-3 py-2 bg-white">
              <span className="text-black/70 text-sm pr-2 border-r border-black/10">
                +254
              </span>

              <input
                type="text"
                inputMode="numeric"
                maxLength={9}
                className="flex-1 pl-3 text-black bg-transparent outline-none"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, ""))
                }
                placeholder=""
              />
            </div>
          </div>

          {/* PIN INPUT */}
          <div>
            <label className="block text-sm text-black/80 mb-1">
              Enter PIN
            </label>

            <div className="relative border border-black/20 rounded-lg px-3 py-2 bg-white">
              <input
                type={showPin ? "text" : "password"}
                inputMode="numeric"
                maxLength={4}
                className="w-full text-black bg-transparent outline-none tracking-widest text-lg"
                value={pin}
                onChange={(e) =>
                  setPin(e.target.value.replace(/\D/g, ""))
                }
                placeholder=""
              />

              <div
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black cursor-pointer"
              >
                {showPin ? (
                  <EyeOff size={20} className="text-black/70" />
                ) : (
                  <Eye size={20} className="text-black/70" />
                )}
              </div>
            </div>
          </div>

          {/* ERROR MESSAGE */}
          {msg && (
            <p className="text-center text-sm text-red-600">{msg}</p>
          )}

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-black text-white text-sm tracking-wide font-medium disabled:opacity-60"
          >
            {loading ? "Checking..." : "Login"}
          </button>

          {/* LINKS */}
          <div className="text-center text-xs text-black/70 mt-1">
            <a
              href="/user/auth/forgot-pin"
              className="text-blue-700 hover:underline"
            >
              Forgot PIN?
            </a>{" "}
            •{" "}
            <a
              href="/user/auth/register"
              className="text-blue-700 hover:underline"
            >
              Create New Account
            </a>
          </div>

        </form>

      </div>

      {/* FOOTER */}
      <p className="text-[10px] text-black/60 mt-8 tracking-wide text-center">
        © {new Date().getFullYear()} 4ON4 GROUP LIMITED. All rights reserved.
      </p>
    </div>
  );
}
