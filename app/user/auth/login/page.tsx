// app/user/auth/login/page.tsx
import { Suspense } from "react";
import LoginForm from "./form";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
