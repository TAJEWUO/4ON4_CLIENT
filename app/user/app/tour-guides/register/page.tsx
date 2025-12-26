"use client";

import { useState } from "react";

export default function TourGuidesRegisterPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      console.log("Email submitted:", email);
      setSubmitted(true);
      
      setTimeout(() => {
        setSubmitted(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full space-y-16">
        
        {/* Email Input Section - Top */}
        <div className="text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            DROP YOUR EMAIL TO BE NOTIFIED
          </h2>
          
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                className="w-full px-6 py-4 text-base border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white shadow-sm"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                NOTIFY ME
              </button>
            </form>
          ) : (
            <div className="bg-green-50 border-2 border-green-400 rounded-2xl p-6 shadow-sm">
              <p className="text-green-700 font-semibold text-lg">
                ✓ Thank you! We'll notify you when we launch.
              </p>
            </div>
          )}
        </div>

        {/* Large Spacing */}
        <div className="h-16"></div>

        {/* Spinner and Coming Soon - Bottom */}
        <div className="flex flex-col items-center justify-center space-y-8">
          {/* Tiny Single-Layer Spinner */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-green-600 rounded-full animate-spin"></div>
          </div>

          {/* Coming Soon Text */}
          <div className="text-center space-y-3">
            <h1 className="text-5xl md:text-6xl font-black text-green-600 tracking-wider">
              COMING SOON
            </h1>
            <p className="text-gray-600 text-lg font-medium max-w-md">
              We're building something amazing for tour guides
            </p>
          </div>
        </div>

        {/* Large Spacing */}
        <div className="h-12"></div>

        {/* Back Button */}
        <div className="text-center">
          <a
            href="/user/app"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 font-semibold transition-colors group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
            <span>Back to Home</span>
          </a>
        </div>
      </div>
    </div>
  );
}
