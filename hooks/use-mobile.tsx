"use client";

import { useEffect, useState } from "react";

/**
 * useIsMobile - returns true when window.innerWidth < breakpoint
 * Named export (matches import: { useIsMobile } from '@/hooks/use-mobile')
 */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onResize = () => setIsMobile(window.innerWidth < breakpoint);

    // set immediately then attach listener
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);

  return isMobile;
}