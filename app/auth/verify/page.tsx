"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { postAuth } from "@/lib/auth-api";

export default function VerifyEmailPage() {
  const router = useRouter();
  const params = useSearchParams();
  const emailParam = params.get("email");

  const [email, setEmail] = useState(emailParam || "");
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!emailParam) {
      setMsg("Missing email. Restart registration.");
    }
  }, [emailParam]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    const { ok, data } = await postAuth("/api/auth/verify-email", {
      email,
      code,
    });

    setLoading(false);

    if (!ok) {
      setMsg(data.message || "Verification failed.");
      return;
    }

    router.push(`/auth/create-account?email=${email}&token=${data.token}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md p-6 border rounded-xl shadow">

        <h1 className="text-2xl font-bold text-center mb-6">
          Verify Your Email
        </h1>

        <p className="text-center text-gray-600 text-sm mb-4">
          Enter the code sent to <strong>{email}</strong>
        </p>

        <form onSubmit={handleVerify} className="space-y-5">
          <div>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              placeholder="6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>

          {msg && <p className="text-sm text-red-600 text-center">{msg}</p>}

          <button
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-md"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

      </div>
    </div>
  );
}
