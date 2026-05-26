'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, MessageCircle, RotateCcw, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCVStore } from '@/store/cv.store';
import { createChatMessage, useAiChatStore } from '@/store/ai-chat.store';
import type { ChatResponse } from '@/types/ai.types';
import { cn } from '@/utils/cv.utils';
import { ChatProposalCard } from './ChatProposalCard';

const SUGGESTED_PROMPTS = [
  'Améliore la description de mon dernier poste',
  'Mon CV est trop long, raccourcis-le',
  'Adapte mon CV pour un poste de manager',
];

export function AiChatPanel() {
  const open = useAiChatStore((state) => state.open);
  const messages = useAiChatStore((state) => state.messages);
  const loading = useAiChatStore((state) => state.loading);
  const closeChat = useAiChatStore((state) => state.closeChat);
  const setLoading = useAiChatStore((state) => state.setLoading);
  const addMessage = useAiChatStore((state) => state.addMessage);
  const markPatchApplied = useAiChatStore((state) => state.markPatchApplied);
  const resetChat = useAiChatStore((state) => state.resetChat);

  const document = useCVStore((state) => state.document);

  const [draft, setDraft] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setDraft('');
    addMessage(createChatMessage('user', trimmed));
    setLoading(true);

    try {
      const history = useAiChatStore
        .getState()
        .messages.filter((message) => message.role === 'user' || message.role === 'assistant')
        .map((message) => ({
          role: message.role,
          content: message.content,
        }));

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          document,
          messages: history.slice(0, -1),
          userMessage: trimmed,
        }),
      });

      const data = (await response.json()) as {
        response?: ChatResponse;
        error?: string;
      };

      if (!response.ok || !data.response) {
        throw new Error(data.error ?? 'Réponse impossible');
      }

      addMessage(
        createChatMessage('assistant', data.response.reply, {
          patch: data.response.patch,
          source: data.response.source,
        }),
      );
    } catch (error) {
      addMessage(
        createChatMessage(
          'assistant',
          error instanceof Error
            ? error.message
            : 'Une erreur est survenue. Réessayez dans un instant.',
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed bottom-20 right-4 z-50 flex w-[min(100vw-2rem,380px)] flex-col overflow-hidden rounded-2xl border border-cvforge-border bg-cvforge-surface shadow-2xl"
      role="dialog"
      aria-label="Assistant IA CVForge"
      data-cvforge-chrome
    >
      <header className="flex items-center justify-between border-b border-cvforge-border bg-gradient-to-r from-cvforge-accent-blue/20 to-cvforge-accent/20 px-4 py-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-cvforge-accent" aria-hidden />
          <div>
            <h2 className="text-sm font-semibold text-cvforge-text">Assistant CV</h2>
            <p className="text-[0.65rem] text-cvforge-muted">Connaît votre CV en direct</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={resetChat}
            className="rounded-lg p-2 text-cvforge-muted hover:bg-cvforge-raised hover:text-cvforge-text"
            aria-label="Nouvelle conversation"
            title="Nouvelle conversation"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={closeChat}
            className="rounded-lg p-2 text-cvforge-muted hover:bg-cvforge-raised hover:text-cvforge-text"
            aria-label="Fermer l'assistant"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div ref={listRef} className="flex min-h-[280px] max-h-[min(50vh,420px)] flex-1 flex-col gap-3 overflow-y-auto px-3 py-3">
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-xs text-cvforge-muted">
              Posez une question ou demandez une modification — je propose un diff avant
              application.
            </p>
            <div className="flex flex-col gap-2">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className="rounded-lg border border-cvforge-border bg-cvforge-raised/60 px-3 py-2 text-left text-xs text-cvforge-text hover:border-cvforge-accent-blue/50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'max-w-[92%] rounded-2xl px-3 py-2 text-sm leading-relaxed',
              message.role === 'user'
                ? 'ml-auto bg-cvforge-accent-blue text-white'
                : 'mr-auto bg-cvforge-raised text-cvforge-text',
            )}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
            {message.role === 'assistant' && message.source && (
              <p className="mt-1 text-[0.6rem] opacity-60">
                {message.source === 'anthropic' ? 'Claude' : 'Assistant local'}
              </p>
            )}
            {message.patch && !message.patchApplied && (
              <ChatProposalCard
                patch={message.patch}
                applied={Boolean(message.patchApplied)}
                onApplied={() => markPatchApplied(message.id)}
              />
            )}
            {message.patchApplied && (
              <p className="mt-1 text-xs text-emerald-400">Patch appliqué au CV.</p>
            )}
          </div>
        ))}

        {loading && (
          <div className="mr-auto flex items-center gap-2 rounded-2xl bg-cvforge-raised px-3 py-2 text-sm text-cvforge-muted">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Réflexion…
          </div>
        )}
      </div>

      <form
        className="border-t border-cvforge-border p-3"
        onSubmit={(event) => {
          event.preventDefault();
          sendMessage(draft);
        }}
      >
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                sendMessage(draft);
              }
            }}
            rows={2}
            placeholder="Ex. Améliore mon accroche…"
            className="min-h-[44px] flex-1 resize-none rounded-xl border border-cvforge-border bg-cvforge-raised px-3 py-2 text-sm text-cvforge-text placeholder:text-cvforge-muted focus:outline-none focus:ring-2 focus:ring-cvforge-accent-blue"
          />
          <Button
            variant="primary"
            size="md"
            type="submit"
            disabled={loading || !draft.trim()}
            className="shrink-0 px-3"
            aria-label="Envoyer"
          >
            <Send className="h-4 w-4" aria-hidden />
          </Button>
        </div>
      </form>
    </div>
  );
}
