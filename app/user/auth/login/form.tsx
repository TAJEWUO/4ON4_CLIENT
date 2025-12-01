"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { postAuth } from "@/lib/auth-api";

export default function LoginForm() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState(["", "", "", ""]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const normalizePhone = (raw: string) => {
    const d = raw.replace(/\D/g, "");
    if (d.startsWith("07") || d.startsWith("01")) return d.slice(0, 10);
    if (d.startsWith("7")) return "07" + d.slice(1, 9);
    if (d.startsWith("1")) return "01" + d.slice(1, 9);
    return d;
  };

  const handlePinChange = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;

    const updated = [...pin];
    updated[i] = v;
    setPin(updated);

    if (v && i < 3) {
      // move to next input
      document.getElementById(`login-pin-${i + 1}`)?.focus();
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");

    const formatted = normalizePhone(phone);
    if (formatted.length !== 10)
      return setMsg("Enter a valid phone number.");

    const fullPin = pin.join("");
    if (fullPin.length !== 4)
      return setMsg("Enter your 4-digit PIN.");

    setLoading(true);

    const { ok, data } = await postAuth("/api/auth/login", {
      phone: formatted,
      password: fullPin,
    });

    setLoading(false);

    if (!ok) {
      setMsg(data.message || "Incorrect phone or PIN.");
      return;
    }

    localStorage.setItem("fouron4_user_id", data.user.id);
    router.push("/user/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md p-6 border rounded-xl shadow">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

        <form onSubmit={handleLogin} className="space-y-6">

          {/* PHONE */}
          <div>
            <label className="block mb-1 font-medium">
              ENTER PHONE NUMBER
            </label>
            <div className="flex items-center gap-2">
              <span className="px-3 py-2 border rounded bg-gray-100">+254</span>

              <input
                type="text"
                className="flex-1 border px-3 py-2 rounded"
                maxLength={10}
                placeholder="07xxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              />
            </div>
          </div>

          {/* PIN */}
          <div>
            <label className="block mb-1 font-medium">ENTER PIN</label>
            <div className="flex gap-3 justify-center">
              {pin.map((p, i) => (
                <input
                  key={i}
                  id={`login-pin-${i}`}
                  type="password"
                  maxLength={1}
                  value={p}
                  className="w-12 h-12 border text-center text-xl rounded"
                  onChange={(e) =>
                    handlePinChange(i, e.target.value)
                  }
                />
              ))}
            </div>
          </div>

          {msg && (
            <p className="text-center text-red-600 text-sm">{msg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-md"
          >
            {loading ? "Checking..." : "Login"}
          </button>
        </form>

        <div className="text-center text-sm mt-4">
          <a href="/user/auth/forgot-password" className="text-blue-600">
            Forgot PIN?
          </a>
        </div>

        <div className="text-center text-sm mt-2">
          New User?{" "}
          <a href="/user/auth/register" className="text-blue-600">
            Create Account
          </a>
        </div>
      </div>
    </div>
  );
}
