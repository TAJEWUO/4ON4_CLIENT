// app/user/dashboard/layout.tsx
"use client";

import RequireAuth from "@/components/RequireAuth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <div className="min-h-screen bg-white">
        {/* Top Navigation */}
        <header className="border-b px-6 py-4 font-bold">
          4ON4
        </header>

        {/* Main Dashboard Body */}
        <main className="px-6 py-6 space-y-10">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t px-6 py-4 text-sm text-muted-foreground">
          © 2025 4ON4 GROUP LIMITED. ALL RIGHTS RESERVED.
        </footer>
      </div>
    </RequireAuth>
  );
}
