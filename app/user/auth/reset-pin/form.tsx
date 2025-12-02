// app/user/auth/reset-pin/form.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { postAuth } from "@/lib/auth-api";

const PIN_LENGTH = 4;

export default function ResetPinForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [pin, setPin] = useState<string[]>(Array(PIN_LENGTH).fill(""));
  const [pinConfirm, setPinConfirm] = useState<string[]>(
    Array(PIN_LENGTH).fill("")
  );
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = searchParams.get("token");
    setToken(t);
  }, [searchParams]);

  const handlePinChange =
    (list: string[], setter: (v: string[]) => void) =>
    (index: number, value: string, idPrefix: string) => {
      if (!/^\d?$/.test(value)) return;
      const updated = [...list];
      updated[index] = value;
      setter(updated);

      if (value && index < PIN_LENGTH - 1) {
        const next = document.getElementById(
          `${idPrefix}-${index + 1}`
        ) as HTMLInputElement | null;
        next?.focus();
      }
    };

  const handlePinKeyDown =
    (list: string[], idPrefix: string) =>
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !list[index] && index > 0) {
        const prev = document.getElementById(
          `${idPrefix}-${index - 1}`
        ) as HTMLInputElement | null;
        prev?.focus();
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");

    if (!token) {
      setMsg("Invalid or missing reset token.");
      return;
    }

    const fullPin = pin.join("");
    const fullPinConfirm = pinConfirm.join("");

    if (fullPin.length !== PIN_LENGTH) {
      setMsg("PIN must be 4 digits.");
      return;
    }

    if (fullPin !== fullPinConfirm) {
      setMsg("PINs do not match.");
      return;
    }

    setLoading(true);
    const { ok, data } = await postAuth("/auth/reset-complete", {
      token,
      password: fullPin,
      confirmPassword: fullPinConfirm,
    });
    setLoading(false);

    if (!ok) {
      setMsg(data?.message || "Failed to reset PIN.");
      return;
    }

    router.push("/user/auth/login");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-white text-black px-4"
      style={{ fontFamily: 'Candara, "Candara Light", system-ui, sans-serif' }}
    >
      <div className="w-full max-w-md bg-white/95 border border-black/20 rounded-2xl shadow-sm px-6 py-8 md:px-8 md:py-10 transition-transform duration-150 hover:-translate-y-0.5">
        <div className="text-center mb-5">
          <div className="text-3xl font-extrabold tracking-wide mb-2">
            4ON4
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold tracking-wide">
            DRIVER ACCOUNT
          </span>
        </div>

        <h1 className="text-xl font-semibold text-center mb-4">Reset PIN</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New PIN */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Create New PIN
            </label>
            <div className="flex justify-center gap-3">
              {pin.map((value, index) => (
                <input
                  key={index}
                  id={`reset-pin-${index}`}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  className="w-10 h-12 border border-black/40 rounded-md text-center text-xl bg-white/95 focus:outline-none focus:ring-2 focus:ring-black"
                  value={value}
                  onChange={(e) =>
                    handlePinChange(pin, setPin)(
                      index,
                      e.target.value,
                      "reset-pin"
                    )
                  }
                  onKeyDown={(e) =>
                    handlePinKeyDown(pin, "reset-pin")(index, e)
                  }
                />
              ))}
            </div>
          </div>

          {/* Confirm PIN */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm PIN
            </label>
            <div className="flex justify-center gap-3">
              {pinConfirm.map((value, index) => (
                <input
                  key={index}
                  id={`reset-pin-confirm-${index}`}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  className="w-10 h-12 border border-black/40 rounded-md text-center text-xl bg-white/95 focus:outline-none focus:ring-2 focus:ring-black"
                  value={value}
                  onChange={(e) =>
                    handlePinChange(pinConfirm, setPinConfirm)(
                      index,
                      e.target.value,
                      "reset-pin-confirm"
                    )
                  }
                  onKeyDown={(e) =>
                    handlePinKeyDown(pinConfirm, "reset-pin-confirm")(
                      index,
                      e
                    )
                  }
                />
              ))}
            </div>
          </div>

          {msg && (
            <p className="text-center text-sm text-red-600 leading-snug">
              {msg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 rounded-md bg-black text-white text-sm font-semibold tracking-wide disabled:opacity-60 disabled:cursor-not-allowed transition-transform duration-150 hover:-translate-y-0.5"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}
