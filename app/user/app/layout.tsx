// app/user/app/layout.tsx
"use client";

import RequireAuth from "@/components/RequireAuth";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <div className="min-h-screen flex flex-col bg-white">
        {/* Top bar */}
        <Header />

        {/* Main app content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

        {/* Bottom navigation */}
        <Footer />
      </div>
    </RequireAuth>
  );
}
