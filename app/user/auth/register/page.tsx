"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRegister } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");

    if (!identifier || !password || !confirm) {
      setError("Fill all fields");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    const result = await apiRegister({ identifier, password });

    if (!result.success) {
      setError(result.message || "Registration failed");
      return;
    }

    router.push("/user/auth");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md border border-black rounded-3xl p-8 bg-white">
        <h1 className="text-3xl font-bold mb-2 text-center">Create Account</h1>

        {error && (
          <div className="text-red-600 bg-red-100 border p-2 rounded mb-4 text-sm text-center">
            {error}
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
          placeholder="Password (4 characters)"
          maxLength={4}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          className="w-full border rounded-xl px-3 py-2 mb-5"
          placeholder="Confirm Password"
          maxLength={4}
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-black text-white rounded-xl py-3"
        >
          Create Account
        </button>

        <button
          onClick={() => router.push("/user/auth")}
          className="mt-3 text-xs underline block text-center"
        >
          Already have an account? Log in
        </button>
      </div>
    </div>
  );
}
