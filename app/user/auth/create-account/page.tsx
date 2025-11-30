"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { postAuth } from "@/lib/auth-api";

const phoneRegex = /^0(7|1)\d{8}$/;
const pinRegex = /^\d{4}$/;

export default function CreateAccountPage() {
  const router = useRouter();
  const params = useSearchParams();

  const email = params.get("email");
  const token = params.get("token");

  const [phoneDigits, setPhoneDigits] = useState<string[]>(Array(10).fill(""));
  const [phoneConfirm, setPhoneConfirm] = useState<string[]>(Array(10).fill(""));

  const [pinDigits, setPinDigits] = useState<string[]>(Array(4).fill(""));
  const [pinConfirm, setPinConfirm] = useState<string[]>(Array(4).fill(""));

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDigitChange = (
    section: "phone" | "phoneConfirm" | "pin" | "pinConfirm",
    index: number,
    value: string
  ) => {
    // allow only 0–9 or empty
    if (!/^\d?$/.test(value)) return;

    if (section === "phone") {
      const copy = [...phoneDigits];
      copy[index] = value;
      setPhoneDigits(copy);
    } else if (section === "phoneConfirm") {
      const copy = [...phoneConfirm];
      copy[index] = value;
      setPhoneConfirm(copy);
    } else if (section === "pin") {
      const copy = [...pinDigits];
      copy[index] = value;
      setPinDigits(copy);
    } else {
      const copy = [...pinConfirm];
      copy[index] = value;
      setPinConfirm(copy);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");

    const phone = phoneDigits.join("");
    const confirmPhone = phoneConfirm.join("");
    const pin = pinDigits.join("");
    const confirmPin = pinConfirm.join("");

    if (!token || !email) {
      setMsg("Invalid or expired registration link. Please start again.");
      return;
    }

    if (!phoneRegex.test(phone)) {
      setMsg("Phone must start with 07 or 01 and be 10 digits.");
      return;
    }

    if (phone !== confirmPhone) {
      setMsg("Phone numbers do not match.");
      return;
    }

    if (!pinRegex.test(pin)) {
      setMsg("PIN must be exactly 4 digits.");
      return;
    }

    if (pin !== confirmPin) {
      setMsg("PINs do not match.");
      return;
    }

    setLoading(true);

    const { ok, data } = await postAuth("/api/auth/register-complete", {
      email,
      token,
      phone,
      password: pin,
      confirmPassword: confirmPin,
    });

    setLoading(false);

    if (!ok) {
      setMsg(data.message || "Failed to create account.");
      return;
    }

    router.push("/user/auth/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md p-6 border rounded-xl shadow space-y-6">
        <h1 className="text-2xl font-bold text-center">
          Complete Your Account
        </h1>

        <p className="text-center text-gray-600 text-sm">
          Verified email: <strong>{email}</strong>
        </p>

        <form onSubmit={handleCreate} className="space-y-5">
          {/* PHONE */}
          <div>
            <p className="font-medium mb-1">Enter Phone Number</p>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-semibold">+254</span>
              <div className="grid grid-cols-10 gap-1 flex-1">
                {phoneDigits.map((d, i) => (
                  <input
                    key={i}
                    maxLength={1}
                    inputMode="numeric"
                    className="border rounded text-center py-2"
                    value={d}
                    onChange={(e) =>
                      handleDigitChange("phone", i, e.target.value)
                    }
                  />
                ))}
              </div>
            </div>

            <p className="font-medium mb-1">Confirm Phone Number</p>
            <div className="flex items-center gap-2">
              <span className="font-semibold">+254</span>
              <div className="grid grid-cols-10 gap-1 flex-1">
                {phoneConfirm.map((d, i) => (
                  <input
                    key={i}
                    maxLength={1}
                    inputMode="numeric"
                    className="border rounded text-center py-2"
                    value={d}
                    onChange={(e) =>
                      handleDigitChange("phoneConfirm", i, e.target.value)
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          {/* PIN */}
          <div>
            <p className="font-medium mb-1">Create 4-Digit PIN</p>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {pinDigits.map((d, i) => (
                <input
                  key={i}
                  maxLength={1}
                  inputMode="numeric"
                  className="border rounded text-center py-2"
                  value={d}
                  onChange={(e) =>
                    handleDigitChange("pin", i, e.target.value)
                  }
                />
              ))}
            </div>

            <p className="font-medium mb-1">Confirm PIN</p>
            <div className="grid grid-cols-4 gap-2">
              {pinConfirm.map((d, i) => (
                <input
                  key={i}
                  maxLength={1}
                  inputMode="numeric"
                  className="border rounded text-center py-2"
                  value={d}
                  onChange={(e) =>
                    handleDigitChange("pinConfirm", i, e.target.value)
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
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
