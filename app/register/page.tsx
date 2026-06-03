

import Image from "next/image";
import RegisterForm from "@/components/auth/registerForm";

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4  sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center">
        <div className="">
          <Image
            alt=""
            src="/images/logo.png"
            className="mx-auto w-auto"
            width="48"
            height="48"
          />
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
