"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { completeRegister } from "@/lib/auth-api";

export default function CreateAccountForm() {
  const router = useRouter();

  const [phone, setPhone] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [pin, setPin] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [showPinConfirm, setShowPinConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPhone(localStorage.getItem("fouron4_phone"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");

    if (!phone) { setMsg("Missing phone. Restart registration."); return; }
    if (!firstName || !lastName) { setMsg("Enter your name."); return; }
    if (!agreed) { setMsg("Agree to terms."); return; }
    if (pin.length !== 4) { setMsg("PIN must be 4 digits."); return; }
    if (pin !== pinConfirm) { setMsg("PINs don't match."); return; }

    setLoading(true);
    const { ok, data } = await completeRegister(phone, pin, firstName, lastName);
    setLoading(false);

    if (!ok) { setMsg(data?.message || "Failed to create account"); return; }

    // Save tokens and user info
    if (data?.accessToken) localStorage.setItem("fouron4_access", data.accessToken);
    if (data?.user?.id) localStorage.setItem("fouron4_user_id", data.user.id);

    // Clear registration data
    localStorage.removeItem("fouron4_phone");

    // Go to app
    router.push("/user/app");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black px-4" style={{ fontFamily: 'Candara, "Candara Light", system-ui, sans-serif' }}>
      <div className="w-full max-w-md bg-white border border-black/10 rounded-2xl shadow-sm px-8 py-10">
        <h1 className="text-4xl font-extrabold text-center tracking-wide mb-2">4ON4</h1>
        <p className="text-center mb-6"><span className="px-4 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium tracking-wide">DRIVER ACCOUNT</span></p>
        <h2 className="text-lg text-center font-semibold mb-6 tracking-wide">CREATE YOUR ACCOUNT</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {phone && (
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <div className="flex items-center border border-black/20 rounded-lg px-3 py-2 bg-white">
                <span className="text-black/70 pr-2 border-r border-black/10">+254</span>
                <input type="text" className="flex-1 pl-3 bg-transparent outline-none text-black" value={phone} disabled />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input 
              type="text" 
              value={firstName} 
              onChange={(e) => setFirstName(e.target.value)} 
              placeholder="John" 
              className="w-full border border-black/20 rounded-lg px-3 py-2 bg-white outline-none" 
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input 
              type="text" 
              value={lastName} 
              onChange={(e) => setLastName(e.target.value)} 
              placeholder="Doe" 
              className="w-full border border-black/20 rounded-lg px-3 py-2 bg-white outline-none" 
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Enter New PIN</label>
            <div className="relative border border-black/20 rounded-lg px-3 py-2 bg-white">
              <input 
                type={showPin ? "text" : "password"} 
                inputMode="numeric" 
                maxLength={4} 
                value={pin} 
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))} 
                className="w-full bg-transparent outline-none text-lg tracking-widest pr-10" 
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50 hover:text-black text-xs"
              >
                {showPin ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirm PIN</label>
            <div className="relative border border-black/20 rounded-lg px-3 py-2 bg-white">
              <input 
                type={showPinConfirm ? "text" : "password"} 
                inputMode="numeric" 
                maxLength={4} 
                value={pinConfirm} 
                onChange={(e) => setPinConfirm(e.target.value.replace(/\D/g, ""))} 
                className="w-full bg-transparent outline-none text-lg tracking-widest pr-10" 
              />
              <button
                type="button"
                onClick={() => setShowPinConfirm(!showPinConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50 hover:text-black text-xs"
              >
                {showPinConfirm ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3 text-sm">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1" />
            <p className="text-black/80">I agree to the <a className="text-blue-700 underline cursor-pointer" href="#">Terms & Conditions</a>.</p>
          </div>

          {msg && <p className="text-center text-sm text-red-600">{msg}</p>}

          <button type="submit" disabled={loading} className="w-full py-3 rounded-lg bg-black text-white text-sm tracking-wide font-medium disabled:opacity-60">{loading ? "Creating..." : "Create Account"}</button>

          <p className="text-center text-xs mt-2">Already have an account? <a href="/user/auth/login" className="text-blue-700 underline">Log in</a></p>
        </form>

        <p className="text-[10px] text-black/60 mt-8 tracking-wide text-center">© 2025 4ON4 GROUP LIMITED. All rights reserved.</p>
      </div>
    </div>
  );
}
