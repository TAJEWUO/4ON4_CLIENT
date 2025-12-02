// app/user/auth/forgot-pin/page.tsx
import { Suspense } from "react";
import ForgotPinForm from "./form";

export default function ForgotPinPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <ForgotPinForm />
    </Suspense>
  );
}
