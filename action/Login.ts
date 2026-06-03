"use client";

import { pusherServer } from "@/libs/pusher";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "./api";


type LoginInput = {
  email: string;
  password: string;
};

export function useLogin() {
  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const json = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });

      // await pusherServer.trigger("presence-users", "user-online", {
      //   userId: json.user.id,
      // })

      return json;
    },
  });
}