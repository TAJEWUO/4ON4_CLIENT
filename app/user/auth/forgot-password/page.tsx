"use client";

import { useState } from "react";
import { postAuth } from "@/lib/auth-api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    const { ok, data } = await postAuth("/api/auth/reset-start", { email });

    setLoading(false);

    setMsg(
      data.message ||
        "If that email is registered, a reset link has been sent."
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md p-6 border rounded-xl shadow">
        <h1 className="text-2xl font-bold text-center mb-6">
          Forgot PIN
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium">Email Address</label>
            <input
              type="email"
              className="w-full border px-3 py-2 rounded"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {msg && (
            <p className="text-blue-600 text-center text-sm">{msg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-md"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Remember your PIN?{" "}
          <a href="/user/auth/login" className="text-blue-600">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
