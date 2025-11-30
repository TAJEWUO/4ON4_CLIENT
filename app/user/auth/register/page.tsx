"use client";

import { useState } from "react";
import { postAuth } from "@/lib/auth-api";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    const { ok, data } = await postAuth("/api/auth/register-start", { email });

    setLoading(false);

    if (!ok) {
      setMsg(data.message || "Failed to send verification email.");
      return;
    }

    setMsg(
      data.message ||
        "Verification link sent. Please check your email inbox."
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md p-6 border rounded-xl shadow space-y-4">
        <h1 className="text-2xl font-bold text-center">Create Account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          {msg && <p className="text-center text-sm text-blue-600">{msg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-md"
          >
            {loading ? "Sending..." : "Send Verification Link"}
          </button>
        </form>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <a href="/user/auth/login" className="text-blue-600">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
