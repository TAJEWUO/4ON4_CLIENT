"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { postAuth } from "@/lib/auth-api";

export default function LoginPage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    const { ok, data } = await postAuth("/api/auth/login", {
      phone,
      password,
    });

    setLoading(false);

    if (!ok) {
      setMsg(data.message || "Login failed. Check your phone and password.");
      return;
    }

    // TEMP: Save user id locally so dashboard can load profile/vehicles
    // We'll later replace this with full NextAuth session.
    if (data.user && data.user._id) {
      localStorage.setItem("fouron4_user_id", data.user._id);
    }

    router.push("/user/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md p-6 border rounded-xl shadow">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block mb-1">Phone Number</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              placeholder="e.g. 07xx xxx xxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {msg && <p className="text-center text-red-600 text-sm">{msg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-md"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-4 text-sm">
          <a href="/auth/forgot-password" className="text-blue-600">
            Forgot Password?
          </a>
        </div>

        <div className="text-center mt-2 text-sm">
          Don&apos;t have an account?{" "}
          <a href="/auth/register" className="text-blue-600">
            Register
          </a>
        </div>
      </div>
    </div>
  );
}
