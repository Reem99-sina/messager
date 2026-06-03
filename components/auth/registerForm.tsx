"use client";

import { useMemo, useRef, useState } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import Input from "@/components/input/Input";
import Button from "@/components/button/Button";
import { RegisterFormValues } from "@/types/user";
import FormLogo from "../formLogo";
import Image from "next/image";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useRegister } from "@/action/Register";

export default function RegisterForm() {
  const [submittedData, setSubmittedData] = useState<FieldValues | null>(null);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { mutateAsync } = useRegister();
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>();

  const avatarFile = watch("avatar");

  const avatarPreview = useMemo(() => {
    if (avatarFile?.[0]) {
      return URL.createObjectURL(avatarFile[0]);
    }
    return null;
  }, [avatarFile]);

  const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    await mutateAsync(data)
      .then(() => {
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
      })
      .catch((err) => {
       
        toast.error(err.message||"Registration failed. Please try again.");
      });
  };

  return (
    <FormLogo
      title="Create your account"
      description="Register with avatar, name, email, and password."
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4 ">
          {avatarPreview && (
            <div className="cursor-pointer" onClick={handleAvatarClick}>
              <Image
                src={avatarPreview}
                alt="Avatar Preview"
                className="h-24 w-24 rounded-full object-cover border border-border"
                width="96"
                height="96"
              />
            </div>
          )}
          <div>
            <div className="mt-2">
              <Input
                label="Avatar"
                id="avatar"
                type="file"
                required
                accept="image/*"
                register={register}
                errors={errors}
                ref={fileInputRef}
              />
            </div>
            {errors.avatar && (
              <p className="mt-2 text-sm text-rose-600">
                {errors.avatar.message as string}
              </p>
            )}
          </div>

          <Input
            label="Name"
            id="name"
            type="text"
            required
            register={register}
            errors={errors}
          />
          {errors.name && (
            <p className="mt-2 text-sm text-rose-600">
              {(errors.name?.message as string) || "Name is required"}
            </p>
          )}

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
          {isSubmitting ? "Registering..." : "Register"}
        </Button>
      </div>

      {submittedData && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Submitted values</p>
          {submittedData.error ? (
            <p className="text-rose-600">{submittedData.error}</p>
          ) : (
            <>
              <p>Name: {submittedData.name}</p>
              <p>Email: {submittedData.email}</p>
              <p>Avatar: {submittedData.avatarName || "No file uploaded"}</p>
            </>
          )}
        </div>
      )}
    </FormLogo>
  );
}
