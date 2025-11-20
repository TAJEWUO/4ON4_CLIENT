"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiResetPassword } from "@/lib/api";

export default function ResetPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleReset = async () => {
    setError("");

    if (!identifier || !newPassword || !confirm) {
      setError("Fill all fields");
      return;
    }

    if (newPassword !== confirm) {
      setError("Passwords do not match");
      return;
    }

    const result = await apiResetPassword(identifier, newPassword);

    if (!result.success) {
      setError(result.message || "Reset failed");
      return;
    }

    setDone(true);
    setTimeout(() => router.push("/user/auth"), 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md border rounded-3xl p-8 bg-white">
        <h1 className="text-2xl font-bold mb-3 text-center">Reset Password</h1>

        {error && (
          <div className="text-red-600 bg-red-100 p-2 rounded text-sm mb-4 text-center">
            {error}
          </div>
        )}

        {done && (
          <div className="text-green-600 bg-green-100 p-2 rounded text-sm mb-4 text-center">
            Password reset successful!
          </div>
        )}

        <input
          className="w-full border rounded-xl px-3 py-2 mb-3"
          placeholder="Phone or Email"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />

        <input
          className="w-full border rounded-xl px-3 py-2 mb-3"
          placeholder="New Password (4 characters)"
          type="password"
          maxLength={4}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <input
          className="w-full border rounded-xl px-3 py-2 mb-5"
          placeholder="Confirm Password"
          type="password"
          maxLength={4}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button
          onClick={handleReset}
          className="w-full bg-black text-white rounded-xl py-3"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}
