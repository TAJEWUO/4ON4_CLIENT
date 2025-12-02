// app/user/auth/create-account/page.tsx
import { Suspense } from "react";
import CreateAccountForm from "./form";

export default function CreateAccountPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <CreateAccountForm />
    </Suspense>
  );
}
