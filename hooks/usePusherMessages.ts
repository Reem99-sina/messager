// hooks/usePusherMessages.ts
"use client";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getPusherClient } from "@/libs/pusher-client";
import { Message } from "@/types/user";

export function usePusherMessages(conversationId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!conversationId) return;
    const pusherClient = getPusherClient();
    const channel = pusherClient?.subscribe(`conversation-${conversationId}`);

    channel?.bind("message:new", () => {
      queryClient.invalidateQueries({
        queryKey: ["conversation", conversationId],
      });
    });
    channel?.bind("message:delete", (data: Message) => {
      queryClient.invalidateQueries({
        queryKey: ["conversation", data?.conversationId],
      });
    });
    channel?.bind("conversation:read", () => {
      
      queryClient.invalidateQueries({
        queryKey: ["conversation",conversationId],
      });
    });

    return () => {
      channel?.unbind_all();
      pusherClient?.unsubscribe(`conversation-${conversationId}`);
    };
  }, [conversationId, queryClient]);
}
