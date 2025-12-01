// app/user/auth/register/form.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { postAuth } from "@/lib/auth-api";

export default function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");

    if (!email || !email.includes("@")) {
      setMsg("Enter a valid email address.");
      return;
    }

    setLoading(true);

    const { ok, data } = await postAuth("/api/auth/register-start", {
      email,
    });

    setLoading(false);

    if (!ok) {
      setMsg(data?.message || "Failed to send verification code.");
      return;
    }

    // Save email + mode for verify-otp
    localStorage.setItem("fouron4_auth_email", email);
    localStorage.setItem("fouron4_verify_mode", "register");

    router.push("/user/auth/verify-otp");
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
          Register - Email
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">
              Enter Email
            </label>
            <div className="border border-black/30 rounded-md bg-white/90 px-3 py-2">
              <input
                type="email"
                className="w-full bg-transparent outline-none text-sm"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
              />
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
            {loading ? "Sending..." : "Send Verification Code"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs">
          Already have an account?{" "}
          <a href="/user/auth/login" className="text-blue-700 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
