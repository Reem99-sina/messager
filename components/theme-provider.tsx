"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import ToasterContext from "./ToasterContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/Auth";
import { CheckLoginProvider } from "@/hooks/CheckLogin";

const queryClient = new QueryClient();

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CheckLoginProvider>
          <ToasterContext />
          {children}
          </CheckLoginProvider>
        </AuthProvider>
      </QueryClientProvider>
    </NextThemesProvider>
  );
}
