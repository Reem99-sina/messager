"use client";
import ThemeToggle from "@/components/ThemeToggle";
import ChatSidebar from "@/components/ChatSidebar";

import UserCard from "@/components/auth/avatar";
import { useCurrentUser } from "@/action/Register";
import useConversationList from "@/zustand/conversation";
import ChatBox from "@/components/ChatBox";
import { useOnlineUsers } from "@/zustand/onlineUser";
import { useMemo } from "react";

export default function Home() {
  const { data: user, isLoading } = useCurrentUser();
  const { conversations, remove } = useConversationList();
  const { onlineUsers } = useOnlineUsers();

  const isOnline = useMemo(() => {
    return user ? onlineUsers?.includes(user?.id) : false;
  }, [user, onlineUsers]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-360 flex-col gap-6 p-6 lg:flex-row">
        <div className="flex items-center justify-start gap-2 rounded-3xl border border-slate-200 bg-background px-6 py-4 shadow-sm backdrop-blur-sm dark:border-slate-800  lg:hidden">
          <div>
            <h1 className="text-lg font-semibold">Conversation list</h1>
            <p className="text-sm text-foreground">
              Browse your chats and search for users.
            </p>
          </div>
          <ThemeToggle />
        </div>

        <ChatSidebar />

        <main className="flex-1 rounded-3xl border border-slate-200 bg-background p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900/90">
          {conversations ? (
            <ChatBox conversation={conversations} onClose={() => remove()} />
          ) : (
            <>
              <div className="flex items-center justify-start gap-4">
                <UserCard
                  email={user?.email || ""}
                  name={user?.name || ""}
                  isOnline={isOnline}
                  avatar={true}
                  image={user?.avatarUrl || ""}
                />
                <div>
                  <h2 className="text-2xl font-semibold">
                    Welcome {user?.name || "to Messager"}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Choose a conversation from the list or search for a user to
                    start a new chat.
                  </p>
                </div>
                <div className="hidden lg:block">
                  <ThemeToggle />
                </div>
              </div>

              <div className="mt-12 rounded-3xl border border-dashed border-slate-200 bg-background p-12 text-center text-foreground dark:border-slate-800">
                <p className="text-lg font-medium">Try it now</p>
                <p className="mt-2 text-sm">
                  Conversations will appear here once you select a user. You can
                  also use the search box in the sidebar to find friends
                  quickly.
                </p>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
