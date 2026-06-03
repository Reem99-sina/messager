"use client";

import { useMemo, useState } from "react";
import UserCard from "./auth/avatar";

import { useCheck } from "@/hooks/CheckLogin";
import Model from "./Model";
import { useUsers } from "@/action/users";
import { useConversations, useCreateConversation } from "@/action/conversation";
import { User } from "@prisma/client";
import { Conversation } from "@/types/user";
import useConversationList from "@/zustand/conversation";
import { BiLogOut } from "react-icons/bi";
import { useAuth } from "@/hooks/Auth";
import { useOnlineUsers } from "@/zustand/onlineUser";

export default function ChatSidebar() {
  const [query, setQuery] = useState("");
  const [activeIds, ] = useState<string[]>([]);
  const { data } = useUsers();
  const { user } = useCheck();
  const { logout } = useAuth();
  const { set } = useConversationList();
  const { mutateAsync } = useCreateConversation();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const { data: conversations } = useConversations();
  const { onlineUsers } = useOnlineUsers();

  const isOnline = useMemo(() => {
    return (userId: string) => onlineUsers.includes(userId);
  }, [onlineUsers]);

  const filteredUsers = useMemo(() => {
    return data
      ?.filter((user) => user.name.toLowerCase().includes(query.toLowerCase()))
      .map((user) => ({
        ...user,
        isOnline: activeIds.includes(user.id),
      }));
  }, [query, data, activeIds]);

  const createConversation = async () => {
    if (!selectedUser) return;
    await mutateAsync(selectedUser);

    setOpen(false);
    setQuery("");
    // redirect to conversation
    // router.push(`/chat/${conversation.id}`);
  };
 
  const userInConversation = useMemo(() => {
    return (conversation: Conversation) => {
      const sameUser = conversation.participants.every(
        (ele) => ele?.userId == user?.id,
      );
      if (sameUser) {
        return conversation.participants[0]?.user;
      } else {
        return conversation.participants.find((ele) => ele?.userId != user?.id)
          ?.user;
      }
    };
  }, [user]);
  const userParticion = useMemo(() => {
    return conversations?.flatMap((conversation: Conversation) => {
      const uniqueUserIds = [
        ...new Set(conversation.participants.map((p) => p.user.id)),
      ];
      return { conversation: conversation, users: uniqueUserIds };
    });
  }, []);

  return (
    <aside className="flex h-full w-full max-w-sm flex-col rounded-3xl border border-border bg-background shadow-xl backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-border px-6 py-5">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold tracking-tight">Messages</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Start chatting with your contacts
          </p>
        </div>

        <button
          onClick={() => logout(user)}
          className="group flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm hover:bg-red-500 hover:text-white transition"
        >
          <BiLogOut size={18} />
        </button>
      </div>

      <div className="px-6 py-4">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            🔍
          </span>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users..."
            className="w-full rounded-2xl border border-border bg-card py-3 pl-10 pr-4 text-sm text-foreground outline-none transition
      focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="space-y-4">
          {query && filteredUsers && filteredUsers?.length > 0 ? (
            filteredUsers?.map((user) => (
              <UserCard
                key={user.id}
                name={user.name}
                email={user.email}
                isOnline={isOnline(user.id)}
                image={user.avatarUrl}
                onClick={() => {
                  const users = userParticion?.find(
                    (ele: { users: string[]; conversation: Conversation }) =>
                      ele?.users.includes(user?.id),
                  );

                  if (!users) {
                    setSelectedUser(user);
                    setOpen(!open);
                  } else {
                    set(users?.conversation);
                  }
                }}
              />
            ))
          ) : conversations && conversations.length > 0 ? (
            conversations?.flatMap((conversation: Conversation) => {
              const otherUser = userInConversation(conversation);
              if (!otherUser) return null;

              return (
                <UserCard
                  key={conversation.id}
                  name={otherUser?.name}
                  email={otherUser?.email}
                  image={otherUser?.avatarUrl}
                  isOnline={isOnline(otherUser?.id)}
                  onClick={() => {
                    set(conversation);
                  }}
                />
              );
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-sm text-slate-500">
              <div className="text-lg mb-2">💬</div>
              No conversations yet
              <p className="text-xs mt-1">Search users to start chatting</p>
            </div>
          )}
        </div>
      </div>
      <Model isOpen={open} onClose={() => setOpen(false)}>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="w-full max-w-md rounded-3xl bg-background p-6 shadow-xl">
            <h2 className="text-xl font-semibold">Start Conversation</h2>

            <p className="mt-3 text-sm text-slate-500">
              Do you want to start a conversation with{" "}
              <span className="font-semibold text-foreground">
                {selectedUser?.name}
              </span>
              ?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setOpen(false);
                  setSelectedUser(null);
                }}
                className="rounded-xl border px-4 py-2"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  createConversation();
                }}
                className="rounded-xl bg-sky-500 px-4 py-2 text-white"
              >
                Start Chat
              </button>
            </div>
          </div>
        </div>
      </Model>
    </aside>
  );
}
