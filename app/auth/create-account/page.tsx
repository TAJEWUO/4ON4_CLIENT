"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { postAuth } from "@/lib/auth-api";

export default function CreateAccountPage() {
  const router = useRouter();
  const params = useSearchParams();

  const email = params.get("email");
  const token = params.get("token");

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Basic validation to ensure email + token exist
  useEffect(() => {
    if (!email || !token) {
      setMsg("Invalid session. Please restart registration.");
    }
  }, [email, token]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");

    if (!phone.startsWith("0") && !phone.startsWith("+")) {
      setMsg("Enter a valid phone number.");
      return;
    }

    if (password.length < 6) {
      setMsg("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirm) {
      setMsg("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { ok, data } = await postAuth("/api/auth/create-account", {
      email,
      token,
      phone,
      password,
    });

    setLoading(false);

    if (!ok) {
      setMsg(data.message || "Failed to create account.");
      return;
    }

    // TEMP: Store user ID locally until NextAuth replaces it
    if (data.user && data.user._id) {
      localStorage.setItem("fouron4_user_id", data.user._id);
    }

    router.push("/user/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md p-6 border rounded-xl shadow">
        
        <h1 className="text-2xl font-bold text-center mb-6">
          Complete Your Account
        </h1>

        <p className="text-center text-gray-600 text-sm mb-4">
          Email verified: <strong>{email}</strong>
        </p>

        <form onSubmit={handleCreate} className="space-y-5">

          <div>
            <label className="block mb-1 font-medium">Phone Number</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              placeholder="07xx xxx xxx or +2547xx xxx xxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Confirm Password</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded"
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          {msg && <p className="text-center text-sm text-red-600">{msg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-md"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

      </div>
    </div>
  );
}
