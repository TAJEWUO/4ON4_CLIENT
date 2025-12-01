import { Suspense } from "react";
import CreatePasswordForm from "./form";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading…</div>}>
      <CreatePasswordForm />
    </Suspense>
  );
}
