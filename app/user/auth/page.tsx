"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiLogin } from "@/lib/api";

export default function AuthPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!identifier || !password) {
      setError("Enter phone/email and password.");
      return;
    }

    try {
      const result = await apiLogin(identifier, password);

      if (!result.success) {
        setError(result.message || "Wrong login details");
        return;
      }

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("fouron4_user_id", result.user._id);

      router.push("/user/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black p-6">

      <div className="w-full max-w-md border border-black rounded-3xl p-8 bg-white shadow-sm">

        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold tracking-wide">4ON4</h1>
          <p className="text-xs text-gray-600 mt-1">powered by trust</p>
        </div>

        <h2 className="text-lg text-center font-semibold mb-4">Login</h2>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 border border-red-300 p-2 rounded mb-3 text-center">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="text-xs mb-1 block">Phone number or email</label>
          <input
            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
            placeholder="+2547... or email@gmail.com"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="text-xs mb-1 block">Password (4 characters)</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              maxLength={4}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          onClick={handleLogin}
          className="w-full py-3 bg-black text-white rounded-xl mt-2 hover:bg-gray-900"
        >
          Log In
        </button>

        <div className="mt-4 flex flex-col items-center gap-1">
          <button
            onClick={() => router.push("/user/auth/reset")}
            className="text-xs underline"
          >
            Forgot password?
          </button>

          <button
            onClick={() => router.push("/user/auth/register")}
            className="text-xs underline"
          >
            Create account
          </button>
        </div>
      </div>

      <p className="text-[10px] text-gray-500 mt-4">
        © 4ON4 Group Limited
      </p>
    </div>
  );
}
