// hooks/useSession.ts
"use client";

import { useEffect, useState } from "react";

export function useSession() {
  const [ready, setReady] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("fouron4_access");
    const uid = localStorage.getItem("fouron4_user_id");

    setIsAuth(Boolean(accessToken));
    setUserId(uid);
    setReady(true);
  }, []);

  return { ready, isAuth, userId };
}
