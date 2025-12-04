"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { resetPinComplete } from "@/lib/auth-api";

const PIN_LENGTH = 4;

export default function ResetPinForm() {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [pin, setPin] = useState(Array(PIN_LENGTH).fill(""));
  const [pinConfirm, setPinConfirm] = useState(Array(PIN_LENGTH).fill(""));
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("fouron4_reset_token");
    setToken(storedToken);
  }, []);

  const handleChange = (list: string[], setter: any, index: number, value: string, prefix: string) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...list];
    updated[index] = value;
    setter(updated);

    if (value && index < PIN_LENGTH - 1) {
      const next = document.getElementById(`${prefix}-${index + 1}`) as HTMLInputElement;
      next?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");

    if (!token) {
      setMsg("Missing verification token.");
      return;
    }

    const fullPin = pin.join("");
    const fullConfirm = pinConfirm.join("");

    if (fullPin.length !== PIN_LENGTH) {
      setMsg("PIN must be 4 digits.");
      return;
    }

    if (fullPin !== fullConfirm) {
      setMsg("PINs do not match.");
      return;
    }

    setLoading(true);
    const { ok, data } = await resetPinComplete(token, fullPin, fullConfirm);
    setLoading(false);

    if (!ok) {
      setMsg(data?.message || "Failed to reset PIN.");
      return;
    }

    // Clean local
    localStorage.removeItem("fouron4_reset_token");
    localStorage.removeItem("fouron4_auth_phone");
    localStorage.removeItem("fouron4_auth_mode");

    router.push("/user/auth/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 text-black">
      <div className="w-full max-w-md bg-white/95 border border-black/20 rounded-2xl px-6 py-8">
        <h1 className="text-xl font-semibold text-center mb-4">Reset PIN</h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="text-sm font-medium mb-1 block">New PIN</label>
            <div className="flex justify-center gap-3">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  id={`reset-pin-${index}`}
                  type="password"
                  maxLength={1}
                  className="w-10 h-12 border border-black/40 rounded-md text-center text-xl bg-white"
                  value={digit}
                  onChange={(e) =>
                    handleChange(pin, setPin, index, e.target.value, "reset-pin")
                  }
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Confirm PIN</label>
            <div className="flex justify-center gap-3">
              {pinConfirm.map((digit, index) => (
                <input
                  key={index}
                  id={`reset-pin-confirm-${index}`}
                  type="password"
                  maxLength={1}
                  className="w-10 h-12 border border-black/40 rounded-md text-center text-xl bg-white"
                  value={digit}
                  onChange={(e) =>
                    handleChange(pinConfirm, setPinConfirm, index, e.target.value, "reset-pin-confirm")
                  }
                />
              ))}
            </div>
          </div>

          {msg && <p className="text-center text-sm text-red-600">{msg}</p>}

          <button
            type="submit"
            className="w-full py-2.5 rounded-md bg-black text-white font-semibold">
            {loading ? "Saving..." : "Save New PIN"}
          </button>
        </form>
      </div>
    </div>
  );
}
