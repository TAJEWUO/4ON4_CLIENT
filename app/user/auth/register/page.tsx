// app/user/auth/register/page.tsx
import { Suspense } from "react";
import RegisterForm from "./form";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
