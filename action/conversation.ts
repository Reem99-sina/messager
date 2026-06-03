'use client'
import { User } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "./api";

export  function useCreateConversation() {
      const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: User) => {
      const res = await apiRequest("/api/conversations", {
        method: "POST",

        body: JSON.stringify({
          userId: data?.id,
        }),
      });

  
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },
  });
}


export const useConversations = () => {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const res = await apiRequest("/api/conversations");

    
      return res
    },
  });
};

export const useConversationById = (
  conversationId: string
) => {
  return useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: async () => {
       
      const res = await apiRequest(`/api/conversations/${conversationId}`);

    
      return res;
    },
    enabled: !!conversationId,
  });
};

export function useMarkAsRead() {
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (conversationId: string) => {
      const res = await apiRequest("/api/conversations/read", {
        method: "POST",
       
        body: JSON.stringify({ conversationId }),
      });

      return res;
    },
    onSuccess: (_, conversationId) => {
      queryClient.invalidateQueries({
        queryKey: ["conversation", conversationId],
      });
    },
  });
}