"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function VerifyPage() {
  const router = useRouter();
  const params = useSearchParams();

  const token = params.get("token");
  const email = params.get("email");

  useEffect(() => {
    if (token && email) {
      router.replace(
        `/user/auth/create-account?token=${token}&email=${encodeURIComponent(
          email
        )}`
      );
    }
  }, [token, email, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Verifying link... redirecting.</p>
    </div>
  );
}
