import {  User } from "@prisma/client";

export type RegisterFormValues = {
  avatar: FileList;
  name: string;
  email: string;
  password: string;
};

export type LoginFormValues = {
  email: string;
  password: string;
};

export interface Participant {
  id: string;
  conversationId: string;
  userId: string;
  lastReadAt: string | null;

  user: User
}

export interface Conversation {
  id: string;
  title: string | null;
  createdAt: string; // أو Date لو بتحوله في السيرفر

  participants: Participant[];

  messages: Message[];
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: string;
  sender: User;
  seenBy: string[]; // or a proper SeenByUser[] if you track users
  imageUrl:string;
  imageName:string
}