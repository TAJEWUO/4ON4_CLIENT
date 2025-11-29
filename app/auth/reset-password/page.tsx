"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { postAuth } from "@/lib/auth-api";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();

  const token = params.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Invalid or expired reset link.
      </div>
    );
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      setMsg("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirm) {
      setMsg("Passwords do not match.");
      return;
    }

    setLoading(true);
    setMsg("");

    const { ok, data } = await postAuth("/api/auth/reset-password", {
      token,
      newPassword,
    });

    setLoading(false);

    if (!ok) {
      setMsg(data.message || "Failed to reset password.");
      return;
    }

    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md p-6 border rounded-xl shadow">
        
        <h1 className="text-2xl font-bold text-center mb-6">
          Reset Your Password
        </h1>

        <form onSubmit={handleReset} className="space-y-5">
          
          <div>
            <label className="block mb-1 font-medium">New Password</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Confirm Password</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded"
              placeholder="Confirm new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          {msg && <p className="text-red-600 text-center text-sm">{msg}</p>}

          <button
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-md"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

        </form>

      </div>
    </div>
  );
}
