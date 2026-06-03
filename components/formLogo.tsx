"use client";

import { ReactNode } from "react";

interface FormProps {
  title: string;
  description?: string;
  children: ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function FormLogo({
  title,
  description,
  children,
  onSubmit,
}: FormProps) {
  return (
    <div className=" flex items-center justify-center bg-background text-foreground px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-card p-8 shadow-sm border border-border">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">{title}</h1>

          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          {children}
        </form>
      </div>
    </div>
  );
}