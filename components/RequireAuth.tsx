"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, isInitialized } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only check auth after component is mounted and auth is initialized
    if (!mounted || !isInitialized) return;
    
    if (!userId) {
      console.log("[RequireAuth] No userId, redirecting to login");
      router.replace("/user/auth/login");
    } else {
      console.log("[RequireAuth] User authenticated:", userId);
    }
  }, [mounted, isInitialized, userId, router]);

  // Show loading until auth context is initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">4ON4</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show nothing if not authenticated (will redirect)
  if (!userId) return null;

  return <>{children}</>;
}
