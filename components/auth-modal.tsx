"use client"

import { useState } from "react"
import { Eye, EyeOff, X } from "lucide-react"

type UserRecord = {
  id: string
  identifier: string // phone or email
  phone?: string
  email?: string
  password: string
  animal: string
  city: string
  day: string
  createdAt: string
}

const USERS_KEY = "fouron4_users"

function loadUsers(): UserRecord[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (!raw) return []
    return JSON.parse(raw) as UserRecord[]
  } catch {
    return []
  }
}

function saveUsers(users: UserRecord[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function normalizeIdentifier(value: string) {
  return value.trim().toLowerCase()
}

export default function AuthModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void
  onSuccess: (profile: any) => void
}) {
  const [mode, setMode] = useState<"login" | "register" | "reset">("login")

  const [identifier, setIdentifier] = useState("") // phone or email
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [animal, setAnimal] = useState("")
  const [city, setCity] = useState("")
  const [day, setDay] = useState("")

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [info, setInfo] = useState("")

  const resetState = () => {
    setIdentifier("")
    setPassword("")
    setConfirmPassword("")
    setAnimal("")
    setCity("")
    setDay("")
    setError("")
    setInfo("")
  }

  const validatePassword = (pwd: string) => {
    const okLength = pwd.length === 4
    const okChars = /^[A-Za-z0-9]{4}$/.test(pwd)
    return okLength && okChars
  }

  const currentSummary = animal && city && day ? `${animal}, ${city}, ${day}` : ""

  // ───────────────────────── LOGIN ─────────────────────────
  const handleLogin = () => {
    setError("")
    setInfo("")

    if (!identifier.trim() || !password.trim()) {
      setError("Please enter phone/email and password.")
      return
    }

    const users = loadUsers()
    const norm = normalizeIdentifier(identifier)
    const user = users.find((u) => normalizeIdentifier(u.identifier) === norm)

    if (!user || user.password !== password) {
      setError("Wrong details. Please try again.")
      return
    }

    // Build profile for dashboard
    const profile = {
      name: user.identifier,
      phone: user.phone || "",
      email: user.email || "",
      isProfileComplete: false,
    }

    onSuccess(profile)
  }

  // ────────────────────── REGISTER ──────────────────────
  const handleRegister = () => {
    setError("")
    setInfo("")

    if (!identifier.trim()) {
      setError("Please enter your phone number or email.")
      return
    }
    if (!animal || !city || !day) {
      setError("Please answer all three secret questions.")
      return
    }
    if (!validatePassword(password)) {
      setError("Password must be exactly 4 characters (letters or numbers).")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    const users = loadUsers()
    const norm = normalizeIdentifier(identifier)
    const existing = users.find((u) => normalizeIdentifier(u.identifier) === norm)

    if (existing) {
      setError("An account with this phone/email already exists.")
      return
    }

    const isEmail = identifier.includes("@")
    const newUser: UserRecord = {
      id: Date.now().toString(),
      identifier: identifier.trim(),
      phone: isEmail ? undefined : identifier.trim(),
      email: isEmail ? identifier.trim() : undefined,
      password,
      animal,
      city,
      day,
      createdAt: new Date().toISOString(),
    }

    saveUsers([...users, newUser])
    setInfo("Account created. You can now log in.")
    setMode("login")
    setPassword("")
    setConfirmPassword("")
  }

  // ────────────────────── RESET PASSWORD ──────────────────────
  const handleReset = () => {
    setError("")
    setInfo("")

    if (!identifier.trim()) {
      setError("Please enter your phone number or email.")
      return
    }
    if (!animal || !city || !day) {
      setError("Please answer all three secret questions.")
      return
    }
    if (!validatePassword(password)) {
      setError("New password must be exactly 4 characters (letters or numbers).")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    const users = loadUsers()
    const norm = normalizeIdentifier(identifier)
    const index = users.findIndex((u) => normalizeIdentifier(u.identifier) === norm)

    if (index === -1) {
      setError("No account found with that phone/email.")
      return
    }

    const user = users[index]
    if (user.animal !== animal || user.city !== city || user.day !== day) {
      setError("Secret answers do not match. Cannot reset password.")
      return
    }

    const updated = [...users]
    updated[index] = { ...user, password }
    saveUsers(updated)
    setInfo("Password updated. You can now log in.")
    setMode("login")
    setPassword("")
    setConfirmPassword("")
  }

  // ────────────────────── RENDER HELPERS ──────────────────────
  const renderSecretQuestions = () => (
    <div className="space-y-4">
      {/* Favourite animal */}
      <div>
        <p className="text-sm text-black mb-1">
          What is your favourite animal?
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          {["DOG", "CAT", "GOAT", "COW"].map((opt) => (
            <label key={opt} className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                className="h-3 w-3"
                checked={animal === opt}
                onChange={() => setAnimal(opt)}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Favourite city */}
      <div>
        <p className="text-sm text-black mb-1">
          What is your favourite city?
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          {["NAIROBI", "KISUMU", "MOMBASA"].map((opt) => (
            <label key={opt} className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                className="h-3 w-3"
                checked={city === opt}
                onChange={() => setCity(opt)}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Favourite day */}
      <div>
        <p className="text-sm text-black mb-1">
          What is your favourite day of the week?
        </p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            "SUNDAY",
            "MONDAY",
            "TUESDAY",
            "WEDNESDAY",
            "THURSDAY",
            "FRIDAY",
            "SATURDAY",
          ].map((opt) => (
            <label key={opt} className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                className="h-3 w-3"
                checked={day === opt}
                onChange={() => setDay(opt)}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Summary */}
      {currentSummary && (
        <p className="text-xs text-black mt-1">
          Confirm secret key:{" "}
          <span className="font-bold">
            {currentSummary}
          </span>
        </p>
      )}
    </div>
  )

  const renderPasswordFields = () => (
    <div className="space-y-3">
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
          placeholder="4-character password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <input
        type={showPassword ? "text" : "password"}
        className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
        placeholder="Confirm password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <p className="text-xs text-gray-500">
        Password must be exactly 4 letters or numbers.
      </p>
    </div>
  )

  // ────────────────────── MAIN RENDER ──────────────────────
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl relative flex flex-col">
        {/* CLOSE BUTTON */}
        <button
          className="absolute top-3 right-3 text-gray-700"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* LOGO / TITLE */}
        <div className="pt-6 pb-3 flex flex-col items-center">
          <div className="text-3xl font-extrabold tracking-wide">4ON4</div>
          <div className="text-xs text-gray-600 mt-1">
            powered by trust
          </div>
        </div>

        {/* FORM CONTENT */}
        <div className="px-6 pb-4 space-y-4">

          {/* MODE TITLE */}
          <h2 className="text-base font-semibold text-black text-center">
            {mode === "login" && "Log in to your account"}
            {mode === "register" && "Create a new account"}
            {mode === "reset" && "Reset your password"}
          </h2>

          {/* ERROR / INFO */}
          {error && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </div>
          )}
          {info && (
            <div className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
              {info}
            </div>
          )}

          {/* IDENTIFIER FIELD */}
          <div className="space-y-1">
            <label className="text-xs text-black">
              Phone number or email
            </label>
            <input
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
              placeholder="+2547...  or  email@gmail.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>

          {/* MODE-SPECIFIC CONTENT */}
          {mode === "login" && (
            <>
              {/* PASSWORD */}
              <div className="space-y-1">
                <label className="text-xs text-black">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* ACTION BUTTON */}
              <button
                onClick={handleLogin}
                className="w-full mt-3 py-2 bg-black text-white rounded-xl text-sm hover:bg-gray-900"
              >
                Log In
              </button>

              {/* LINKS */}
              <div className="flex flex-col items-center gap-1 mt-3">
                <button
                  onClick={() => {
                    resetState()
                    setMode("reset")
                  }}
                  className="text-xs text-black underline"
                >
                  Forgot password?
                </button>
                <button
                  onClick={() => {
                    resetState()
                    setMode("register")
                  }}
                  className="text-xs text-black underline"
                >
                  Create account
                </button>
              </div>
            </>
          )}

          {mode === "register" && (
            <>
              {renderSecretQuestions()}
              {renderPasswordFields()}

              <button
                onClick={handleRegister}
                className="w-full mt-3 py-2 bg-black text-white rounded-xl text-sm hover:bg-gray-900"
              >
                Create Account
              </button>

              <div className="flex justify-center mt-2">
                <button
                  onClick={() => {
                    resetState()
                    setMode("login")
                  }}
                  className="text-xs text-black underline"
                >
                  Already have an account? Log in
                </button>
              </div>
            </>
          )}

          {mode === "reset" && (
            <>
              {renderSecretQuestions()}
              {renderPasswordFields()}

              <button
                onClick={handleReset}
                className="w-full mt-3 py-2 bg-black text-white rounded-xl text-sm hover:bg-gray-900"
              >
                Reset Password
              </button>

              <div className="flex justify-center mt-2">
                <button
                  onClick={() => {
                    resetState()
                    setMode("login")
                  }}
                  className="text-xs text-black underline"
                >
                  Back to login
                </button>
              </div>
            </>
          )}
        </div>

        {/* FOOTER COPYRIGHT */}
        <div className="border-t border-gray-200 px-4 py-2 text-[10px] text-center text-gray-500">
          © 4ON4 Group Limited
        </div>
      </div>
    </div>
  )
}
