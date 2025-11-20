"use client"

import Link from "next/link"

export default function UserHeader({
  menuOpen,
  setMenuOpen,
  isLoginMode = false,
  channel,
  setChannel,
  setStep,
  setPhone,
  setEmail,
  setOtp,
  setPassword,
  setConfirmPassword,
}: any) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 md:px-8 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: logo */}
        <Link href="/" className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-bold text-black hover:opacity-90">4ON4</h1>
        </Link>

        {/* Right: hamburger only */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => (setMenuOpen ? setMenuOpen(!menuOpen) : null)}
            aria-expanded={!!menuOpen}
            aria-label="Toggle menu"
            className="p-2 rounded-md hover:bg-gray-100 transition"
          >
            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}