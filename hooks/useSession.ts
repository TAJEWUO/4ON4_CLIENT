//
// hooks/useSession.ts
"use client";

import { useEffect, useState } from "react";

const BYPASS_AUTH = process.env.NEXT_PUBLIC_BYPASS_AUTH === "true";

export function useSession() {
  const [ready, setReady] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Bypass auth for local development
    if (BYPASS_AUTH) {
      localStorage.setItem("fouron4_access", "dev-mock-token");
      localStorage.setItem("fouron4_user_id", "dev-mock-user-id");
      setIsAuth(true);
      setUserId("dev-mock-user-id");
      setReady(true);
      return;
    }

    const accessToken = localStorage.getItem("fouron4_access");
    const uid = localStorage.getItem("fouron4_user_id");

    setIsAuth(Boolean(accessToken));
    setUserId(uid);
    setReady(true);
  }, []);

  return { ready, isAuth, userId };
}
//