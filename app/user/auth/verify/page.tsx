"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { postAuth } from "@/lib/auth-api";

export default function VerifyEmailCodePage() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") || "";

  // Store 6 digits
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);

  // ⭐ FIXED REF TYPE (array of HTMLInputElement or null)
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [secondsLeft, setSecondsLeft] = useState(60);
  const [resendLoading, setResendLoading] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (secondsLeft <= 0) return;

    const id = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);

    return () => clearInterval(id);
  }, [secondsLeft]);

  // Missing email → show error
  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">
          Missing email. Please start registration again.
        </p>
      </div>
    );
  }

  // Handle digit typing
  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    // Auto focus next
    if (value && index < 5 && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // Backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // Submit for verification
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");

    const code = digits.join("");

    if (code.length !== 6) {
      setMsg("Enter the 6-digit code.");
      return;
    }

    setLoading(true);

    const { ok, data } = await postAuth("/api/auth/verify-email-code", {
      email,
      code,
    });

    setLoading(false);

    if (!ok) {
      setMsg(data.message || "Invalid or expired code.");
      return;
    }

    const token = data.token;

    router.push(
      `/user/auth/create-account?email=${encodeURIComponent(
        email
      )}&token=${encodeURIComponent(token)}`
    );
  };

  // Resend code
  const handleResend = async () => {
    if (secondsLeft > 0) return;
    setResendLoading(true);
    setMsg("");

    const { ok, data } = await postAuth("/api/auth/register-start", { email });

    setResendLoading(false);

    if (!ok) {
      setMsg(data.message || "Failed to resend code.");
      return;
    }

    setSecondsLeft(60);
    setMsg("New code sent.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md p-6 border rounded-xl shadow">
        <h1 className="text-2xl font-bold text-center mb-4">
          Verify Your Email
        </h1>

        <p className="text-center text-sm text-gray-600 mb-4">
          Enter the 6-digit code sent to{" "}
          <span className="font-semibold">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* DIGIT BOXES */}
          <div className="flex justify-center gap-2">
            {digits.map((d, i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                value={d}
                ref={(el) => {
                  inputsRef.current[i] = el;
                }}
                className="w-10 h-10 border rounded text-center text-lg"
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
              />
            ))}
          </div>

          {/* TIMER OR RESEND */}
          <div className="text-center text-sm text-gray-600">
            {secondsLeft > 0 ? (
              <>Code expires in {secondsLeft}s</>
            ) : (
              <button
                type="button"
                disabled={resendLoading}
                onClick={handleResend}
                className="text-blue-600 underline"
              >
                {resendLoading ? "Resending..." : "Resend code"}
              </button>
            )}
          </div>

          {msg && <p className="text-center text-sm text-red-600">{msg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-md"
          >
            {loading ? "Verifying..." : "Confirm Code"}
          </button>
        </form>
      </div>
    </div>
  );
}
