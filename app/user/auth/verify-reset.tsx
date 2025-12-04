"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkVerify } from "@/lib/auth-api";

const OTP_LENGTH = 6;

export default function VerifyResetOtpForm() {
  const router = useRouter();
  const [phone, setPhone] = useState<string | null>(null);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedPhone = localStorage.getItem("fouron4_auth_phone");
    setPhone(storedPhone);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < OTP_LENGTH - 1) {
      const next = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      next?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");

    if (!phone) {
      setMsg("Missing phone. Start again.");
      return;
    }

    const code = otp.join("");
    if (code.length !== OTP_LENGTH) {
      setMsg("Enter full OTP.");
      return;
    }

    setLoading(true);
    const { ok, data } = await checkVerify(phone, code, "reset");
    setLoading(false);

    if (!ok) {
      setMsg(data?.message || "Incorrect OTP.");
      return;
    }

    localStorage.setItem("fouron4_reset_token", data.resetToken);

    router.push("/user/auth/reset-pin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 text-black"
      style={{ fontFamily: 'Candara, "Candara Light", system-ui, sans-serif' }}>
      
      <div className="w-full max-w-md bg-white/95 border border-black/20 rounded-2xl px-6 py-8">
        <h1 className="text-xl font-semibold text-center mb-4">Verify OTP</h1>

        {phone && (
          <p className="text-center text-xs text-gray-600 mb-3">
            Sent to <b>{phone}</b>
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                inputMode="numeric"
                maxLength={1}
                className="w-10 h-12 border border-black/40 rounded-md text-center text-xl bg-white"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
              />
            ))}
          </div>

          {msg && <p className="text-center text-sm text-red-600">{msg}</p>}

          <button
            type="submit"
            className="w-full py-2.5 rounded-md bg-black text-white font-semibold">
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
