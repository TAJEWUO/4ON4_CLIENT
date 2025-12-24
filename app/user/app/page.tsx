"use client";

import CurrencyExchange from "@/components/CurrencyExchange";

export default function Page() {
  return (
    <main className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Currency Exchange - Takes up 1/3 of page height */}
        <div className="mb-8">
          <CurrencyExchange />
        </div>

        {/* Rest of your page content goes here */}
        <div className="mt-8">
          <h1 className="text-3xl font-bold">4ON4 App</h1>
          <p className="text-gray-600 mt-2">Welcome to your safari booking platform</p>
        </div>
      </div>
    </main>
  );
}
