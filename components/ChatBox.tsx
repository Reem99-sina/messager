'use client'
import { useCheck } from "@/hooks/CheckLogin";
import { Conversation, Message } from "@/types/user";
import Button from "./button/Button";
import Input from "./input/Input";
import { useForm } from "react-hook-form";
import { useEffect, useMemo, useRef, useState } from "react";
import UserCard from "./auth/avatar";
import { useDeleteMessage, useSendMessage } from "@/action/message";
import { usePusherMessages } from "@/hooks/usePusherMessages";
import { useConversationById, useMarkAsRead } from "@/action/conversation";
import { formatTime } from "@/scripts/time";
import { useOnlineUsers } from "@/zustand/onlineUser";
import { GiPaperClip } from "react-icons/gi";
import Image from "next/image";
import { MdDelete } from "react-icons/md";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";

type FormValues = {
  message: string;
  file: FileList | null;
};

export default function ChatBox({
  conversation,
  onClose,
}: {
  conversation: Conversation;
  onClose: () => void;
}) {
  const { user } = useCheck();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { mutateAsync, isPending } = useSendMessage();
  const { data } = useConversationById(conversation.id);
  usePusherMessages(conversation.id);
  const { onlineUsers } = useOnlineUsers();
  const { mutateAsync: deleteMessage } = useDeleteMessage();
  const { mutateAsync: markAsRead } = useMarkAsRead();
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const isOnline = useMemo(() => {
    return (userId: string) => onlineUsers.includes(userId);
  }, [onlineUsers]);

  useEffect(() => {
    if (conversation.id) {
      markAsRead(conversation.id);
    }
  }, [conversation.id, markAsRead]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    defaultValues: {
      message: "",
    },
  });

  const uniqueUsers = Object.values(
    conversation.participants.reduce(
      (acc, p) => {
        acc[p.user.id] = {
          user: p.user,
          lastReadAt: p.lastReadAt,
        };
        return acc;
      },
      {} as Record<string, any>,
    ),
  );

  const isSelfChat = uniqueUsers.length === 1;
  const displayUser = isSelfChat ? uniqueUsers[0] : null;
  const otherUser = uniqueUsers.find((u) => u.user.id !== user?.id);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation.messages]);

  const onSubmit = async (data: FormValues) => {
    // if (!data.message.trim()) return;
    const formData = new FormData();

    formData.append("conversationId", conversation.id);

    formData.append("body", data.message);

    if (file) {
      formData.append("image", file);
    }
    await mutateAsync(formData)
      .then(() => {})
      .catch(() => {})
      .finally(() => {
        setFile(null);
        setPreview(null);
      });

    reset();
  };

  return (
    <div className="flex h-full flex-col bg-background">
      {/* HEADER */}
      <div className="flex items-center gap-3 border-b p-4 bg-background">
        <div className="cursor-pointer" onClick={onClose}>
          <FaRegArrowAltCircleLeft size={40} />
        </div>
        <div className=" rounded-full bg-sky-500 flex items-center justify-center text-white font-bold">
          <UserCard
            email={otherUser?.user?.email || displayUser?.user?.email || ""}
            name={otherUser?.user?.name || displayUser?.user?.name || ""}
            isOnline={isOnline(otherUser?.user?.id || displayUser?.user?.id)}
            avatar={true}
            image={
              otherUser?.user?.avatarUrl || displayUser?.user?.avatarUrl || ""
            }
            lastReadAt={
              otherUser?.lastReadAt || displayUser?.lastReadAt || null
            }
          />
        </div>

        <div>
          <h2 className="font-semibold text-sm">
            {isSelfChat
              ? displayUser?.user?.name
              : otherUser?.user?.name || displayUser?.user?.name}
          </h2>
          <p className="text-xs text-slate-500">
            {isSelfChat ? "Notes for yourself" : ""}
          </p>
          {(otherUser?.lastReadAt || displayUser?.lastReadAt) && (
            <p className="mt-1 text-xs text-sky-500">
              last seen read:{" "}
              {formatTime(otherUser?.lastReadAt || displayUser?.lastReadAt)}
            </p>
          )}
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-background">
        {data?.messages?.map((msg: Message) => {
          const isMine = msg.senderId === user?.id;

          return (
            <div
              key={msg.id}
              className={`flex relative ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
                  max-w-[70%] relative px-4 py-2 rounded-2xl text-sm shadow  
                  ${
                    isMine
                      ? "bubble-me rounded-br-sm"
                      : "bubble-other rounded-bl-sm"
                  }
                `}
              >
                {msg.imageUrl && (
                  <Image
                    src={msg.imageUrl}
                    alt={msg.imageName ?? ""}
                    className="max-w-xs rounded-lg"
                    width={320}
                    height={200}
                  />
                )}

                {msg.body && <p>{msg.body}</p>}
                {isMine && (
                  <div className="mt-1 text-right text-[11px]">
                    {msg.seenBy?.length > 0 ? (
                      <span className="text-blue-300">✓✓ Seen</span>
                    ) : (
                      <span className="text-gray-300">✓ Sent</span>
                    )}
                  </div>
                )}
                {isMine && (
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="absolute top-[25%] -left-10
            text-xs bg-red-500 text-white px-2 py-1 rounded"
                  >
                    <MdDelete />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* INPUT (WhatsApp style fixed bottom) */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 border-t p-3 bg-background"
      >
        <label
          htmlFor="file"
          className="cursor-pointer rounded-full p-2 hover:bg-slate-100"
        >
          <GiPaperClip size={20} />
        </label>
        {preview && (
          <div className="relative w-20 h-20 mb-2">
            <Image
              src={preview}
              alt="preview"
              width={80}
              height={80}
              className="rounded-lg object-cover"
            />

            <button
              type="button"
              onClick={() => {
                setPreview(null);
                setFile(null);
                setValue("file", null);
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2"
            >
              ×
            </button>
          </div>
        )}
        <input
          id="file"
          type="file"
          className="hidden"
          {...register("file")}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (!f) return;

            setFile(f);
            setPreview(URL.createObjectURL(f));
            setValue("file", e.target.files);
          }}
        />

        <div className="flex-1">
          <Input<FormValues>
            id="message"
            register={register}
            errors={errors}
            disabled={isSubmitting}
          />
        </div>

        <Button type="submit" disabled={isPending}>
          Send
        </Button>
      </form>
    </div>
  );
}
