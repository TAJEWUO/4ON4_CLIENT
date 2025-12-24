"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = useAuth();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait a tick to avoid SSR/hydration issues
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady && !userId) {
      console.log("[RequireAuth] No userId, redirecting to login");
      router.replace("/user/auth/login");
    } else if (isReady && userId) {
      console.log("[RequireAuth] User authenticated:", userId);
    }
  }, [isReady, userId, router]);

  // Show nothing until ready and authenticated
  if (!isReady || !userId) return null;

  return <>{children}</>;
}
