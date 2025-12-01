"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { postAuth } from "@/lib/auth-api";

export default function CreateAccountPage() {
  const router = useRouter();
  const params = useSearchParams();

  const email = params.get("email");
  const token = params.get("token");

  const [phone, setPhone] = useState("");
  const [phoneConfirm, setPhoneConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [pin, setPin] = useState(["", "", "", ""]);
  const [pinConfirm, setPinConfirm] = useState(["", "", "", ""]);

  // Normalize phone
  const normalizePhone = (v: string) => {
    const d = v.replace(/\D/g, "");
    if (d.startsWith("07") || d.startsWith("01")) return d.slice(0, 10);
    if (d.startsWith("7")) return "07" + d.slice(1, 9);
    if (d.startsWith("1")) return "01" + d.slice(1, 9);
    return d;
  };

  // PIN
  const handlePinChange = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;

    const updated = [...pin];
    updated[i] = v;
    setPin(updated);

    if (v && i < 3) {
      const next = document.getElementById(`pin-${i + 1}`) as HTMLInputElement | null;
      next?.focus();
    }
  };

  const handlePinKeyDown = (i: number, e: any) => {
    if (e.key === "Backspace" && !pin[i] && i > 0) {
      const prev = document.getElementById(`pin-${i - 1}`) as HTMLInputElement | null;
      prev?.focus();
    }
  };

  // CONFIRM PIN
  const handlePinConfirmChange = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;

    const updated = [...pinConfirm];
    updated[i] = v;
    setPinConfirm(updated);

    if (v && i < 3) {
      const next = document.getElementById(`pinConfirm-${i + 1}`) as HTMLInputElement | null;
      next?.focus();
    }
  };

  const handlePinConfirmKeyDown = (i: number, e: any) => {
    if (e.key === "Backspace" && !pinConfirm[i] && i > 0) {
      const prev = document.getElementById(`pinConfirm-${i - 1}`) as HTMLInputElement | null;
      prev?.focus();
    }
  };

  // SUBMIT
  const handleCreate = async (e: any) => {
    e.preventDefault();
    setMsg("");

    if (!email || !token) return setMsg("Invalid session.");

    const fixedPhone = normalizePhone(phone);
    const fixedConfirm = normalizePhone(phoneConfirm);

    if (fixedPhone.length !== 10)
      return setMsg("Enter a valid Kenyan phone number.");

    if (fixedPhone !== fixedConfirm) return setMsg("Phone numbers do not match.");

    const fullPin = pin.join("");
    const fullPinConfirm = pinConfirm.join("");

    if (fullPin.length !== 4) return setMsg("PIN must be 4 digits.");
    if (fullPin !== fullPinConfirm) return setMsg("PINs do not match.");

    setLoading(true);

    const { ok, data } = await postAuth("/api/auth/register-complete", {
      token,
      phone: fixedPhone,
      pin: fullPin,
      confirmPin: fullPinConfirm,
    });

    setLoading(false);

    if (!ok) return setMsg(data.message || "Failed to create account.");

    localStorage.setItem("fouron4_user_id", data.user.id);
    router.push("/user/auth/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md p-6 border rounded-xl shadow">
        <h1 className="text-2xl font-bold text-center mb-4">Complete Your Account</h1>

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
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
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
                maxLength={10}
                value={phoneConfirm}
                onChange={(e) => setPhoneConfirm(e.target.value.replace(/\D/g, ""))}
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
                  id={`pin-${i}`}
                  type="password"
                  maxLength={1}
                  value={p}
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
                  id={`pinConfirm-${i}`}
                  type="password"
                  maxLength={1}
                  value={p}
                  className="w-12 h-12 border text-center text-xl rounded"
                  onChange={(e) => handlePinConfirmChange(i, e.target.value)}
                  onKeyDown={(e) => handlePinConfirmKeyDown(i, e)}
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
            {loading ? "Creating..." : "Create Account"}
          </button>

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
