"use client";
// import { RegisterFormValues } from "@/types/user";
import clsx from "clsx";
import { RefObject } from "react";
import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

interface InputProps<T extends FieldValues> {
  label?: string;
  id: Path<T>;
  type?: string;
  required?: boolean;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  disabled?: boolean;
  accept?: string;
  ref?: RefObject<HTMLInputElement | null>;
}

const Input = <T extends FieldValues>({
  label,
  id,
  type,
  required,
  register,
  errors,
  disabled,
  accept,
}: InputProps<T>) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="mt-2">
        <input
          id={id}
          type={type ?? "text"}
          autoComplete={id}
          disabled={disabled}
          accept={accept}
          {...register(id, { required })}
         
          className={clsx(
            `
                form-input
                block
                w-full
                rounded-md
                border-0
                py-1.5
                text-gray-500
                shadow-sm
                ring-1
                ring-inset
                ring-gray-300
                placeholder:text-gray-300
                focus:ring-1
                focus:ring-inset
                focus:ring-sky-600
                sm:text-sm
                sm:leading-6
                px-3
                `,
            errors[id] && "focus:ring-rose-500",
            disabled && "opacity-50 cursor-default",
          )}
        />
      </div>
    </div>
  );
};

export default Input;
