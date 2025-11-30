"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { postAuth } from "@/lib/auth-api";

export default function LoginPage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState(["", "", "", ""]);
  const inputsRef = useRef<HTMLInputElement[]>([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle PIN input logic
  const handlePinChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // accept only digits

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // auto focus next box
    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handlePinKeyDown = (index: number, e: any) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");

    if (!phone.startsWith("07") && !phone.startsWith("01")) {
      setMsg("Phone number must start with 07 or 01.");
      return;
    }

    if (phone.length !== 10) {
      setMsg("Enter a valid 10-digit phone number.");
      return;
    }

    const fullPin = pin.join("");
    if (fullPin.length !== 4) {
      setMsg("Enter your 4-digit PIN.");
      return;
    }

    setLoading(true);

    const { ok, data } = await postAuth("/api/auth/login", {
      identifier: phone,
      password: fullPin,
    });

    setLoading(false);

    if (!ok) {
      setMsg(data.message || "Incorrect phone or PIN. Check again.");
      return;
    }

    if (data.user && data.user.id) {
      localStorage.setItem("fouron4_user_id", data.user.id);
    }

    router.push("/user/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md p-6 border rounded-xl shadow">

        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

        <form onSubmit={handleLogin} className="space-y-6">

          {/* PHONE FIELD */}
          <div>
            <label className="block mb-1 font-medium">ENTER PHONE NUMBER</label>

            <div className="flex items-center gap-2">
              <span className="px-3 py-2 border rounded bg-gray-100">+254</span>

              <input
                type="text"
                className="flex-1 border px-3 py-2 rounded"
                placeholder="07xxxxxxxx"
                value={phone}
                maxLength={10}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "");
                  setPhone(v);
                }}
                required
              />
            </div>
          </div>

          {/* PIN FIELD */}
          <div>
            <label className="block mb-1 font-medium">ENTER PIN</label>

            <div className="flex gap-3 justify-center">
              {pin.map((p, i) => (
                <input
                  key={i}
                  type="password"
                  maxLength={1}
                  value={p}
                  ref={(el) => {
                    if (el) inputsRef.current[i] = el;
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
