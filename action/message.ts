import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "./api";
import toast from "react-hot-toast";

type SendMessageInput = {
  conversationId: string;
  body: string;
  image: FileList;
};

export function useSendMessage() {
  return useMutation({
    mutationFn: async (data: FormData) => {
      const json = await apiRequest("/api/messages", {
        method: "POST",
        body: data,
        // headers: { "Content-Type": "multipart/form-data" },
      });

      return json;
    },
    onSuccess: () => {
      toast.success("done add message");
    },
    onError:(error)=>{
      toast.error(error?.message||'invalid result')
    }
  });
}

export function useDeleteMessage() {
  return useMutation({
    mutationFn: async (messageId: string) => {
      const res = await apiRequest("/api/messages/delete", {
        method: "POST",

        body: JSON.stringify({ messageId }),
      });

      return res;
    },
  });
}
