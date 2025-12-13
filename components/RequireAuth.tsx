"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ready, isAuth } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;

    if (!isAuth) {
      router.replace("/user/auth/login");
    }
  }, [ready, isAuth, router]);

  if (!ready) {
    return <div className="p-4">Checking session...</div>;
  }

  if (!isAuth) {
    return null;
  }

  return <>{children}</>;
}
