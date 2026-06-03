"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/button/Button";
import Input from "@/components/input/Input";

type FormValues = {
  code: string;
};

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get("email") || "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      code: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code: data.code,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError("code", {
          message: result.error || "Verification failed.",
        });
        return;
      }

      reset();

      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch  {
      setError("code", {
        message: "Unable to verify your email right now.",
      });
    
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-semibold">Verify your email</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Enter the verification code sent to{" "}
          <span className="font-medium">{email || "your email"}</span>.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="code"
              className="block text-sm font-medium text-foreground"
            >
              Verification code
            </label>

            <Input
              id="code"
              type="text"
              required
              register={register}
              errors={errors}
              disabled={isSubmitting}
            />

            {errors.code && (
              <p className="text-sm text-rose-600 mt-2">
                {errors.code.message}
              </p>
            )}
          </div>

          <Button fullWidth type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Verifying..." : "Verify email"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            Didn&apos;t receive a code? Please check spam or request a new code
            from the registration flow.
          </p>
        </div>
      </div>
    </div>
  );
}
