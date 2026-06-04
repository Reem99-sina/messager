"use client";

import { createContext, useContext, ReactNode, useEffect } from "react";

import { User } from "@prisma/client";
import { useCurrentUser } from "@/action/Register";
import { useRouter } from "next/navigation";

type CheckLoginContextType = {
  user?: User | null;
  isLoading: boolean;
};

const CheckLoginContext = createContext<CheckLoginContextType | undefined>(
  undefined,
);

export function CheckLoginProvider({ children }: { children: ReactNode }) {
  const { data: user, isLoading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div className='p-2 flex items-center justify-center'>Loading...</div>;
  }



  return (
    <CheckLoginContext.Provider
      value={{
        user,
        isLoading,
      }}
    >
      {children}
    </CheckLoginContext.Provider>
  );
}

export const useCheck = () => {
  const context = useContext(CheckLoginContext);

  if (!context) {
    throw new Error("useCheck must be used inside CheckLoginProvider");
  }

  return context;
};
