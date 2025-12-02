// app/user/auth/reset-pin/page.tsx
import { Suspense } from "react";
import ResetPinForm from "./form";

export default function ResetPinPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <ResetPinForm />
    </Suspense>
  );
}
