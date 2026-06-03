import { User } from "@prisma/client";

export function saveLocalStorage({
  key,
  value,
}: {
  key: string;
  value: User | string;
}) {
   if (typeof window === "undefined") {
    return null;
  }

   window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadLocalStorage(key: string): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const value = window.localStorage.getItem(key);

  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export function clearLocalStorage(key: string) {
  if (typeof window === "undefined") {
    return null;
  }
  window.localStorage.removeItem(key);
}
