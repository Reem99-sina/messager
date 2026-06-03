"use client";

import { User } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "./api";


type RegisterInput = {
  name: string;
  email: string;
  password: string;
  avatar?: FileList;
};

export function useRegister() {
  return useMutation({
    mutationFn: async (data: RegisterInput) => {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);

      if (data.avatar?.[0]) {
        formData.append("avatar", data.avatar[0]);
      }

      const json = await apiRequest("/api/auth/register", {
        method: "POST",
        body: formData,
      });

      return json;
    },
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      try {
        const data = await apiRequest("/api/auth/me", {
          method: "GET",
        });

        return data.user as User;
      } catch (err:any) {
        // if unauthorized, apiRequest already clears token
        if (err?.message === "Unauthorized") {
          return null;
        }
        throw err;
      }
    },
  });
}