import VerifyEmailPage from "@/components/VerifyEmailClient";
import { Suspense } from "react";


export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <VerifyEmailPage />
    </Suspense>
  );
}