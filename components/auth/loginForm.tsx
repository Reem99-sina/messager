"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Input from "@/components/input/Input";
import Button from "@/components/button/Button";
import { LoginFormValues } from "@/types/user";
import FormLogo from "../formLogo";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/Auth";
import { useLogin } from "@/action/Login";
import Link from "next/link";

export default function LoginForm() {
  const [serverToken, setServerToken] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();
  const { mutateAsync } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>();

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
  
    await mutateAsync(data)
      .then((res) => {
        if (res?.success) {
          setServerToken(res.token);
          login(res.token);
          toast.success("Login successful");
          router.push("/");
          return;
        }
      })
      .catch((error) => {
        if (error?.verifyEmail) {
          toast.error("Email not verified. Redirecting to verification page.");
          router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
          return;
        }

        toast.error(error?.error || "Login failed. Please try again.");
      });
  };

  return (
    <FormLogo
      title="Sign in to your account"
      description="Enter your email and password to access your account"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="mt-8 space-y-6">
        <div className="space-y-4 ">
          <Input
            label="Email"
            id="email"
            type="email"
            required
            register={register}
            errors={errors}
          />
          {errors.email && (
            <p className="mt-2 text-sm text-rose-600">
              {(errors.email?.message as string) || "Email is required"}
            </p>
          )}

          <Input
            label="Password"
            id="password"
            type="password"
            required
            register={register}
            errors={errors}
          />
          {errors.password && (
            <p className="mt-2 text-sm text-rose-600">
              {(errors.password?.message as string) || "Password is required"}
            </p>
          )}
        </div>

        <Button fullWidth type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
        <p className="mt-4 text-center text-sm text-slate-600">
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-blue-600 hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>

      {serverToken && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Token received</p>
          <p className="break-all">{serverToken}</p>
        </div>
      )}
    </FormLogo>
  );
}
