"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { postAuth } from "@/lib/auth-api";

export default function LoginPage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState(["", "", "", ""]);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  // Normalize phone number input
  const normalizePhoneForLogin = (raw: string) => {
    const digits = raw.replace(/\D/g, "");

    if (digits.startsWith("07") || digits.startsWith("01"))
      return digits.slice(0, 10);

    if (digits.startsWith("7")) return "07" + digits.slice(1, 9);
    if (digits.startsWith("1")) return "01" + digits.slice(1, 9);

    return digits;
  };

  const handlePinChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;

    const updated = [...pin];
    updated[i] = val;
    setPin(updated);

    if (val && i < 3) inputsRef.current[i + 1]?.focus();
  };

  const handlePinKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !pin[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);

    setPin(["", "", "", ""]);
    inputsRef.current[0]?.focus();
  };

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");

    const formatted = normalizePhoneForLogin(phone);

    if (formatted.length !== 10) {
      setMsg("Enter a valid Kenyan phone number.");
      return;
    }

    const fullPin = pin.join("");
    if (fullPin.length !== 4) {
      setMsg("Enter your 4-digit PIN.");
      return;
    }

    setLoading(true);

    const { ok, data } = await postAuth("/api/auth/login", {
      phone: formatted,
      password: fullPin,
    });

    setLoading(false);

    if (!ok) {
      setMsg(data.message || "Incorrect phone or PIN.");
      triggerShake();
      return;
    }

    if (data.user?.id) {
      localStorage.setItem("fouron4_user_id", data.user.id);
    }

    router.push("/user/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md p-6 border rounded-xl shadow">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

        <form onSubmit={handleLogin} className="space-y-6">

          <div>
            <label className="block mb-1 font-medium">ENTER PHONE NUMBER</label>

            <div className="flex items-center gap-2">
              <span className="px-3 py-2 border rounded bg-gray-100">+254</span>

              <input
                type="text"
                className="flex-1 border px-3 py-2 rounded"
                placeholder="07xxxxxxxx or 7xxxxxxxx"
                value={phone}
                maxLength={10}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              />
            </div>
          </div>


          <div>
            <label className="block mb-1 font-medium">ENTER PIN</label>

            <div
              className={`flex gap-3 justify-center ${
                shake ? "animate-shake" : ""
              }`}
            >
              {pin.map((p, i) => (
                <input
                  key={i}
                  type="password"
                  maxLength={1}
                  value={p}
                  ref={(el) => {
                    inputsRef.current[i] = el;
                  }}
                  className="w-12 h-12 border text-center text-xl rounded"
                  onChange={(e) => handlePinChange(i, e.target.value)}
                  onKeyDown={(e) => handlePinKeyDown(i, e)}
                />
              ))}
            </div>
          </div>

          {msg && <p className="text-center text-red-600 text-sm">{msg}</p>}

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

