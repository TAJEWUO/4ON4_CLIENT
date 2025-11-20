"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Welcome() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/user/auth")
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* Title */}
        <h1 className="text-6xl md:text-7xl font-bold mb-4 tracking-tight text-black">4ON4</h1>

        {/* Subtitle */}
        <p className="text-lg text-gray-600 mb-12 font-light">Powered by trust</p>

        {/* Loading indicator */}
        <div className="flex justify-center mb-8">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
        </div>

        {/* Manual redirect link */}
        <p className="text-gray-500 text-sm">
          Redirecting to login...{" "}
          <Link href="/user/auth" className="text-black font-semibold hover:underline">
            Click here if not redirected
          </Link>
        </p>

        {/* Footer Text */}
        <p className="text-gray-500 text-sm mt-12">© 2025 4ON4 Group Limited. All rights reserved.</p>
      </div>
    </div>
  )
}