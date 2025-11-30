"use client";

import { useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { postAuth } from "@/lib/auth-api";

export default function CreateAccountPage() {
  const router = useRouter();
  const params = useSearchParams();

  const email = params.get("email");
  const token = params.get("token"); // OTP verification token

  const [phone, setPhone] = useState("");
  const [phoneConfirm, setPhoneConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // PIN & Confirm PIN arrays
  const [pin, setPin] = useState(["", "", "", ""]);
  const [pinConfirm, setPinConfirm] = useState(["", "", "", ""]);

  // ✅ FIXED: correct ref types
  const pinRef = useRef<(HTMLInputElement | null)[]>([]);
  const pinConfirmRef = useRef<(HTMLInputElement | null)[]>([]);

  // ---------- PIN ----------
  const handlePinChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...pin];
    updated[index] = value;
    setPin(updated);

    if (value && index < 3) pinRef.current[index + 1]?.focus();
  };

  const handlePinKeyDown = (index: number, e: any) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      pinRef.current[index - 1]?.focus();
    }
  };

  // ---------- CONFIRM PIN ----------
  const handlePinConfirmChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...pinConfirm];
    updated[index] = value;
    setPinConfirm(updated);

    if (value && index < 3) pinConfirmRef.current[index + 1]?.focus();
  };

  const handlePinConfirmKeyDown = (index: number, e: any) => {
    if (e.key === "Backspace" && !pinConfirm[index] && index > 0) {
      pinConfirmRef.current[index - 1]?.focus();
    }
  };

  // ---------- PHONE FORMAT ----------
  const normalizePhone = (value: string) => {
    const digits = value.replace(/\D/g, "");

    if (digits.startsWith("07") || digits.startsWith("01")) {
      return digits.slice(0, 10);
    }

    if (digits.startsWith("7")) return "07" + digits.slice(1, 9);
    if (digits.startsWith("1")) return "01" + digits.slice(1, 9);

    return digits;
  };

  // ---------- SUBMIT ----------
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");

    if (!email || !token) {
      setMsg("Invalid session. Restart registration.");
      return;
    }

    const fixedPhone = normalizePhone(phone);
    const fixedConfirm = normalizePhone(phoneConfirm);

    if (fixedPhone.length !== 10) {
      setMsg("Enter a valid Kenyan phone number (07.. or 01..)");
      return;
    }

    if (fixedPhone !== fixedConfirm) {
      setMsg("Phone numbers do not match.");
      return;
    }

    const fullPin = pin.join("");
    const fullPinConfirm = pinConfirm.join("");

    if (fullPin.length !== 4) {
      setMsg("Enter your 4-digit PIN.");
      return;
    }

    if (fullPin !== fullPinConfirm) {
      setMsg("PINs do not match.");
      return;
    }

    setLoading(true);

    const { ok, data } = await postAuth("/api/auth/register-complete", {
      token,
      phone: fixedPhone,
      pin: fullPin,
      confirmPin: fullPinConfirm,
    });

    setLoading(false);

    if (!ok) {
      setMsg(data.message || "Failed to create account.");
      return;
    }

    if (data.user?.id) {
      localStorage.setItem("fouron4_user_id", data.user.id);
    }

    router.push("/user/auth/login");
  };

  // ---------- UI ----------
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md p-6 border rounded-xl shadow">
        <h1 className="text-2xl font-bold text-center mb-4">
          Complete Your Account
        </h1>

        <p className="text-center text-gray-600 text-sm mb-6">
          Email verified: <strong>{email}</strong>
        </p>

        <form onSubmit={handleCreate} className="space-y-6">
          {/* PHONE */}
          <div>
            <label className="block font-medium mb-1">Enter Phone Number</label>
            <div className="flex items-center gap-2">
              <span className="px-3 py-2 border rounded bg-gray-100">+254</span>
              <input
                type="text"
                className="flex-1 border px-3 py-2 rounded"
                placeholder="07xxxxxxxx or 01xxxxxxxx"
                value={phone}
                maxLength={10}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                required
              />
            </div>
          </div>

          {/* CONFIRM PHONE */}
          <div>
            <label className="block font-medium mb-1">Confirm Phone Number</label>
            <div className="flex items-center gap-2">
              <span className="px-3 py-2 border rounded bg-gray-100">+254</span>
              <input
                type="text"
                className="flex-1 border px-3 py-2 rounded"
                placeholder="Re-enter phone number"
                value={phoneConfirm}
                maxLength={10}
                onChange={(e) =>
                  setPhoneConfirm(e.target.value.replace(/\D/g, ""))
                }
                required
              />
            </div>
          </div>

          {/* PIN */}
          <div>
            <label className="block font-medium mb-1">Create PIN (4 digits)</label>
            <div className="flex gap-3 justify-center">
              {pin.map((p, i) => (
                <input
                  key={i}
                  type="password"
                  maxLength={1}
                  value={p}
                  ref={(el) => (pinRef.current[i] = el)}
                  className="w-12 h-12 border text-center text-xl rounded"
                  onChange={(e) => handlePinChange(i, e.target.value)}
                  onKeyDown={(e) => handlePinKeyDown(i, e)}
                />
              ))}
            </div>
          </div>

          {/* CONFIRM PIN */}
          <div>
            <label className="block font-medium mb-1">Confirm PIN</label>
            <div className="flex gap-3 justify-center">
              {pinConfirm.map((p, i) => (
                <input
                  key={i}
                  type="password"
                  maxLength={1}
                  value={p}
                  ref={(el) => (pinConfirmRef.current[i] = el)}
                  className="w-12 h-12 border text-center text-xl rounded"
                  onChange={(e) => handlePinConfirmChange(i, e.target.value)}
                  onKeyDown={(e) => handlePinConfirmKeyDown(i, e)}
                />
              ))}
            </div>
          </div>

          {/* ERROR */}
          {msg && <p className="text-center text-red-600 text-sm">{msg}</p>}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-md"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          {/* LOGIN LINK */}
          <p className="text-center text-sm mt-3">
            Already have an account?{" "}
            <a href="/user/auth/login" className="text-blue-600 font-medium">
              Log in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
