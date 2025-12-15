"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ready, userId } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (ready && !userId) {
      router.replace("/user/auth/login");
    }
  }, [ready, userId, router]);

  if (!ready) return null;

  return <>{children}</>;
}
