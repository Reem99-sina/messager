import { Conversation } from "@/types/user";
import { create } from "zustand";
interface conversationStore {
  conversations: Conversation | null;
  remove: () => void;
  set: (conversation: Conversation | null) => void;
}
const useConversationList = create<conversationStore>((set) => ({
  conversations: null,

  remove: () => set(() => ({ conversations: null })),
  set: (conversation) => set(() => ({ conversations: conversation })),
}));
export default useConversationList;
