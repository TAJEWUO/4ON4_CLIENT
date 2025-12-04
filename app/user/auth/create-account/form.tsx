"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { completeRegister } from "@/lib/auth-api";

const PIN_LENGTH = 4;

export default function CreateAccountForm() {
  const router = useRouter();

  const [storedPhone, setStoredPhone] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const [pin, setPin] = useState<string[]>(Array(PIN_LENGTH).fill(""));
  const [pinConfirm, setPinConfirm] = useState<string[]>(
    Array(PIN_LENGTH).fill("")
  );

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------------------------------------------------------
     LOAD PHONE + TOKEN FROM localStorage
  --------------------------------------------------------- */
  useEffect(() => {
    setStoredPhone(localStorage.getItem("fouron4_auth_phone"));
    setToken(localStorage.getItem("fouron4_register_token"));
  }, []);

  /* ---------------------------------------------------------
     HANDLERS FOR PIN INPUT
  --------------------------------------------------------- */
  const handlePinChange =
    (list: string[], setter: (val: string[]) => void) =>
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

  /* ---------------------------------------------------------
     SUBMIT → CALL BACKEND: /api/auth/register-complete
  --------------------------------------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");

    if (!token) {
      setMsg("Missing verification. Start again from Register.");
      return;
    }

    const newPIN = pin.join("");
    const confirmPIN = pinConfirm.join("");

    if (newPIN.length !== PIN_LENGTH) {
      setMsg("PIN must be 4 digits.");
      return;
    }

    if (newPIN !== confirmPIN) {
      setMsg("PINs do not match.");
      return;
    }

    setLoading(true);

    const { ok, data } = await completeRegister(token, newPIN, confirmPIN);

    setLoading(false);

    if (!ok) {
      setMsg(data?.message || "Failed to create account.");
      return;
    }

    // save user id
    if (data?.user?.id) {
      localStorage.setItem("fouron4_user_id", data.user.id);
    }

    // CLEAN UP
    localStorage.removeItem("fouron4_auth_phone");
    localStorage.removeItem("fouron4_register_token");
    localStorage.removeItem("fouron4_auth_mode");

    router.push("/user/auth/login");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-white text-black px-4"
      style={{ fontFamily: 'Candara, "Candara Light", system-ui, sans-serif' }}
    >
      <div className="w-full max-w-md bg-white/95 border border-black/20 rounded-2xl shadow-sm px-6 py-8 md:px-8 md:py-10 transition-transform duration-150 hover:-translate-y-0.5">
        {/* HEADER */}
        <div className="text-center mb-5">
          <div className="text-3xl font-extrabold tracking-wide mb-2">
            4ON4
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold tracking-wide">
            DRIVER ACCOUNT
          </span>
        </div>

        <h1 className="text-xl font-semibold text-center mb-4">
          Create Account
        </h1>

        {/* SHOW PHONE */}
        {storedPhone && (
          <p className="text-center text-xs text-gray-600 mb-4">
            Phone:{" "}
            <span className="font-semibold">
              +254 {storedPhone.replace(/\D/g, "").slice(-9)}
            </span>
          </p>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* PIN */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Create New PIN
            </label>
            <div className="flex justify-center gap-3">
              {pin.map((value, index) => (
                <input
                  key={index}
                  id={`create-pin-${index}`}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  className="w-10 h-12 border border-black/40 rounded-md text-center text-xl bg-white/95 focus:outline-none focus:ring-2 focus:ring-black"
                  value={value}
                  onChange={(e) =>
                    handlePinChange(pin, setPin)(
                      index,
                      e.target.value,
                      "create-pin"
                    )
                  }
                  onKeyDown={(e) =>
                    handlePinKeyDown(pin, "create-pin")(index, e)
                  }
                />
              ))}
            </div>
          </div>

          {/* CONFIRM PIN */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm PIN
            </label>
            <div className="flex justify-center gap-3">
              {pinConfirm.map((value, index) => (
                <input
                  key={index}
                  id={`create-pin-confirm-${index}`}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  className="w-10 h-12 border border-black/40 rounded-md text-center text-xl bg-white/95 focus:outline-none focus:ring-2 focus:ring-black"
                  value={value}
                  onChange={(e) =>
                    handlePinChange(pinConfirm, setPinConfirm)(
                      index,
                      e.target.value,
                      "create-pin-confirm"
                    )
                  }
                  onKeyDown={(e) =>
                    handlePinKeyDown(pinConfirm, "create-pin-confirm")(
                      index,
                      e
                    )
                  }
                />
              ))}
            </div>
          </div>

          {/* ERROR */}
          {msg && (
            <p className="text-center text-sm text-red-600 leading-snug">
              {msg}
            </p>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 rounded-md bg-black text-white text-sm font-semibold tracking-wide disabled:opacity-60 disabled:cursor-not-allowed transition-transform duration-150 hover:-translate-y-0.5"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          {/* BACK TO LOGIN */}
          <p className="text-center text-xs mt-3">
            Already have an account?{" "}
            <a href="/user/auth/login" className="text-blue-700 hover:underline">
              Log in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
