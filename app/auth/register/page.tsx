"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { postAuth } from "@/lib/auth-api";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStartRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");

    setLoading(true);

    const { ok, data } = await postAuth("/api/auth/start-registration", {
      email,
    });

    setLoading(false);

    if (!ok) {
      setMsg(data.message || "Failed to start registration.");
      return;
    }

    router.push(`/auth/verify-email?email=${email}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md p-6 border rounded-xl shadow">
        <h1 className="text-2xl font-bold text-center mb-6">
          Create Account
        </h1>

        <form onSubmit={handleStartRegistration} className="space-y-5">
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

          {msg && <p className="text-sm text-red-600 text-center">{msg}</p>}

          <button
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-md"
          >
            {loading ? "Sending..." : "Verify Email"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <a href="/auth/login" className="text-blue-600">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
