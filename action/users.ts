'use client'
import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("/api/users");
      
      if (!res.ok) {
        throw new Error("Failed to fetch user");
      }

      const data = await res.json();

      return data.users as User[];
    },
  });
}