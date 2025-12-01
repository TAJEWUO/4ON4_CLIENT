"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { postAuth } from "@/lib/auth-api";

export default function CreatePasswordForm() {
  const router = useRouter();
  const params = useSearchParams();

  const email = params.get("email");
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setMsg("");

    if (!email || !token) {
      setMsg("Invalid session. Restart registration.");
      return;
    }

    if (password.length < 4) {
      setMsg("Password must be at least 4 characters.");
      return;
    }

    if (password !== confirm) {
      setMsg("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { ok, data } = await postAuth("/api/auth/register-set-password", {
      token,
      password,
      confirmPassword: confirm,
    });

    setLoading(false);

    if (!ok) {
      setMsg(data.message || "Something went wrong.");
      return;
    }

    router.push("/user/auth/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md p-6 border rounded-xl shadow">
        <h1 className="text-2xl font-bold text-center mb-4">
          Create Password
        </h1>

        <p className="text-center text-gray-600 text-sm mb-6">
          Email verified: <strong>{email}</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          {msg && (
            <p className="text-center text-red-600 text-sm">{msg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-md"
          >
            {loading ? "Saving…" : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
