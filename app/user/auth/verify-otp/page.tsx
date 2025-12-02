// app/user/auth/verify-otp/page.tsx
import { Suspense } from "react";
import VerifyOtpForm from "./form";

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <VerifyOtpForm />
    </Suspense>
  );
}
