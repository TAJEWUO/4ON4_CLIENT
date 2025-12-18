"use client";

import RequireAuth from "@/components/RequireAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <div className="min-h-screen flex flex-col bg-white">
        <Header />

        {/* 🔑 THIS IS THE MOST IMPORTANT LINE */}
        <main className="flex-1 overflow-y-auto pb-24">
          {children}
        </main>

        <Footer />
      </div>
    </RequireAuth>
  );
}
