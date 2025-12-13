// hooks/useSession.ts
"use client";

import { useEffect, useState } from "react";

export function useSession() {
  const [userId, setUserId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("userId");
    setUserId(id);
    setReady(true);
  }, []);

  return { userId, ready, isAuth: !!userId };
}
