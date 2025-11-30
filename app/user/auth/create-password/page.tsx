"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { postAuth } from "@/lib/auth-api";

export default function CreatePasswordPage() {
  const router = useRouter();
  const params = useSearchParams();

  const token = params.get("token");
  const email = params.get("email");
  const phone = params.get("phone");

  const [pin, setPin] = useState(Array(4).fill(""));
  const [confirm, setConfirm] = useState(Array(4).fill(""));
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDigit = (i: number, v: string, t: "pin" | "confirm") => {
    if (!/^[0-9]?$/.test(v)) return;

    if (t === "pin") {
      const arr = [...pin];
      arr[i] = v;
      setPin(arr);
    } else {
      const arr = [...confirm];
      arr[i] = v;
      setConfirm(arr);
    }
  };

  const handleFinish = async () => {
    const password = pin.join("");
    const c = confirm.join("");

    if (password.length !== 4 || c.length !== 4) {
      setMsg("Enter all 4 digits.");
      return;
    }

    if (password !== c) {
      setMsg("PINs do not match.");
      return;
    }

    setLoading(true);

    const { ok, data } = await postAuth("/api/auth/register-complete", {
      token,
      phone: "+254" + phone,
      password,
      confirmPassword: password,
    });

    setLoading(false);

    if (!ok) {
      setMsg(data.message || "Unable to complete registration.");
      return;
    }

    router.push("/user/auth/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md p-6 border rounded-xl shadow">

        <h1 className="text-2xl font-bold text-center mb-4">
          Create Your PIN
        </h1>

        <p className="text-center text-gray-600 mb-4">
          Phone: <b>+254{phone}</b>
        </p>

        <p className="mb-2 text-gray-700">Enter 4-digit PIN:</p>
        <div className="grid grid-cols-4 gap-3 mb-4">
          {pin.map((d, i) => (
            <input
              key={i}
              maxLength={1}
              className="border py-2 text-center rounded"
              value={d}
              onChange={(e) => handleDigit(i, e.target.value, "pin")}
            />
          ))}
        </div>

        <p className="mb-2 text-gray-700">Confirm PIN:</p>
        <div className="grid grid-cols-4 gap-3 mb-4">
          {confirm.map((d, i) => (
            <input
              key={i}
              maxLength={1}
              className="border py-2 text-center rounded"
              value={d}
              onChange={(e) => handleDigit(i, e.target.value, "confirm")}
            />
          ))}
        </div>

        {msg && <p className="text-center text-red-600 mb-3">{msg}</p>}

        <button
          onClick={handleFinish}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-md"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>
      </div>
    </div>
  );
}
