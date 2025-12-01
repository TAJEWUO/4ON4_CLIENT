import { Suspense } from "react";
import CreateAccountForm from "./form";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateAccountForm />
    </Suspense>
  );
}
