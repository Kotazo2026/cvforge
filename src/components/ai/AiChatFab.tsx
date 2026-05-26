'use client';

import { MessageCircle } from 'lucide-react';
import { useAiChatStore } from '@/store/ai-chat.store';
import { cn } from '@/utils/cv.utils';

export function AiChatFab() {
  const open = useAiChatStore((state) => state.open);
  const toggleChat = useAiChatStore((state) => state.toggleChat);

  return (
    <button
      type="button"
      onClick={toggleChat}
      className={cn(
        'fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform',
        'bg-gradient-to-br from-cvforge-accent to-cvforge-accent-blue text-white',
        'hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-cvforge-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cvforge-bg',
        open && 'scale-95 opacity-90',
      )}
      aria-label={open ? 'Fermer l’assistant IA' : 'Ouvrir l’assistant IA'}
      aria-expanded={open}
      data-cvforge-chrome
    >
      <MessageCircle className="h-6 w-6" aria-hidden />
    </button>
  );
}
