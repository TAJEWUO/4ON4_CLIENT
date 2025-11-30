"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function PhonePage() {
  const router = useRouter();
  const params = useSearchParams();

  const token = params.get("token");
  const email = params.get("email");

  const [phoneDigits, setPhoneDigits] = useState(Array(10).fill(""));
  const [confirmDigits, setConfirmDigits] = useState(Array(10).fill(""));

  const [msg, setMsg] = useState("");

  const handleDigitChange = (
    index: number,
    value: string,
    type: "phone" | "confirm"
  ) => {
    if (!/^[0-9]?$/.test(value)) return; // allow only digit OR empty

    if (type === "phone") {
      const newDigits = [...phoneDigits];
      newDigits[index] = value;
      setPhoneDigits(newDigits);
    } else {
      const newDigits = [...confirmDigits];
      newDigits[index] = value;
      setConfirmDigits(newDigits);
    }
  };

  const handleContinue = () => {
    const phone = phoneDigits.join("");
    const confirm = confirmDigits.join("");

    if (phone.length !== 10 || confirm.length !== 10) {
      setMsg("Enter all 10 digits.");
      return;
    }

    if (phone !== confirm) {
      setMsg("Phone numbers do not match.");
      return;
    }

    // redirect to password page with phone + email + token
    router.push(
      `/user/auth/create-password?token=${token}&email=${email}&phone=${phone}`
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md p-6 border rounded-xl shadow">
        <h1 className="text-2xl font-bold text-center mb-4">Enter Your Phone</h1>

        <p className="text-center text-gray-600 mb-4">
          Your verified email: <b>{email}</b>
        </p>

        <p className="text-gray-700 mb-2">Kenya Number Format:</p>
        <div className="flex items-center mb-4">
          <span className="mr-3 font-bold">+254</span>
          <div className="grid grid-cols-10 gap-1 flex-1">
            {phoneDigits.map((d, i) => (
              <input
                key={i}
                maxLength={1}
                className="border w-full text-center py-2 rounded"
                value={d}
                onChange={(e) =>
                  handleDigitChange(i, e.target.value, "phone")
                }
              />
            ))}
          </div>
        </div>

        <p className="text-gray-700 mb-2">Confirm Phone Number:</p>
        <div className="flex items-center mb-4">
          <span className="mr-3 font-bold">+254</span>
          <div className="grid grid-cols-10 gap-1 flex-1">
            {confirmDigits.map((d, i) => (
              <input
                key={i}
                maxLength={1}
                className="border w-full text-center py-2 rounded"
                value={d}
                onChange={(e) =>
                  handleDigitChange(i, e.target.value, "confirm")
                }
              />
            ))}
          </div>
        </div>

        {msg && <p className="text-center text-red-600 mb-3">{msg}</p>}

        <button
          onClick={handleContinue}
          className="w-full bg-black text-white py-2 rounded-md"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
