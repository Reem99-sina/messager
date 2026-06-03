import { create } from "zustand";

interface OnlineUsersStore {
  onlineUsers: string[];
  setOnlineUsers: (users: string[]) => void;
  addOnlineUser: (id: string) => void;
  removeOnlineUser: (id: string) => void;
}

export const useOnlineUsers = create<OnlineUsersStore>((set) => ({
  onlineUsers: [],

  setOnlineUsers: (users) =>
    set({ onlineUsers: users }),

  addOnlineUser: (id) =>
    set((state) => ({
      onlineUsers: [...state.onlineUsers, id],
    })),

  removeOnlineUser: (id) =>
    set((state) => ({
      onlineUsers: state.onlineUsers.filter(
        (userId) => userId !== id
      ),
    })),
}));