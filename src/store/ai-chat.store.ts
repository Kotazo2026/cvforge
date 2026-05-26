import { create } from 'zustand';
import type { ChatMessage } from '@/types/ai.types';
import { generateId } from '@/utils/cv.utils';

interface AiChatStore {
  open: boolean;
  messages: ChatMessage[];
  loading: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  setLoading: (loading: boolean) => void;
  addMessage: (message: ChatMessage) => void;
  markPatchApplied: (messageId: string) => void;
  resetChat: () => void;
}

export const useAiChatStore = create<AiChatStore>((set) => ({
  open: false,
  messages: [],
  loading: false,
  openChat: () => set({ open: true }),
  closeChat: () => set({ open: false }),
  toggleChat: () => set((state) => ({ open: !state.open })),
  setLoading: (loading) => set({ loading }),
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  markPatchApplied: (messageId) =>
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === messageId ? { ...message, patchApplied: true } : message,
      ),
    })),
  resetChat: () =>
    set({
      messages: [],
      loading: false,
    }),
}));

export function createChatMessage(
  role: ChatMessage['role'],
  content: string,
  extra?: Partial<ChatMessage>,
): ChatMessage {
  return {
    id: generateId(),
    role,
    content,
    ...extra,
  };
}
